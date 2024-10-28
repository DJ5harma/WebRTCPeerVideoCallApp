<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../app.css';
	let { children } = $props();
</script>

<SvelteToast />
<div class="absolute"></div>
{@render children()}
