<script lang="ts">
	import WalletModal from './WalletModal.svelte';
	import WalletList from './WalletList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex flex-col lg:flex-row justify-between">
		<h2 class="text-2xl mb-4">Wallets</h2>
		<WalletModal />
	</div>
	<WalletList />
</div>
