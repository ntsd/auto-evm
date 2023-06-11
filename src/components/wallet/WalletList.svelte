<script lang="ts">
	import { removeWallet, walletsStore } from '../../stores/walletsStore';
	import WalletModal from './WalletModal.svelte';
</script>

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
			{#each $walletsStore as wallet}
				<tr>
					<td>{wallet.name}</td>
					<td>{wallet.address}</td>
					<td>
						<WalletModal isEdit={true} {wallet} />
						<button
							class="btn btn-accent"
							on:click={() => {
								removeWallet(wallet.address);
							}}>Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
