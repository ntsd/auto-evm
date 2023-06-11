import Web3 from 'web3';
import type { Network, Token } from '../types';
import type { AbiItem } from 'web3-utils';

export async function getBalance(
	walletAddress: string,
	network: Network,
	token?: Token
): Promise<string> {
	const web3 = new Web3(network.rpcURL);

	// The minimum ABI to call balanceOf function of an ERC20 token
	const minABI: AbiItem[] = [
		{
			constant: true,
			inputs: [
				{
					name: '_owner',
					type: 'address'
				}
			],
			name: 'balanceOf',
			outputs: [
				{
					name: 'balance',
					type: 'uint256'
				}
			],
			type: 'function'
		}
	];

	if (token) {
		const contract = new web3.eth.Contract(minABI, token.address);
		const balanceWei = await contract.methods.balanceOf(walletAddress).call();
		return web3.utils.fromWei(balanceWei, 'ether');
	}

	const balanceWei = await web3.eth.getBalance(walletAddress);
	return web3.utils.fromWei(balanceWei, 'ether');
}
