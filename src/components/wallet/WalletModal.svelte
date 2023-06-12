<script lang="ts">
	import CryptoJS from 'crypto-js';
	import { addWallet } from '../../stores/walletsStore';
	import { addToastMessage } from '../../stores/toastStore';
	import { getWalletAddress } from '$lib/getWalletAddress';
	import type { Wallet } from '../../types';
	import { genWallet } from '$lib/genWallet';

	let walletPrivateKey = '';
	let walletPassword = '';

	export let isEdit: boolean = false;
	export let wallet: Wallet = {
		name: '',
		address: '',
		encryptedPrivateKey: ''
	};

	let forId = isEdit ? `edit-wallet-${wallet.address}` : 'add-wallet';

	function addWalletHandler() {
		if (!wallet.name || !wallet.address || !walletPrivateKey) {
			return;
		}

		const encryptedPrivateKey = CryptoJS.AES.encrypt(walletPrivateKey, walletPassword).toString();
		addWallet(wallet.name, wallet.address, encryptedPrivateKey);
		addToastMessage(`Add wallet ${wallet.address}`);

		wallet.name = '';
		wallet.address = '';
		walletPrivateKey = '';
		walletPassword = '';
	}

	function generateWallet() {
		const account = genWallet()
		walletPrivateKey = account.privateKey
		wallet.address = account.address
	}
</script>

<label for={forId} class="btn btn-primary">
	{#if isEdit}
		Edit
	{:else}
		Add
	{/if}
</label>
<input type="checkbox" id={forId} class="modal-toggle" />
<label for={forId} class="modal cursor-pointer">
	<label class="modal-box relative">
		<label for={forId} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<h3 class="text-lg font-bold">Add Wallet</h3>
		<div class="py-4 space-y-2">
			<div class="form-control">
				<div class="label">
					<span class="label-text">Wallet Name</span>
				</div>
				<input type="text" bind:value={wallet.name} class="input input-bordered" />
			</div>
			{#if isEdit}
				<div class="form-control">
					<button on:click={addWalletHandler} class="btn btn-primary"> Save </button>
				</div>
			{:else}
				<div class="form-control">
					<div class="label">
						<span class="label-text">Private Key</span>
					</div>
					<div class="flex flex-row w-full">
						<input
							type="password"
							bind:value={walletPrivateKey}
							on:change={() => {
								wallet.address = getWalletAddress(walletPrivateKey);
							}}
							class="input input-bordered flex-grow"
						/>
						<button on:click={generateWallet} class="btn btn-secondary">Generate</button>
					</div>
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Wallet Address</span>
					</div>
					<input type="text" bind:value={wallet.address} disabled class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Password (optional)</span>
					</div>
					<input type="password" bind:value={walletPassword} class="input input-bordered" />
				</div>
				<div class="form-control">
					<button on:click={addWalletHandler} class="btn btn-primary"> Add Wallet </button>
				</div>
			{/if}
		</div>
	</label>
</label>
