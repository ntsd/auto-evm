import Web3 from 'web3';
import type { TransactionConfig } from 'web3-core';

export async function estimateGasLimit(
	rpcURL: string,
	fromAddress: string,
	toAddress: string,
	hexData: string
) {
	const web3 = new Web3(rpcURL);
	const gasLimitEstimationParams: TransactionConfig = {
		from: fromAddress,
		to: toAddress,
		value: '0x0',
		data: hexData
	};

	const estimatedGasLimit = await web3.eth.estimateGas(gasLimitEstimationParams);
	const gasLimit = Math.floor(estimatedGasLimit * 1.1); // adjust 10 %
	return gasLimit;
}
