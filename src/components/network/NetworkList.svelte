<script lang="ts">
	import { networksStore, removeNetwork } from '../../stores/networksStore';
	import NetworkModal from './NetworkModal.svelte';
</script>

<div class="overflow-x-auto">
	<table class="table w-full table-compact">
		<thead>
			<tr>
				<th>Name</th>
				<th>Chain ID</th>
				<th>RPC URL</th>
				<th>Currency Symbol</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each $networksStore as network}
				<tr>
					<td>{network.name}</td>
					<td>{network.chainId}</td>
					<td>{network.rpcURL}</td>
					<td>{network.currencySymbol}</td>
					<td>
						<NetworkModal isEdit={true} {network} />
						<button
							class="btn btn-accent"
							on:click={() => {
								removeNetwork(network.chainId);
							}}>Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
