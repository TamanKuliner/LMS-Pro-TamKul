/**
 * Web Crypto API client-side End-to-End Encryption (E2EE) utilities.
 * Secures confidential business ledgers, NIB, and financial records.
 */

// Generate a random AES-GCM key
export async function generateE2EEKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Export key to raw Base64 string for display
export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("raw", key);
  const bytes = new Uint8Array(exported);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Import key from Base64 string
export async function importKeyFromBase64(base64Key: string): Promise<CryptoKey> {
  const binary = atob(base64Key);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return await window.crypto.subtle.importKey(
    "raw",
    bytes.buffer,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Encrypt plaintext with AES-GCM (returns iv + ciphertext in Base64)
export async function encryptPayload(plaintext: string, key: CryptoKey): Promise<{ cipherBase64: string; ivBase64: string }> {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = enc.encode(plaintext);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );

  const cipherBytes = new Uint8Array(ciphertext);
  let cipherBin = "";
  for (let i = 0; i < cipherBytes.byteLength; i++) {
    cipherBin += String.fromCharCode(cipherBytes[i]);
  }

  let ivBin = "";
  for (let i = 0; i < iv.byteLength; i++) {
    ivBin += String.fromCharCode(iv[i]);
  }

  return {
    cipherBase64: btoa(cipherBin),
    ivBase64: btoa(ivBin),
  };
}

// Decrypt ciphertext with AES-GCM
export async function decryptPayload(cipherBase64: string, ivBase64: string, key: CryptoKey): Promise<string> {
  const cipherBin = atob(cipherBase64);
  const cipherBytes = new Uint8Array(cipherBin.length);
  for (let i = 0; i < cipherBin.length; i++) {
    cipherBytes[i] = cipherBin.charCodeAt(i);
  }

  const ivBin = atob(ivBase64);
  const ivBytes = new Uint8Array(ivBin.length);
  for (let i = 0; i < ivBin.length; i++) {
    ivBytes[i] = ivBin.charCodeAt(i);
  }

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBytes,
    },
    key,
    cipherBytes.buffer
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

// Compute SHA-256 digital hash of any string
export async function computeSHA256Hash(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
