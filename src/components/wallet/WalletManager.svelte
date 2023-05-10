<script lang="ts">
	import AddWalletModal from './AddWalletModal.svelte';
	import WalletList from './WalletList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Wallets</h2>
		<label for="add-wallet" class="btn btn-primary">Add Wallet</label>
	</div>
	<AddWalletModal />
	<WalletList />
</div>
