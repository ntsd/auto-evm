import {
	persist,
	createEncryptionStorage,
	createIndexedDBStorage,
	GCMEncryption
} from '@macfja/svelte-persistent-store';
import { get, writable } from 'svelte/store';
import type { SmartContract } from '../types';

export let contractsStore = writable<SmartContract[]>([]);

export function unlockContractStore(hexPassword: string) {
	contractsStore = persist(
		writable<SmartContract[]>([]),
		createEncryptionStorage(createIndexedDBStorage(), new GCMEncryption(hexPassword)),
		'contracts'
	);
}

export function addContract(name: string, address: string, chainId: string) {
	if (getContract(address)) {
		throw new Error('contract address already exists');
	}

	const newContract: SmartContract = { name, address, chainId };
	contractsStore.update((c) => [...c, newContract]);
}

export function getContract(address: string) {
	return get(contractsStore).find((c) => c.address === address);
}

export function updateContract(newContract: SmartContract) {
	return contractsStore.update((contracts) =>
		contracts.map((c) => {
			if (c.address === newContract.address) {
				return newContract;
			}
			return c;
		})
	);
}

export function removeContract(contractAddress: string) {
	contractsStore.update((contracts) => {
		return contracts.filter((contract) => contract.address !== contractAddress);
	});
}
