<script lang="ts">
	import CryptoJS from 'crypto-js';
	import { addWallet } from '../../stores/walletsStore';
	import { addToastMessage } from '../../stores/toastStore';

	let walletName = '';
	let walletAddress = '';
	let walletPrivateKey = '';
	let walletPassword = '';

	let forId = 'add-wallet';

	function addWalletHandler() {
		if (!walletName || !walletAddress || !walletPrivateKey) {
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

<label for={forId} class="btn btn-primary">Add Wallet</label>
<input type="checkbox" id={forId} class="modal-toggle" />
<label for={forId} class="modal cursor-pointer">
	<label class="modal-box relative" for={forId}>
		<label for={forId} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
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
				<button on:click={addWalletHandler} class="btn btn-primary"> Add Wallet </button>
			</div>
		</div>
	</label>
</label>
