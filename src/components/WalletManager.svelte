<script lang="ts">
	import CryptoJS from 'crypto-js';
	import { addWallet, removeWallet, walletsStore } from '../stores/walletsStore';
	import { addToastMessage } from '../stores/toastStore';

	let walletName = '';
	let walletAddress = '';
	let walletPrivateKey = '';
	let walletPassword = '';

	function addWalletHandler() {
		if (
			!walletName ||
			!walletAddress ||
			!walletPrivateKey
		) {
			return;
		}

		const encryptedPrivateKey = CryptoJS.AES.encrypt(walletPrivateKey, walletPassword).toString();
		addWallet(walletName, walletAddress, encryptedPrivateKey);
		addToastMessage(`Add wallet ${walletAddress}`);

		walletName = '';
		walletAddress = '';
		walletPrivateKey = '';
		walletPassword = '';
	}
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Wallets</h2>
		<label for="add-wallet" class="btn btn-primary">Add Wallet</label>
	</div>
	<input type="checkbox" id="add-wallet" class="modal-toggle" />
	<label for="add-wallet" class="modal cursor-pointer">
		<label class="modal-box relative" for="">
			<h3 class="text-lg font-bold">Add Wallet</h3>
			<div class="py-4 space-y-2">
				<div class="form-control">
					<div class="label">
						<span class="label-text">Wallet Name</span>
					</div>
					<input type="text" bind:value={walletName} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Wallet Address</span>
					</div>
					<input type="text" bind:value={walletAddress} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Private Key</span>
					</div>
					<input type="password" bind:value={walletPrivateKey} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Password</span>
					</div>
					<input type="password" bind:value={walletPassword} class="input input-bordered" />
				</div>
				<div class="form-control">
					<button on:click={addWalletHandler} class="btn btn-primary">
						Add Wallet
					</button>
				</div>
			</div>
		</label>
	</label>
	<div class="overflow-x-auto">
		<table class="table w-full table-compact">
			<thead>
				<tr>
					<th>Name</th>
					<th>Address</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each $walletsStore as wallet}
					<tr>
						<td>{wallet.name}</td>
						<td>{wallet.address}</td>
						<td>
							<button
								class="btn btn-accent"
								on:click={() => {
									removeWallet(wallet.address);
								}}>Delete</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
