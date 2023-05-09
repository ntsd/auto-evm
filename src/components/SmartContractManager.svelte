<script lang="ts">
	import { addContract, contractsStore, removeContract } from '../stores/contractsStore';
	import { networksStore } from '../stores/networksStore';
	import { addToastMessage } from '../stores/toastStore';

	let selectedChainId = '';
	let contractName = '';
	let contractAddress = '';

	function addNewContract() {
		if (!selectedChainId || !contractName || !contractAddress) {
			return;
		}

		addContract(contractName, contractAddress, selectedChainId);
		addToastMessage(`Add contract ${contractName}`);

		contractName = '';
		contractAddress = '';
		selectedChainId = '';
	}
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Contracts</h2>
		<label for="add-contract" class="btn btn-primary">Add Contract</label>
	</div>
	<input type="checkbox" id="add-contract" class="modal-toggle" />
	<label for="add-contract" class="modal cursor-pointer">
		<label class="modal-box relative" for="">
			<h3 class="text-lg font-bold">Add Smart Contract</h3>
			<div class="py-4 space-y-2">
				<div class="form-control">
					<div class="label">
						<span class="label-text">Contract Name</span>
					</div>
					<input type="text" bind:value={contractName} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Contract Address</span>
					</div>
					<input type="text" bind:value={contractAddress} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Network</span>
					</div>
					<select bind:value={selectedChainId} class="select select-bordered">
						<option value="">Select a network</option>
						{#each $networksStore as network}
							<option value={network.chainId}>{network.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-control">
					<button on:click={addNewContract} class="btn btn-primary"> Add Contract </button>
				</div>
			</div>
		</label>
	</label>
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
</div>
