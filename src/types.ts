export interface Wallet {
	id: string;
	name: string;
	address: string;
	encryptedPrivateKey: string;
}

export interface Network {
	chainId: string;
	name: string;
	rpcURL: string;
	currencySymbol: string;
	blockExplorerUrl: string;
}

export interface SmartContract {
	contractAddress: string;
	contractName: string;
	chainId: string;
}

export interface Schedule {
	id: string;
	name: string;
	walletId: string;
	chainId: string;
	contractAddress: string;
	hexData: string;
}
