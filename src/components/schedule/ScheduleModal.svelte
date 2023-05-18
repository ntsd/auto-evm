<script lang="ts">
	import { getWallet, walletsStore } from '../../stores/walletsStore';
	import { getNetwork } from '../../stores/networksStore';
	import { contractsStore, getContract } from '../../stores/contractsStore';
	import { addSchedule, updateSchedule } from '../../stores/schedulesStore';
	import { callSmartContract } from '../../lib/evmCall';
	import { addToastMessage } from '../../stores/toastStore';
	import { estimateGasLimit } from '$lib/estimateGas';
	import type { Schedule } from '../../types';
	import ProcessingQueue from '$lib/processingQueue';
	import { sleep } from '$lib/sleep';
	import { generateRandomInteger } from '$lib/random';

	export let isEdit: boolean = false;
	export let schedule: Schedule = {
		id: '',
		name: '',
		walletAddress: '',
		walletPassword: '',
		contractAddress: '',
		hexData: '',
		cron: '*/5 * * * *',
		gasLimit: 21880,
		enabled: true
	};
	let testCallRepeatTimes = 10;

	let forId = isEdit ? `edit-schedule-${schedule.id}` : 'add-schedule';

	function estimateGasLimitHandler() {
		if (!schedule.walletAddress || !schedule.contractAddress || !schedule.hexData) {
			return;
		}

		const wallet = $walletsStore.find((w) => w.address === schedule.walletAddress);
		if (!wallet) {
			return;
		}

		const contract = $contractsStore.find((c) => c.address === schedule.contractAddress);
		if (!contract) {
			return;
		}

		const network = getNetwork(contract.chainId);
		if (!network) {
			return;
		}

		estimateGasLimit(network.rpcURL, wallet.address, contract.address, schedule.hexData)
			.then((limit) => {
				schedule.gasLimit = limit;
			})
			.catch((e) => {
				console.error(e);
				addToastMessage('esitamte error: ' + e.message);
			});
	}

	function addScheduleHandler() {
		if (
			!schedule.name ||
			!schedule.walletAddress ||
			!schedule.contractAddress ||
			!schedule.hexData ||
			!schedule.gasLimit ||
			!schedule.cron
		) {
			return;
		}

		try {
			addSchedule(
				schedule.name,
				schedule.walletAddress,
				schedule.walletPassword,
				schedule.contractAddress,
				schedule.hexData,
				schedule.gasLimit,
				schedule.cron
			);
			addToastMessage(`Add schedule ${schedule.name}`);

			schedule.name = '';
			schedule.walletAddress = '';
			schedule.walletPassword = '';
			schedule.contractAddress = '';
			schedule.hexData = '';
		} catch (e) {
			console.error(e);
			addToastMessage(`add schedule error: ${e}`);
		}
	}

	function updateScheduleHandler() {
		if (
			!schedule.name ||
			!schedule.walletAddress ||
			!schedule.contractAddress ||
			!schedule.hexData ||
			!schedule.gasLimit ||
			!schedule.cron
		) {
			return;
		}

		updateSchedule(schedule);
		addToastMessage(`Update schedule ${schedule.name}`);
	}

	function testCall() {
		if (!schedule.walletAddress || !schedule.contractAddress || !schedule.hexData) {
			return;
		}

		const wallet = getWallet(schedule.walletAddress);
		if (!wallet) {
			return;
		}

		const contract = getContract(schedule.contractAddress);
		if (!contract) {
			return;
		}

		const network = getNetwork(contract.chainId);
		if (!network) {
			return;
		}

		callSmartContract(
			wallet,
			schedule.walletPassword,
			network,
			contract,
			schedule.hexData,
			schedule.gasLimit
		)
			.then((receipt) => {
				addToastMessage(`test success, gas used:${receipt.gasUsed}`);
			})
			.catch((e) => {
				console.error(e);
				addToastMessage(`call contract failed ${e}`);
			});
	}

	function testCallRepeat() {
		if (!schedule.walletAddress || !schedule.contractAddress || !schedule.hexData) {
			return;
		}

		const wallet = getWallet(schedule.walletAddress);
		if (!wallet) {
			return;
		}

		const contract = getContract(schedule.contractAddress);
		if (!contract) {
			return;
		}

		const network = getNetwork(contract.chainId);
		if (!network) {
			return;
		}

		const schedulerCallQueue = new ProcessingQueue<void>();

		for (let i = 1; i <= testCallRepeatTimes; i++) {
			schedulerCallQueue.enqueue(async () => {
				try {
					const receipt = await callSmartContract(
						wallet,
						schedule.walletPassword,
						network,
						contract,
						schedule.hexData,
						schedule.gasLimit
					);
					const msg = `schedule call ${schedule.name} (${i}) status: ${receipt.status}`;
					console.log(msg);
					addToastMessage(msg, 'success');

					await sleep(generateRandomInteger(10, 20) * 1000); // sleep 20 - 30 seconds before the next queue
				} catch (e) {
					const errMsg = `schedule ${schedule.name} (${i}) error: ${e}`;
					console.error(errMsg);
					addToastMessage(errMsg, 'error');
				}
			});
		}
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
				Edit Schedule
			{:else}
				Add Schedule
			{/if}
		</h3>
		<div class="py-4 space-y-2">
			<div class="form-control">
				<label class="label cursor-pointer">
					<span class="label-text">Enabled</span>
					<input type="checkbox" class="toggle toggle-primary" bind:checked={schedule.enabled} />
				</label>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Schedule Name</span>
				</div>
				<input type="text" bind:value={schedule.name} class="input input-bordered" />
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Cron</span>
				</div>
				<input type="text" bind:value={schedule.cron} class="input input-bordered" />
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Select Wallet</span>
				</div>
				<select bind:value={schedule.walletAddress} class="select select-bordered">
					<option value="">Select a wallet</option>
					{#each $walletsStore as wallet}
						<option value={wallet.address}>{wallet.name}</option>
					{/each}
				</select>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Wallet Password (optional)</span>
				</div>
				<input type="password" bind:value={schedule.walletPassword} class="input input-bordered" />
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Select Contract</span>
				</div>
				<select bind:value={schedule.contractAddress} class="select select-bordered">
					<option value="">Select a contract</option>
					{#each $contractsStore as contract}
						<option value={contract.address}>{contract.name}</option>
					{/each}
				</select>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Hex Data</span>
				</div>
				<input type="text" bind:value={schedule.hexData} class="input input-bordered" />
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Gas Limit</span>
				</div>
				<div class="flex flex-row">
					<input
						type="number"
						bind:value={schedule.gasLimit}
						class="input input-bordered flex-grow"
					/>
					<button class="btn btn-secondary" on:click={estimateGasLimitHandler}>Estimate</button>
				</div>
			</div>
			<div class="form-control flex flex-row gap-4">
				<button on:click={testCall} class="btn btn-secondary flex-grow">Test Call</button>
				{#if isEdit}
					<button on:click={updateScheduleHandler} class="btn btn-primary flex-grow"> Save </button>
				{:else}
					<button on:click={addScheduleHandler} class="btn btn-primary flex-grow"> Add </button>
				{/if}
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Call Repeat Times</span>
				</div>
				<input
					type="number"
					bind:value={testCallRepeatTimes}
					class="input input-bordered flex-grow"
				/>
			</div>
			<div class="form-control flex flex-row gap-4">
				<button on:click={testCallRepeat} class="btn btn-secondary flex-grow">Call Repeats</button>
			</div>
		</div>
	</label>
</label>
