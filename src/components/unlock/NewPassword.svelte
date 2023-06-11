<script lang="ts">
	import { newPassword } from '../../stores/unlockStore';

	let password = '';
	let repeatPassword = '';
	let isMatch = false;

	function newPasswordHandler() {
		if (isMatch) {
			newPassword(password);
		}
	}

	$: {
		isMatch = password === repeatPassword;
	}
</script>

<div class="flex justify-center items-center min-w-1/2 h-full">
	<form class="min-w-1/2 h-1/2 p-6 flex flex-col gap-y-4">
		<span class="text-2xl text-center mb-2">Create New Password</span>
		<div>
			<label for="password" class="block mb-2 font-medium">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				class="w-full px-3 py-2 border mb-4"
			/>
			<label for="password" class="block mb-2 font-medium">Repeat Password</label>
			<input
				type="password"
				id="password"
				bind:value={repeatPassword}
				class="w-full px-3 py-2 border"
			/>
			<p class="text-red-500 text-center {isMatch && 'invisible'}">Not match</p>
		</div>
		<button
			type="button"
			on:click={newPasswordHandler}
			class="btn btn-primary"
			disabled={!isMatch || !password}
		>
			New Password
		</button>
	</form>
</div>
