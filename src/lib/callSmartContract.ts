import CryptoJS from 'crypto-js';
import Web3 from 'web3';
import type { TransactionReceipt, TransactionConfig } from 'web3-core';
import type { Network, SmartContract, Wallet } from '../types';
import { sendTransaction } from './sendTransaction';

export async function callSmartContract(
	wallet: Wallet,
	walletPassword: string,
	network: Network,
	contract: SmartContract,
	hexData: string,
	gasLimit: number
): Promise<TransactionReceipt> {
	const encryptedPrivateKey = wallet.encryptedPrivateKey;
	const privateKeyBytes = CryptoJS.AES.decrypt(encryptedPrivateKey, walletPassword);
	const privateKey = privateKeyBytes.toString(CryptoJS.enc.Utf8);
	if (!privateKey) {
		throw new Error('invalid wallet password');
	}

	return callSmartContractByPrivateKey(
		wallet.address,
		privateKey,
		network,
		contract,
		hexData,
		gasLimit
	);
}

export async function callSmartContractByPrivateKey(
	walletAddress: string,
	privateKey: string,
	network: Network,
	contract: SmartContract,
	hexData: string,
	gasLimit: number
): Promise<TransactionReceipt> {
	const contractAddress = contract.address;

	const web3 = new Web3(network.rpcURL);

	const gasPrice = await web3.eth.getGasPrice();
	const nonce = await web3.eth.getTransactionCount(walletAddress);
	const rawTransaction: TransactionConfig = {
		from: walletAddress,
		to: contractAddress,
		value: '0x0',
		gasPrice,
		gas: gasLimit,
		nonce,
		data: hexData
	};

	return sendTransaction(web3, rawTransaction, privateKey);
}
