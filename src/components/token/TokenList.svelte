<script lang="ts">
	import { tokensStore, removeToken } from '../../stores/tokenStore';
	import TokenModal from './TokenModal.svelte';
</script>

<div class="overflow-x-auto">
	<table class="table w-full table-compact">
		<thead>
			<tr>
				<th>Name</th>
				<th>Address</th>
				<th>Decimal</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each $tokensStore as token}
				<tr>
					<td>{token.name}</td>
					<td>{token.address}</td>
					<td>{token.decimal}</td>
					<td>
						<TokenModal isEdit {token} />
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
