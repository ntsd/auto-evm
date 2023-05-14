<script lang="ts">
	import { addNetwork, updateNetwork } from '../../stores/networksStore';
	import { addToastMessage } from '../../stores/toastStore';
	import type { Network } from '../../types';

	export let isEdit: boolean = false;
	export let network: Network = {
		name: '',
		chainId: '',
		rpcURL: '',
		currencySymbol: '',
		blockExplorerUrl: ''
	};

	let forId = isEdit ? `edit-network-${network.chainId}` : 'add-network';

	function addNetworkHandler() {
		if (
			!network.name ||
			!network.chainId ||
			!network.rpcURL ||
			!network.currencySymbol ||
			!network.blockExplorerUrl
		) {
			return;
		}

		addNetwork(
			network.chainId,
			network.name,
			network.rpcURL,
			network.currencySymbol,
			network.blockExplorerUrl
		);
		addToastMessage(`Add network ${network.name}`);

		network.name = '';
		network.chainId = '';
		network.rpcURL = '';
		network.currencySymbol = '';
		network.blockExplorerUrl = '';
	}

	function updateNetworkHandler() {
		if (
			!network.name ||
			!network.chainId ||
			!network.rpcURL ||
			!network.currencySymbol ||
			!network.blockExplorerUrl
		) {
			return;
		}

		updateNetwork(network);
		addToastMessage(`Update network ${network.name}`);
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
				Edit Network
			{:else}
				Add Network
			{/if}
		</h3>
		<div class="py-4 space-y-2">
			<div class="form-control">
				<div class="label">
					<span class="label-text">Network Name</span>
				</div>
				<input type="text" bind:value={network.name} class="input input-bordered" />
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Chain ID</span>
				</div>
				<input
					type="text"
					bind:value={network.chainId}
					class="input input-bordered"
					disabled={isEdit}
				/>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">RPC URL</span>
				</div>
				<input type="text" bind:value={network.rpcURL} class="input input-bordered" />
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Currency Symbol</span>
				</div>
				<input type="text" bind:value={network.currencySymbol} class="input input-bordered" />
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Block Explorer URL</span>
				</div>
				<input type="text" bind:value={network.blockExplorerUrl} class="input input-bordered" />
			</div>
			<div class="form-control">
				{#if isEdit}
					<button on:click={updateNetworkHandler} class="btn btn-primary"> Save </button>
				{:else}
					<button on:click={addNetworkHandler} class="btn btn-primary"> Add Network </button>
				{/if}
			</div>
		</div>
	</label>
</label>
