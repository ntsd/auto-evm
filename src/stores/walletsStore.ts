import {
	persist,
	createLocalStorage,
	createEncryptionStorage,
	GCMEncryption
} from '@macfja/svelte-persistent-store';
import { get, writable } from 'svelte/store';
import type { Wallet } from '../types';

// export fake wallet store (no storage)
export let walletsStore = writable<Wallet[]>([]);

export function unlockWalletStore(hexPassword: string) {
	walletsStore = persist(
		writable<Wallet[]>([]),
		createEncryptionStorage(createLocalStorage(), new GCMEncryption(hexPassword)),
		'wallets'
	);
}

export function addWallet(name: string, address: string, encryptedPrivateKey: string) {
	if (getWallet(address)) {
		throw new Error('wallet address already exists');
	}

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

export function updateNetwork(newWallet: Wallet) {
	return walletsStore.update((wallets) =>
		wallets.map((w) => {
			if (w.address === newWallet.address) {
				return newWallet;
			}
			return w;
		})
	);
}
