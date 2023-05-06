<script lang="ts">
	import Router from 'svelte-spa-router';
	import WalletManager from '../components/WalletManager.svelte';
	import NetworkManager from '../components/NetworkManager.svelte';
	import SmartContractManager from '../components/SmartContractManager.svelte';
	import ScheduleManager from '../components/ScheduleManager.svelte';
</script>

<div class="container">
	<Router
		routes={{
			'/': ScheduleManager,
			'/wallet': WalletManager,
			'/network': NetworkManager,
			'/contract': SmartContractManager
		}}
	/>
</div>
