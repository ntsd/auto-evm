<script lang="ts">
	import { getBalance } from '$lib/getBalance';
	import { tokensStore, removeToken } from '../../stores/tokenStore';
	import type { Network, Token } from '../../types';
	import TokenModal from './TokenModal.svelte';

	export let network: Network;
	export let walletAddress: string;
</script>

<div class="overflow-x-auto">
	<table class="table w-full table-compact">
		<thead>
			<tr>
				<th>Name</th>
				<th>Address</th>
				<th>Decimal</th>
				<th>Amount</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{network.currencySymbol}</td>
				<td>{'Base Token'}</td>
				<td>{18}</td>
				<td>
					{#await getBalance(walletAddress, network)}
						Loading
					{:then balance}
						{balance}
					{:catch error}
						<p style="color: red">{error.message}</p>
					{/await}
				</td>
				<td />
			</tr>
			{#each $tokensStore as token}
				<tr>
					<td>{token.name}</td>
					<td>{token.address}</td>
					<td>{token.decimal}</td>
					<td>
						{#if walletAddress}
							{#await getBalance(walletAddress, network, token)}
								Loading
							{:then balance}
								{balance}
							{:catch error}
								<p style="color: red">{error.message}</p>
							{/await}
						{/if}
					</td>
					<td>
						<TokenModal {network} isEdit {token} />
						<button
							class="btn btn-accent"
							on:click={() => {
								removeToken(token.address);
							}}>Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
