<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../app.css';
	import { user } from '../states.svelte';
	import NavMenu from './NavMenu.svelte';
	let { children } = $props();
</script>

<SvelteToast options={{ duration: 3000 }} />
{#if $user}
	<NavMenu />
{/if}
<div class="absolute"></div>
{@render children()}
