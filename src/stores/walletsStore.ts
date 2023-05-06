import {
	persist,
	createLocalStorage,
	createEncryptionStorage,
	GCMEncryption
} from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import type { Wallet } from '../types';

export const walletsStore = persist(
	writable<Wallet[]>([]),
	createEncryptionStorage(
		createLocalStorage(),
		new GCMEncryption('da27e13c8b9b01ca61a8eaa1b94d2977d67f3b626def9315a00483962b6a065b')
	),
	'wallets'
);

export function addWallet(name: string, address: string, encryptedPrivateKey: string) {
	const newWallet: Wallet = {
		id: crypto.randomUUID(),
		name,
		address,
		encryptedPrivateKey
	};
	walletsStore.update((w) => [...w, newWallet]);
}
