import type { Network } from "./types";

export const pageDescription = 'Automate EVM smart contract call.';

export const githubLink = 'https://github.com/ntsd/auto-evm-wallet';

export const defaultNetwork: Network = {
	rpcURL: 'https://ethereum-goerli.publicnode.com',
	name: 'Goerli',
	chainId: '5',
	currencySymbol: 'ETH',
	blockExplorerUrl: 'https://goerli.etherscan.io'
};

export const ethNetwork: Network = {
	rpcURL: 'https://eth.llamarpc.com',
	name: 'Ethereum Mainnet',
	chainId: '1',
	currencySymbol: 'ETH',
	blockExplorerUrl: 'https://etherscan.io'
};

export const menus = [
	{
		href: '/',
		name: 'Schedule'
	},
	{
		href: '/wallet',
		name: 'Wallet'
	},
	{
		href: '/network',
		name: 'Network'
	},
	{
		href: '/token',
		name: 'Token'
	},
	{
		href: '/contract',
		name: 'Contract'
	},
];
