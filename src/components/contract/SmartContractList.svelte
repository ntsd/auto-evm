<script lang="ts">
	import { contractsStore, removeContract } from '../../stores/contractsStore';
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
					<td>{contract.contractName}</td>
					<td>{contract.contractAddress}</td>
					<td>
						<button
							class="btn btn-accent"
							on:click={() => {
								removeContract(contract.contractAddress);
							}}>Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
