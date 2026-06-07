// A simple service to handle device-specific encryption keys
// using the Web Crypto API to ensure data remains secure on the device.

const KEY_NAME = 'flashfocus-device-key';

export const getOrCreateDeviceKey = async (): Promise<CryptoKey> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DeviceVaultDB', 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('keys')) {
        db.createObjectStore('keys');
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(['keys'], 'readwrite');
      const store = transaction.objectStore('keys');
      const getRequest = store.get(KEY_NAME);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          resolve(getRequest.result);
        } else {
          // Generate a new key if not found
          window.crypto.subtle.generateKey(
            {
              name: 'AES-GCM',
              length: 256,
            },
            true, // extractable
            ['encrypt', 'decrypt']
          ).then(key => {
             // Need a new transaction because the old one is closed
             const db = request.result;
             const putTx = db.transaction(['keys'], 'readwrite');
             const putStore = putTx.objectStore('keys');
             putStore.put(key, KEY_NAME);
             putTx.oncomplete = () => resolve(key);
             putTx.onerror = () => reject(putTx.error);
          }).catch(reject);
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    };

    request.onerror = () => reject(request.error);
  });
};

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const base64ToArrayBuffer = (base64: string) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export const encryptData = async (data: string): Promise<{ ciphertext: string; iv: string }> => {
  const key = await getOrCreateDeviceKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoded
  );

  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv.buffer),
  };
};

export const decryptData = async (ciphertextStr: string, ivStr: string): Promise<string> => {
  const key = await getOrCreateDeviceKey();

  const ciphertext = base64ToArrayBuffer(ciphertextStr);
  const iv = base64ToArrayBuffer(ivStr);

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv),
    },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
};
