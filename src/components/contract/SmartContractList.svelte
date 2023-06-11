<script lang="ts">
	import { contractsStore, removeContract } from '../../stores/contractsStore';
	import SmartContractModal from './SmartContractModal.svelte';

	export let chainId: string;
</script>

<div class="overflow-x-auto">
	<table class="table w-full table-compact">
		<thead>
			<tr>
				<th>Name</th>
				<th>Address</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each $contractsStore as contract}
				<tr>
					<td>{contract.name}</td>
					<td>{contract.address}</td>
					<td>
						<SmartContractModal isEdit {contract} {chainId} />
						<button
							class="btn btn-accent"
							on:click={() => {
								removeContract(contract.address);
							}}>Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
