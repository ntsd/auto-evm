<script lang="ts">
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';

	import Toast from '../components/Toast.svelte';
	import Unlock from '../components/unlock/Unlock.svelte';
	import { pageDescription } from '../configs';
	import { unlockStore } from '../stores/unlockStore';
	import { settingStore } from '../stores/settingStore';
	import NewPassword from '../components/unlock/NewPassword.svelte';
	import Menu from '../components/Menu.svelte';
	import BottomNav from '../components/BottomNav.svelte';

	// if ('serviceWorker' in navigator) {
	//   addEventListener('load', function () {
	//     navigator.serviceWorker.register('./service-worker.js');
	//   });
	// }
</script>

<svelte:head>
	<title>Auto EVM Wallet</title>
	<meta name="description" content={pageDescription} />
	<!-- <link rel="manifest" href="/manifest.webmanifest" /> -->
	<meta name="theme-color" content="#fff" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="Auto EVM Wallet" />
	<meta property="og:description" content={pageDescription} />
	<!-- <meta property="og:image" content="%sveltekit.assets%/cover.png" /> -->
</svelte:head>

<div class="flex flex-col h-screen">
	<Header />
	{#if $unlockStore.isUnlocked}
		<Menu />
	{/if}
	<div class="flex-grow container mx-auto justify-items-center">
		{#if $unlockStore.isUnlocked}
			<slot />
		{:else if $settingStore.isFirstTime}
			<NewPassword />
		{:else}
			<Unlock />
		{/if}
	</div>
	{#if $unlockStore.isUnlocked}
		<BottomNav />
	{/if}
	<Footer />
</div>
<Toast />
