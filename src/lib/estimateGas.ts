import web3Provider from './web3Provider';
import type { TransactionConfig } from 'web3-core';

export async function estimateGasLimit(fromAddress: string, toAddress: string, hexData: string) {
	const gasLimitEstimationParams: TransactionConfig = {
		from: fromAddress,
		to: toAddress,
		value: '0x0',
		data: hexData
	};

	const estimatedGasLimit = await web3Provider.eth.estimateGas(gasLimitEstimationParams);
	const gasLimit = Math.floor(estimatedGasLimit * 1.1); // adjust 10 %
	return gasLimit;
}
