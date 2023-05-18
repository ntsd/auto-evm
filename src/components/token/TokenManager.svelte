<script lang="ts">
	import TokenModal from './TokenModal.svelte';
	import TokenList from './TokenList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Tokens</h2>
		<TokenModal />
	</div>
	<TokenList />
</div>
