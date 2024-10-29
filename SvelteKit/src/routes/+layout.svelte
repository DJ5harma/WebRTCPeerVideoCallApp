<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../app.css';
	import Nav from '../components/Nav.svelte';
	let { children } = $props();
</script>

<SvelteToast />
<Nav />
<div class="absolute"></div>
{@render children()}
