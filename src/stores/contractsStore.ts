import {
	persist,
	createEncryptionStorage,
	createLocalStorage,
	GCMEncryption
} from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import type { SmartContract } from '../types';

export const contractsStore = persist(
	writable<SmartContract[]>([]),
	createEncryptionStorage(
		createLocalStorage(),
		new GCMEncryption('70082cd49c70af103241bd1fa3615434b5d34940fae0c1708e34818a5171698e')
	),
	'contracts'
);

export function addContract(contractName: string, contractAddress: string, chainId: string) {
	const newContract: SmartContract = { contractName, contractAddress, chainId };
	contractsStore.update((c) => [...c, newContract]);
}
