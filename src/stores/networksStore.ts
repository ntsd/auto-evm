import {
	persist,
	createEncryptionStorage,
	GCMEncryption,
	createIndexedDBStorage
} from '@macfja/svelte-persistent-store';
import { get, writable } from 'svelte/store';
import type { Network } from '../types';
import { defaultNetwork, ethNetwork } from '../configs';

export let networksStore = writable<Network[]>([]);

export function unlockNetworkStore(hexPassword: string) {
	networksStore = persist(
		writable<Network[]>([defaultNetwork, ethNetwork]),
		createEncryptionStorage(createIndexedDBStorage(), new GCMEncryption(hexPassword)),
		'networks'
	);
}

export function addNetwork(
	chainId: string,
	name: string,
	rpcURL: string,
	currencySymbol: string,
	blockExplorerUrl: string
) {
	if (getNetwork(chainId)) {
		throw new Error('chain id already exists');
	}

	const newNetwork: Network = { name, chainId, rpcURL, currencySymbol, blockExplorerUrl };
	networksStore.update((n) => [...n, newNetwork]);
}

export function getNetwork(chainId: string) {
	return get(networksStore).find((n) => n.chainId === chainId);
}

export function updateNetwork(newNetwork: Network) {
	return networksStore.update((networks) =>
		networks.map((c) => {
			if (c.chainId === newNetwork.chainId) {
				return newNetwork;
			}
			return c;
		})
	);
}

export function removeNetwork(chainId: string) {
	networksStore.update((networks) => {
		return networks.filter((n) => n.chainId !== chainId);
	});
}
