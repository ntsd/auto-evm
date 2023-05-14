<script lang="ts">
	import { addContract, updateContract } from '../../stores/contractsStore';
	import { networksStore } from '../../stores/networksStore';
	import { addToastMessage } from '../../stores/toastStore';
	import type { SmartContract } from '../../types';

	export let isEdit: boolean = false;
	export let contract: SmartContract = {
		name: '',
		address: '',
		chainId: ''
	};

	let forId = isEdit ? `edit-contract-${contract.address}` : 'add-contract';

	function updateContractController() {
		if (!contract.chainId || !contract.name || !contract.address) {
			return;
		}

		updateContract(contract);
		addToastMessage(`Update contract ${contract.name}`);
	}

	function addNewContract() {
		if (!contract.chainId || !contract.name || !contract.address) {
			return;
		}

		addContract(contract.name, contract.address, contract.chainId);
		addToastMessage(`Add contract ${contract.name}`);

		contract.name = '';
		contract.address = '';
		contract.chainId = '';
	}
</script>

<label for={forId} class="btn btn-primary">
	{#if isEdit}
		Edit
	{:else}
		Add
	{/if}
</label>
<input type="checkbox" id={forId} class="modal-toggle" />
<label for={forId} class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<label for={forId} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<h3 class="text-lg font-bold">
			{#if isEdit}
				Edit Smart Contract
			{:else}
				Add Smart Contract
			{/if}
		</h3>
		<div class="py-4 space-y-2">
			<div class="form-control">
				<div class="label">
					<span class="label-text">Contract Name</span>
				</div>
				<input type="text" bind:value={contract.name} class="input input-bordered" />
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Contract Address</span>
				</div>
				<input
					type="text"
					bind:value={contract.address}
					disabled={isEdit}
					class="input input-bordered"
				/>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Network</span>
				</div>
				<select bind:value={contract.chainId} class="select select-bordered">
					<option value="">Select a network</option>
					{#each $networksStore as network}
						<option value={network.chainId}>{network.name}</option>
					{/each}
				</select>
			</div>
			<div class="form-control">
				{#if isEdit}
					<button on:click={updateContractController} class="btn btn-primary"> Save </button>
				{:else}
					<button on:click={addNewContract} class="btn btn-primary"> Add Contract </button>
				{/if}
			</div>
		</div>
	</label>
</label>
