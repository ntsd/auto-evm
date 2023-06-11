import type Web3 from 'web3';
import type { TransactionConfig } from 'web3-core';

export async function sendTransaction(
	web3: Web3,
	rawTransaction: TransactionConfig,
	privateKey: string
) {
	const signedTransaction = await web3.eth.accounts.signTransaction(rawTransaction, privateKey);
	if (!signedTransaction.rawTransaction) {
		throw new Error('unable to sign transaction');
	}

	try {
		const transactionReceipt = await web3.eth.sendSignedTransaction(
			signedTransaction.rawTransaction
		);
		return transactionReceipt;
	} catch (error) {
		console.error('error while sending signed transaction:', error);
		console.error('error object:', JSON.stringify(error, null, 2));
		throw error;
	}
}
