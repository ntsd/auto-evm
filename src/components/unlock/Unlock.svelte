<script lang="ts">
	import { addToastMessage } from '../../stores/toastStore';
	import { enterPassword } from '../../stores/unlockStore';

	let password = '';

	function unlock() {
		enterPassword(password).catch((error) => {
			addToastMessage('Unlock failed: ' + error.message, 'error');
		});
	}
</script>

<div class="flex justify-center items-center h-full">
	<form class="h-1/2 p-6 flex flex-col gap-y-8">
		<span class="text-2xl text-center">Welcome back!</span>
		<div>
			<label for="password" class="block mb-2 font-medium">Password</label>
			<input type="password" id="password" bind:value={password} class="w-full px-3 py-2 border" />
		</div>
		<button type="submit" on:click={unlock} class="btn btn-primary">Unlock</button>
	</form>
</div>
