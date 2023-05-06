<script lang="ts">
	import { walletsStore } from '../stores/walletsStore';
	import { networksStore } from '../stores/networksStore';
	import { contractsStore } from '../stores/contractsStore';
	import { addSchedule, schedulesStore } from '../stores/schedulesStore';
	import { callSmartContract } from '../lib/evmCall';
	import { addToastMessage } from '../stores/toastStore';

	let scheduleName = '';
	let selectedWalletId = '';
	let selectedChainId = '';
	let selectedContractAddress = '';
	let walletPassword = '';
	let hexData = '';

	function addScheduleHandler() {
		if (!selectedWalletId || !selectedChainId || !selectedContractAddress) {
			return;
		}

		addSchedule(scheduleName, selectedWalletId, selectedChainId, selectedContractAddress, hexData);
		addToastMessage(`Add schedule ${scheduleName}`);

		scheduleName = '';
		selectedWalletId = '';
		selectedChainId = '';
		selectedContractAddress = '';
		walletPassword = '';
		hexData = '';
	}

	async function testCall() {
		if (!selectedWalletId || !selectedChainId || !selectedContractAddress) {
			return;
		}

		const wallet = $walletsStore.find((w) => w.id === selectedWalletId);
		if (!wallet) {
			return;
		}

		const network = $networksStore.find((n) => n.chainId === selectedChainId);
		if (!network) {
			return;
		}

		const contract = $contractsStore.find((c) => c.contractAddress === selectedContractAddress);
		if (!contract) {
			return;
		}

		try {
			await callSmartContract(wallet, walletPassword, network, contract, hexData);
		} catch (e) {
			addToastMessage(`call contract failed ${e}`);
		}
	}
</script>

<div class="p-4 space-y-4">
	<div class="flex justify-between">
		<h2 class="text-2xl mb-4">Schedules</h2>
		<label for="add-schedule" class="btn btn-primary">Add Schedule</label>
	</div>
	<input type="checkbox" id="add-schedule" class="modal-toggle" />
	<label for="add-schedule" class="modal cursor-pointer">
		<label class="modal-box relative" for="">
			<h3 class="text-lg font-bold">Add Schedule</h3>
			<div class="py-4 space-y-2">
				<div class="form-control">
					<label class="label">
						<span class="label-text">Select Wallet</span>
					</label>
					<select bind:value={selectedWalletId} class="select select-bordered">
						<option value="">Select a wallet</option>
						{#each $walletsStore as wallet}
							<option value={wallet.id}>{wallet.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Select Network</span>
					</label>
					<select bind:value={selectedChainId} class="select select-bordered">
						<option value="">Select a network</option>
						{#each $networksStore as network}
							<option value={network.chainId}>{network.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Select Contract</span>
					</label>
					<select bind:value={selectedContractAddress} class="select select-bordered">
						<option value="">Select a contract</option>
						{#each $contractsStore as contract}
							<option value={contract.contractAddress}>{contract.contractName}</option>
						{/each}
					</select>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Wallet Password</span>
					</label>
					<input type="password" bind:value={walletPassword} class="input input-bordered" />
				</div>
				<div class="form-control flex flex-row gap-4">
					<button on:click={testCall} class="btn btn-secondary flex-grow">Test Call</button>
					<label
						on:keypress={addScheduleHandler}
						for="add-schedule"
						class="btn btn-primary flex-grow"
					>
						Add Schedule
					</label>
				</div>
			</div>
		</label>
	</label>
	<div class="overflow-x-auto">
		<table class="table w-full table-compact">
			<thead>
				<tr>
					<th>Name</th>
					<th>Hex Data</th>
				</tr>
			</thead>
			<tbody>
				{#each $schedulesStore as schedule}
					<tr>
						<td>{schedule.name}</td>
						<td>{schedule.hexData}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
