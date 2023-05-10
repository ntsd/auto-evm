<script lang="ts">
	import AddSmartContractModal from './AddSmartContractModal.svelte';
	import SmartContractList from './SmartContractList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Contracts</h2>
		<label for="add-contract" class="btn btn-primary">Add Contract</label>
	</div>
	<AddSmartContractModal />
	<SmartContractList />
</div>
