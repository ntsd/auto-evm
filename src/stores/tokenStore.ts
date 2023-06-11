import {
	persist,
	createEncryptionStorage,
	createIndexedDBStorage,
	GCMEncryption
} from '@macfja/svelte-persistent-store';
import { get, writable } from 'svelte/store';
import type { Token } from '../types';

export let tokensStore = writable<Token[]>([]);

export function unlockTokensStore(hexPassword: string) {
	tokensStore = persist(
		writable<Token[]>([]),
		createEncryptionStorage(createIndexedDBStorage(), new GCMEncryption(hexPassword)),
		'tokens'
	);
}

export function addToken(name: string, address: string, decimal: number, chainId: string) {
	if (getToken(address)) {
		throw new Error('token address already exists');
	}

	const newToken: Token = { name, address, decimal, chainId };
	tokensStore.update((c) => [...c, newToken]);
}

export function getToken(address: string) {
	return get(tokensStore).find((c) => c.address === address);
}

export function updateToken(newToken: Token) {
	return tokensStore.update((tokens) =>
		tokens.map((c) => {
			if (c.address === newToken.address) {
				return newToken;
			}
			return c;
		})
	);
}

export function removeToken(tokenAddress: string) {
	tokensStore.update((tokens) => {
		return tokens.filter((token) => token.address !== tokenAddress);
	});
}
