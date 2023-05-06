import {
	persist,
	createLocalStorage,
	GCMEncryption,
	createEncryptionStorage
} from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import type { Schedule } from '../types';

export const schedulesStore = persist(
	writable<Schedule[]>([]),
	createEncryptionStorage(
		createLocalStorage(),
		new GCMEncryption('3a2f9500fc967cc784923f6876abbb3dcf64b8b94ad7dc8dd1cdfc002729c8f7')
	),
	'calls'
);

export function addSchedule(
	scheduleName: string,
	walletId: string,
	chainId: string,
	contractAddress: string,
	hexData: string
) {
	const newSchedule = {
		id: crypto.randomUUID(),
		name: scheduleName,
		walletId,
		chainId,
		contractAddress,
		hexData
	};
	schedulesStore.update((s) => [...s, newSchedule]);
}
