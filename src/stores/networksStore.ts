import {
	persist,
	createLocalStorage,
	createEncryptionStorage,
	GCMEncryption
} from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
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
	const newNetwork: Network = { name, chainId, rpcURL, currencySymbol, blockExplorerUrl };
	networksStore.update((n) => [...n, newNetwork]);
}
