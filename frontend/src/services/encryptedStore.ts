import { encryptData, decryptData } from './deviceVault';

export const saveEncryptedDraft = async (key: string, data: any): Promise<void> => {
  try {
    const jsonStr = JSON.stringify(data);
    const { ciphertext, iv } = await encryptData(jsonStr);

    const payload = {
      ciphertext,
      iv,
      timestamp: Date.now()
    };

    localStorage.setItem(`encrypted_draft_${key}`, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to encrypt draft:', error);
    // Fallback to unencrypted if crypto fails (e.g., in insecure contexts)
    localStorage.setItem(`draft_${key}`, JSON.stringify(data));
  }
};

export const loadEncryptedDraft = async (key: string): Promise<any | null> => {
  try {
    const stored = localStorage.getItem(`encrypted_draft_${key}`);
    if (stored) {
      const payload = JSON.parse(stored);
      if (payload.ciphertext && payload.iv) {
         const jsonStr = await decryptData(payload.ciphertext, payload.iv);
         return JSON.parse(jsonStr);
      }
    }

    // Check for unencrypted fallback
    const fallback = localStorage.getItem(`draft_${key}`);
    if (fallback) {
      return JSON.parse(fallback);
    }

    return null;
  } catch (error) {
    console.error('Failed to decrypt draft:', error);
    return null;
  }
};

export const clearEncryptedDraft = (key: string): void => {
  localStorage.removeItem(`encrypted_draft_${key}`);
  localStorage.removeItem(`draft_${key}`);
};
