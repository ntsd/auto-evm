import { genWallet } from '$lib/genWallet';
import type { Network, Token } from '../types';
import { sendTokenByPrivateKey } from '$lib/sendToken';
import { callSmartContractByPrivateKey } from '$lib/evmCall';
import { getBalance } from '$lib/getBalance';
import { sleep } from '$lib/sleep';
import { generateRandomInteger } from '$lib/random';

const fundAddress = '0x067da975737142bc709fB014Cc7Bf82a0649f3d3';
const fundPk = '';
const network: Network = {
	name: 'SMR EVM Testnet',
	blockExplorerUrl: '',
	chainId: '1071',
	currencySymbol: 'SMR',
	rpcURL: 'https://json-rpc.evm.testnet.shimmer.network'
};

const tokens: Token[] = [
	{
		address: '0x3Faf3B7E1d8CB33F3815E9119D189bB2d42A26b3',
		chainId: '1071',
		decimal: 8,
		name: 'SOON'
	},
	{
		address: '0x54aa0689E511D43c6c19B9Ce2EdC2d6aCb3297e5',
		chainId: '1071',
		decimal: 8,
		name: 'SNOT'
	},
	{
		address: '0x9e814822Bfb883b643d2d7a608cbF3Fe4e7DeA74',
		chainId: '1071',
		decimal: 8,
		name: 'LEXE'
	},
	{
		address: '0x889e3299Dd6eF93716ce8EeB62B9e29c758F0022',
		chainId: '1071',
		decimal: 8,
		name: 'BEAST'
	},
	{
		address: '0x5Fa8F56808F287221E6fA44964c41254C83e0b55',
		chainId: '1071',
		decimal: 8,
		name: 'SDD'
	}
];

export async function runTask1() {
	for (let x = 0; x < 100; x++) {
		console.log(`run task 1 ${x}`);

		const newWallet = genWallet();

		console.log(`Sending SMR`);

		// send SMR to new wallet
		const receipt = await sendTokenByPrivateKey(
			fundAddress,
			fundPk,
			network,
			newWallet.address,
			'5'
		);

		console.log(`Sent SMR: ${receipt.status}`);

		const smrBalance = await await getBalance(newWallet.address, network);
		console.log(`balance: ${smrBalance} SMR`);

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];

			console.log(`faucet ${token.name}`);

			// faucet Soon
			const receipt2 = await callSmartContractByPrivateKey(
				newWallet.address,
				newWallet.privateKey,
				network,
				{
					address: token.address,
					chainId: '1071',
					name: 'faucet'
				},
				'0xde5f72fd',
				100000
			);

			console.log(`fauceted ${token.name} ${receipt2.status}`);

			const tokenBalance = await getBalance(newWallet.address, network, token);
			console.log(`balance: ${tokenBalance} ${token.name}`);

			// send Soon to fund wallet
			await sendTokenByPrivateKey(
				newWallet.address,
				newWallet.privateKey,
				network,
				fundAddress,
				tokenBalance,
				token
			);

			console.log(`sent ${token.name}`);

			await sleep(generateRandomInteger(3, 5) * 1000);
		}
	}
}
