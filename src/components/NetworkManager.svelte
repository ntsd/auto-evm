<script lang="ts">
	import { addNetwork, networksStore, removeNetwork } from '../stores/networksStore';
	import { addToastMessage } from '../stores/toastStore';

	let networkName = '';
	let chainId = '';
	let rpcURL = '';
	let currencySymbol = '';
	let blockExplorerUrl = '';

	function addNetworkHandler() {
		if (!networkName || !chainId || !rpcURL || !currencySymbol || !blockExplorerUrl) {
			return;
		}

		addNetwork(chainId, networkName, rpcURL, currencySymbol, blockExplorerUrl);
		addToastMessage(`Add network ${networkName}`);

		chainId = '';
		currencySymbol = '';
		blockExplorerUrl = '';
	}
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Networks</h2>
		<label for="add-network" class="btn btn-primary">Add Network</label>
	</div>
	<input type="checkbox" id="add-network" class="modal-toggle" />
	<label for="add-network" class="modal cursor-pointer">
		<label class="modal-box relative" for="">
			<h3 class="text-lg font-bold">Add Network</h3>
			<div class="py-4 space-y-2">
				<div class="form-control">
					<div class="label">
						<span class="label-text">Network Name</span>
					</div>
					<input type="text" bind:value={networkName} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Chain ID</span>
					</div>
					<input type="text" bind:value={chainId} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">RPC URL</span>
					</div>
					<input type="text" bind:value={rpcURL} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Currency Symbol</span>
					</div>
					<input type="text" bind:value={currencySymbol} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Block Explorer URL</span>
					</div>
					<input type="text" bind:value={blockExplorerUrl} class="input input-bordered" />
				</div>
				<div class="form-control">
					<button on:click={addNetworkHandler} class="btn btn-primary"> Add Network </button>
				</div>
			</div>
		</label>
	</label>
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
</div>
