<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../app.css';
	import Nav from './Nav.svelte';
	import { user } from '../states.svelte';
	let { children } = $props();
</script>

<SvelteToast />
{#if $user}
	<Nav />
{/if}
<div class="absolute"></div>
{@render children()}
