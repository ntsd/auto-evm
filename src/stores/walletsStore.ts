import {
	persist,
	createLocalStorage,
	createEncryptionStorage,
	GCMEncryption
} from '@macfja/svelte-persistent-store';
import { get, writable } from 'svelte/store';
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
		name,
		address,
		encryptedPrivateKey
	};
	walletsStore.update((w) => [...w, newWallet]);
}

export function getWallet(address: string) {
	return get(walletsStore).find((w) => w.address === address);
}

export function removeWallet(address: string) {
	walletsStore.update((wallets) => {
		return wallets.filter((w) => w.address !== address);
	});
}
