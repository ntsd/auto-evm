import Web3 from 'web3';
import { defaultNetwork } from '../configs';

export function getWalletAddress(privateKey: string): string {
	const web3 = new Web3(defaultNetwork.rpcURL);

	const account = web3.eth.accounts.privateKeyToAccount(privateKey);

	return account.address;
}
