import Web3 from 'web3';
import type { TransactionReceipt, TransactionConfig } from 'web3-core';
import type { AbiItem } from 'web3-utils';
import type { Network, SmartContract, Token, Wallet } from '../types';
import { sendTransaction } from './sendTransaction';

// approveToken approve token to use the smart contract
export async function approveToken(
	wallet: Wallet,
	walletPassword: string,
	network: Network,
	token: Token,
	contract: SmartContract,
	amount: string
): Promise<TransactionReceipt> {
	const encryptedPrivateKey = wallet.encryptedPrivateKey;
	const privateKeyBytes = CryptoJS.AES.decrypt(encryptedPrivateKey, walletPassword);
	const privateKey = privateKeyBytes.toString(CryptoJS.enc.Utf8);
	if (!privateKey) {
		throw new Error('invalid wallet password');
	}

	return approveTokenByPrivateKey(wallet.address, privateKey, network, contract, token, amount);
}

export async function approveTokenByPrivateKey(
	walletAddress: string,
	privateKey: string,
	network: Network,
	contract: SmartContract,
	token: Token,
	amount: string
): Promise<TransactionReceipt> {
	const web3 = new Web3(network.rpcURL);

	const allowanceAmount = web3.utils.toWei(amount, 'ether');

	// The minimum ABI to call approve function of an ERC20 token
	const minABI: AbiItem[] = [
		{
			constant: false,
			inputs: [
				{
					name: '_spender',
					type: 'address'
				},
				{
					name: '_value',
					type: 'uint256'
				}
			],
			name: 'approve',
			outputs: [
				{
					name: '',
					type: 'bool'
				}
			],
			type: 'function'
		}
	];

	const contractData = new web3.eth.Contract(minABI, token.address);

	const data = contractData.methods.approve(contract.address, allowanceAmount).encodeABI();

	const gasPrice = await web3.eth.getGasPrice();
	const nonce = await web3.eth.getTransactionCount(walletAddress);
	const rawTransaction: TransactionConfig = {
		from: walletAddress,
		gasPrice,
		gas: web3.utils.toHex(210000),
		to: token.address,
		value: '0x0',
		data: data,
		nonce
	};

	return sendTransaction(web3, rawTransaction, privateKey);
}
