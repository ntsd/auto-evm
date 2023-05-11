<script lang="ts">
	import SmartContractModal from './SmartContractModal.svelte';
	import SmartContractList from './SmartContractList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Contracts</h2>
		<SmartContractModal />
	</div>
	<SmartContractList />
</div>
