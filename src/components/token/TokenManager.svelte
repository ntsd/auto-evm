<script lang="ts">
	import TokenModal from './TokenModal.svelte';
	import TokenList from './TokenList.svelte';
	import { networksStore } from '../../stores/networksStore';
	import { walletsStore } from '../../stores/walletsStore';
	import { defaultNetwork } from '../../configs';

	let network = $networksStore.length > 0 ? $networksStore[0] : defaultNetwork;
	let walletAddress = $walletsStore.length > 0 ? $walletsStore[0].address : '';
</script>

<div class="p-4 space-y-4">
	<div class="flex flex-col lg:flex-row justify-between">
		<h2 class="text-2xl mb-4">Tokens</h2>
		<div class="flex flex-col lg:flex-row">
			<select bind:value={walletAddress} class="select select-bordered">
				{#each $walletsStore as wallet}
					<option value={wallet.address}>{wallet.name}</option>
				{/each}
			</select>
			<select bind:value={network} class="select select-bordered">
				{#each $networksStore as n}
					<option value={n}>{n.name}</option>
				{/each}
			</select>
			<TokenModal {network} />
		</div>
	</div>
	<TokenList {network} {walletAddress} />
</div>
