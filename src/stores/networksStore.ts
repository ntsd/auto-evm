import {
	persist,
	createLocalStorage,
	createEncryptionStorage,
	GCMEncryption
} from '@macfja/svelte-persistent-store';
import { get, writable } from 'svelte/store';
import type { Network } from '../types';

export const networksStore = persist(
	writable<Network[]>([]),
	createEncryptionStorage(
		createLocalStorage(),
		new GCMEncryption('14bc628bfee7441619ee3ecb45ea158afec659900222a850cd051ddbffe3ddea')
	),
	'networks'
);

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
