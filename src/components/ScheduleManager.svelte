<script lang="ts">
	import { getWallet, walletsStore } from '../stores/walletsStore';
	import { getNetwork, networksStore } from '../stores/networksStore';
	import { contractsStore, getContract } from '../stores/contractsStore';
	import { addSchedule, removeSchedule, schedulesStore } from '../stores/schedulesStore';
	import { callSmartContract } from '../lib/evmCall';
	import { addToastMessage } from '../stores/toastStore';
	import { estimateGasLimit } from '$lib/estimateGas';

	let scheduleName = '';
	let selectedWalletAddress = '';
	let selectedContractAddress = '';
	let walletPassword = '';
	let hexData = '';
	let gasLimit = 21880;
	let cronString = '*/5 * * * *';

	function estimateGasLimitHandler() {
		if (!selectedWalletAddress || !selectedContractAddress || !hexData) {
			return;
		}

		const wallet = $walletsStore.find((w) => w.address === selectedWalletAddress);
		if (!wallet) {
			return;
		}

		const contract = $contractsStore.find((c) => c.contractAddress === selectedContractAddress);
		if (!contract) {
			return;
		}

		estimateGasLimit(wallet.address, contract.contractAddress, hexData)
			.then((limit) => {
				gasLimit = limit;
			})
			.catch((e) => {
				console.error(e);
				addToastMessage('esitamte error: ' + e.message);
			});
	}

	function addScheduleHandler() {
		if (!scheduleName || !selectedWalletAddress || !selectedContractAddress || !hexData || !gasLimit) {
			return;
		}

		try {
			addSchedule(
				scheduleName,
				selectedWalletAddress,
				walletPassword,
				selectedContractAddress,
				hexData,
				gasLimit,
				cronString
			);
			addToastMessage(`Add schedule ${scheduleName}`);

			scheduleName = '';
			selectedWalletAddress = '';
			selectedContractAddress = '';
			walletPassword = '';
			hexData = '';
		} catch (e) {
			console.error(e);
			addToastMessage(`add schedule error: ${e}`);
		}
	}

	function testCall() {
		if (!selectedWalletAddress || !selectedContractAddress || !hexData) {
			return;
		}

		const wallet = getWallet(selectedWalletAddress);
		if (!wallet) {
			return;
		}

		const contract = getContract(selectedContractAddress);
		if (!contract) {
			return;
		}

		const network = getNetwork(contract.chainId);
		if (!network) {
			return;
		}

		callSmartContract(wallet, walletPassword, network, contract, hexData, gasLimit)
			.then((receipt) => {
				addToastMessage(`test success, gas used:${receipt.gasUsed}`);
			})
			.catch((e) => {
				console.error(e);
				addToastMessage(`call contract failed ${e}`);
			});
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
					<div class="label">
						<span class="label-text">Schedule Name</span>
					</div>
					<input type="text" bind:value={scheduleName} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Cron</span>
					</div>
					<input type="text" bind:value={cronString} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Select Wallet</span>
					</div>
					<select bind:value={selectedWalletAddress} class="select select-bordered">
						<option value="">Select a wallet</option>
						{#each $walletsStore as wallet}
							<option value={wallet.address}>{wallet.name}</option>
						{/each}
					</select>
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Wallet Password</span>
					</div>
					<input type="password" bind:value={walletPassword} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Select Contract</span>
					</div>
					<select bind:value={selectedContractAddress} class="select select-bordered">
						<option value="">Select a contract</option>
						{#each $contractsStore as contract}
							<option value={contract.contractAddress}>{contract.contractName}</option>
						{/each}
					</select>
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Hex Data</span>
					</div>
					<input type="text" bind:value={hexData} class="input input-bordered" />
				</div>
				<div class="form-control">
					<div class="label">
						<span class="label-text">Gas Limit</span>
					</div>
					<div class="flex flex-row">
						<input type="number" bind:value={gasLimit} class="input input-bordered flex-grow" />
						<button class="btn btn-secondary" on:click={estimateGasLimitHandler}>Estimate</button>
					</div>
				</div>
				<div class="form-control flex flex-row gap-4">
					<button on:click={testCall} class="btn btn-secondary flex-grow">Test Call</button>
					<button on:click={addScheduleHandler} class="btn btn-primary flex-grow">
						Add Schedule
					</button>
				</div>
			</div>
		</label>
	</label>
	<div class="overflow-x-auto">
		<table class="table w-full table-compact">
			<thead>
				<tr>
					<th>Name</th>
					<th>Cron</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each $schedulesStore as schedule}
					<tr>
						<td>{schedule.name}</td>
						<td>{schedule.cron}</td>
						<td>
							<button
								class="btn btn-accent"
								on:click={() => {
									removeSchedule(schedule.id);
								}}>Delete</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
