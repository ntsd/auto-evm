<script lang="ts">
	import { addToken, updateToken } from '../../stores/tokenStore';
	import { networksStore } from '../../stores/networksStore';
	import { addToastMessage } from '../../stores/toastStore';
	import type { Token } from '../../types';

	export let isEdit: boolean = false;
	export let token: Token = {
		name: '',
		address: '',
		decimal: 8,
		chainId: ''
	};

	let forId = isEdit ? `edit-token-${token.address}` : 'add-token';

	function updateTokenController() {
		if (!token.chainId || !token.name || !token.address) {
			return;
		}

		updateToken(token);
		addToastMessage(`Update token ${token.name}`);
	}

	function addNewToken() {
		if (!token.chainId || !token.name || !token.address) {
			return;
		}

		addToken(token.name, token.address, token.decimal, token.chainId);
		addToastMessage(`Add token ${token.name}`);

		token.name = '';
		token.address = '';
		token.chainId = '';
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
				Edit Smart Token
			{:else}
				Add Smart Token
			{/if}
		</h3>
		<div class="py-4 space-y-2">
			<div class="form-control">
				<div class="label">
					<span class="label-text">Token Name</span>
				</div>
				<input type="text" bind:value={token.name} class="input input-bordered" />
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Token Address</span>
				</div>
				<input
					type="text"
					bind:value={token.address}
					disabled={isEdit}
					class="input input-bordered"
				/>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">Network</span>
				</div>
				<select bind:value={token.chainId} class="select select-bordered">
					<option value="">Select a network</option>
					{#each $networksStore as network}
						<option value={network.chainId}>{network.name}</option>
					{/each}
				</select>
			</div>
			<div class="form-control">
				{#if isEdit}
					<button on:click={updateTokenController} class="btn btn-primary"> Save </button>
				{:else}
					<button on:click={addNewToken} class="btn btn-primary"> Add Token </button>
				{/if}
			</div>
		</div>
	</label>
</label>
