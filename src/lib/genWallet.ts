import Web3 from 'web3';
import type { Account } from 'web3-core';
import { defaultNetwork } from '../configs';

export function genWallet(): Account {
	const web3 = new Web3(defaultNetwork.rpcURL);
	const account = web3.eth.accounts.create();
	return account;
}
