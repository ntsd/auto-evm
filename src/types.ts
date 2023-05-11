export interface Wallet {
	address: string;
	name: string;
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
	address: string;
	name: string;
	chainId: string;
}

export interface Schedule {
	id: string;
	cron: string;
	name: string;
	walletAddress: string;
	walletPassword: string;
	contractAddress: string;
	hexData: string;
	gasLimit: number;
}
