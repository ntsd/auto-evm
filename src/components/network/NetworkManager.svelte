<script lang="ts">
	import AddNetworkModal from './AddNetworkModal.svelte';
	import NetworkList from './NetworkList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Networks</h2>
		<label for="add-network" class="btn btn-primary">Add Network</label>
	</div>
	<AddNetworkModal />
	<NetworkList />
</div>
