<script lang="ts">
	import NetworkModal from './NetworkModal.svelte';
	import NetworkList from './NetworkList.svelte';
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Networks</h2>
		<NetworkModal />
	</div>
	<NetworkList />
</div>
