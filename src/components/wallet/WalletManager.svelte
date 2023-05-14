<script lang="ts">
	import AddWalletModal from './AddWalletModal.svelte';
	import WalletList from './WalletList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Wallets</h2>
		<AddWalletModal />
	</div>
	<WalletList />
</div>
