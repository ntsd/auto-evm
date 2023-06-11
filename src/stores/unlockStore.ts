import { get, writable } from 'svelte/store';
import type { Unlock } from '../types';
import {
	GCMEncryption,
	createEncryptionStorage,
	createLocalStorage,
	persist
} from '@macfja/svelte-persistent-store';
import { hashString } from '$lib/hash';
import { getFingerprint } from '$lib/fingerprint';
import { updateSetting } from './settingStore';
import { unlockWalletStore } from './walletsStore';
import { unlockContractStore } from './contractsStore';
import { unlockTokensStore } from './tokenStore';
import { unlockNetworkStore } from './networksStore';
import { unlockSchedulesStore } from './schedulesStore';

const checkUnlockKey = 'checkUnlock';
const salt = hashString(getFingerprint());

export const unlockStore = writable<Unlock>({
	hashPassword: '',
	isUnlocked: false
});

export function getUnlock() {
	return get(unlockStore);
}

export function updateUnlock(partialUnlock: Partial<Unlock>) {
	unlockStore.set({ ...getUnlock(), ...partialUnlock });
}

export async function newPassword(password: string) {
	const hashPassword = await hashString(password, salt);

	persist(
		writable<boolean>(true),
		createEncryptionStorage(createLocalStorage(), new GCMEncryption(hashPassword)),
		checkUnlockKey
	);

	updateUnlock({ hashPassword });
	updateSetting({ isFirstTime: false });
}

export async function enterPassword(password: string) {
	const hashPassword = await hashString(password, salt);

	const checkUnlockStore = persist(
		writable<boolean>(),
		createEncryptionStorage(createLocalStorage(), new GCMEncryption(hashPassword)),
		checkUnlockKey
	);
	if (get(checkUnlockStore) === true) {
		unlockStore.set({
			isUnlocked: true,
			hashPassword: hashPassword
		});

		unlockWalletStore(hashPassword);
		unlockContractStore(hashPassword);
		unlockNetworkStore(hashPassword);
		unlockSchedulesStore(hashPassword);
		unlockTokensStore(hashPassword);

		return;
	}

	throw new Error('wrong password');
}
