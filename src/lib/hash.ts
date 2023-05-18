import * as CryptoJS from 'crypto-js';

export function hashString(s: string, salt = 'defaultSalt'): string {
	return CryptoJS.SHA256(s + salt).toString();
}
