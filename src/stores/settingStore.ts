import { get, writable } from 'svelte/store';
import type { Setting } from '../types';
import { createLocalStorage, persist } from '@macfja/svelte-persistent-store';
import { generateSalt } from '$lib/generateSalt';

export const settingStore = persist(
	writable<Setting>({
		isFirstTime: true,
		salt: generateSalt(10)
	}),
	createLocalStorage(),
	'setting'
);

export function getSetting() {
	return get(settingStore);
}

export function updateSetting(partialSetting: Partial<Setting>) {
	settingStore.set({ ...getSetting(), ...partialSetting });
}
