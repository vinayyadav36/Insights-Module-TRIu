import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveEncryptedDraft, loadEncryptedDraft, clearEncryptedDraft } from './encryptedStore';

// Mock the deviceVault
vi.mock('./deviceVault', () => ({
  encryptData: vi.fn().mockImplementation(async (data) => ({
    ciphertext: btoa(data),
    iv: btoa('test-iv')
  })),
  decryptData: vi.fn().mockImplementation(async (ciphertext) => atob(ciphertext))
}));

describe('encryptedStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should save and load an encrypted draft successfully', async () => {
    const key = 'test-draft';
    const data = { title: 'Secret Project', id: 123 };

    await saveEncryptedDraft(key, data);

    // Ensure it's in localstorage and structured properly
    const stored = localStorage.getItem(`encrypted_draft_${key}`);
    expect(stored).not.toBeNull();
    const parsedStored = JSON.parse(stored!);
    expect(parsedStored.ciphertext).toBeDefined();
    expect(parsedStored.iv).toBeDefined();

    // Verify loading mechanism
    const loadedData = await loadEncryptedDraft(key);
    expect(loadedData).toEqual(data);
  });

  it('should fall back to unencrypted draft if encrypted draft is missing but unencrypted exists', async () => {
    const key = 'test-draft';
    const data = { title: 'Old Unencrypted Draft' };

    localStorage.setItem(`draft_${key}`, JSON.stringify(data));

    const loadedData = await loadEncryptedDraft(key);
    expect(loadedData).toEqual(data);
  });

  it('should clear both encrypted and unencrypted drafts', async () => {
    const key = 'test-draft';
    localStorage.setItem(`encrypted_draft_${key}`, '{}');
    localStorage.setItem(`draft_${key}`, '{}');

    clearEncryptedDraft(key);

    expect(localStorage.getItem(`encrypted_draft_${key}`)).toBeNull();
    expect(localStorage.getItem(`draft_${key}`)).toBeNull();
  });
});
