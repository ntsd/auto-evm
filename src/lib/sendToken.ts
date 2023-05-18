import Web3 from 'web3';
import type { TransactionReceipt, TransactionConfig } from 'web3-core';
import type { AbiItem } from 'web3-utils';
import type { Network, Token, Wallet } from '../types';
import { sendTransaction } from './sendTransaction';

export async function sendToken(
	wallet: Wallet,
	walletPassword: string,
	network: Network,
	recipientAddress: string,
	amount: string,
	token?: Token
): Promise<TransactionReceipt> {
	const encryptedPrivateKey = wallet.encryptedPrivateKey;
	const privateKeyBytes = CryptoJS.AES.decrypt(encryptedPrivateKey, walletPassword);
	const privateKey = privateKeyBytes.toString(CryptoJS.enc.Utf8);
	if (!privateKey) {
		throw new Error('invalid wallet password');
	}

	return sendTokenByPrivateKey(
		wallet.address,
		privateKey,
		network,
		recipientAddress,
		amount,
		token
	);
}

export async function sendTokenByPrivateKey(
	walletAddress: string,
	privateKey: string,
	network: Network,
	recipientAddress: string,
	amount: string,
	token?: Token
): Promise<TransactionReceipt> {
	const web3 = new Web3(network.rpcURL);

	const amountToSend = web3.utils.toWei(amount, 'ether');

	let rawTransaction: TransactionConfig;
	if (token) {
		// The minimum ABI to send an ERC20 transaction
		const minABI: AbiItem[] = [
			{
				constant: false,
				inputs: [
					{
						name: '_to',
						type: 'address'
					},
					{
						name: '_value',
						type: 'uint256'
					}
				],
				name: 'transfer',
				outputs: [
					{
						name: '',
						type: 'bool'
					}
				],
				type: 'function'
			}
		];
		const contract = new web3.eth.Contract(minABI, token.address);
		const data = contract.methods.transfer(recipientAddress, amountToSend).encodeABI();

		const gasPrice = await web3.eth.getGasPrice();
		const nonce = await web3.eth.getTransactionCount(walletAddress);
		rawTransaction = {
			from: walletAddress,
			gasPrice,
			gas: web3.utils.toHex(210000),
			to: token.address,
			value: '0x0',
			data: data,
			nonce
		};
	} else {
		const gasPrice = await web3.eth.getGasPrice();
		const nonce = await web3.eth.getTransactionCount(walletAddress);
		rawTransaction = {
			from: walletAddress,
			gasPrice,
			gas: web3.utils.toHex(210000),
			to: recipientAddress,
			value: web3.utils.toHex(amountToSend),
			nonce
		};
	}

	return sendTransaction(web3, rawTransaction, privateKey);
}
