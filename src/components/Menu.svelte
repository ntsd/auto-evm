<script lang="ts">
	import { link } from 'svelte-spa-router';
	import active from 'svelte-spa-router/active';
	import { menus } from '../configs';
</script>

<div class="navbar w-full lg:px-8 hidden lg:flex">
	<div class="navbar-start" />
	<div class="navbar-center hidden lg:flex flex-row gap-8">
		{#each menus as menu}
			<a href={menu.href} use:link class="link" use:active={{ className: 'link' }}>{menu.name}</a>
		{/each}
	</div>
	<div class="navbar-end" />
</div>
