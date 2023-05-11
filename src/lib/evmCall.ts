import web3Provider from './web3Provider';
import CryptoJS from 'crypto-js';
import Web3 from 'web3';
import type { TransactionReceipt } from 'web3-core';
import type { Network, SmartContract, Wallet } from '../types';

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

	const contractAddress = contract.address;

	web3Provider.setProvider(new Web3.providers.HttpProvider(network.rpcURL));

	const gasPrice = await web3Provider.eth.getGasPrice();
	const nonce = await web3Provider.eth.getTransactionCount(wallet.address);
	const rawTransaction = {
		from: wallet.address,
		to: contractAddress,
		value: '0x0',
		gasPrice,
		gasLimit,
		nonce,
		data: hexData
	};

	const signedTransaction = await web3Provider.eth.accounts.signTransaction(
		rawTransaction,
		privateKey
	);
	if (!signedTransaction.rawTransaction) {
		throw new Error('unable to sign transaction');
	}

	try {
		const transactionReceipt = await web3Provider.eth.sendSignedTransaction(
			signedTransaction.rawTransaction
		);
		return transactionReceipt;
	} catch (error) {
		console.error('error while sending signed transaction:', error);
		console.error('error object:', JSON.stringify(error, null, 2));
		throw error;
	}
}
