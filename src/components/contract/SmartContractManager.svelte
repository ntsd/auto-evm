<script lang="ts">
	import SmartContractModal from './SmartContractModal.svelte';
	import SmartContractList from './SmartContractList.svelte';
	import { networksStore } from '../../stores/networksStore';

	let chainId = $networksStore.length > 0 ? $networksStore[0].chainId : '';
</script>

<div class="p-4 space-y-4">
	<div class="flex flex-col lg:flex-row justify-between">
		<h2 class="text-2xl mb-4">Contracts</h2>
		<div class="flex flex-col lg:flex-row">
			<select bind:value={chainId} class="select select-bordered">
				<option value="">Select a network</option>
				{#each $networksStore as network}
					<option value={network.chainId}>{network.name}</option>
				{/each}
			</select>
			<SmartContractModal {chainId} />
		</div>
	</div>
	<SmartContractList {chainId} />
</div>
