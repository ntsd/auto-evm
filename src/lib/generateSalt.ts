export function generateSalt(length: number): string {
  const buffer = new Uint8Array(length);
  window.crypto.getRandomValues(buffer);
  const salt = Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return salt;
}
