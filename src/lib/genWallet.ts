import Web3 from 'web3';
import type { Account } from 'web3-core';
import { defaultRPC } from '../configs';

export function genWallet(): Account {
	const web3 = new Web3(defaultRPC);
	const account = web3.eth.accounts.create();
	return account;
}
