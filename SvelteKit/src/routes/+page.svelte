<script lang="ts">
	import OverlayContainer from '../components/OverlayContainer.svelte';
	import { user } from '../states.svelte';
	let ROOM = $state('1234');
</script>

<!-- <OverlayContainer
	onclick={() => {
		console.log('HELLLEOOEEOO');
	}}
>
	<button>TEST</button>
	<button>TEST</button>
	<button>TEST</button>
	<button>TEST</button>
</OverlayContainer> -->
<section>
	<div class="">
		<p>Name : {$user.username}</p>
	</div>
	<div>
		<p>Room :</p>
		<input bind:value={ROOM} />
	</div>
	<a href={'/room/' + ROOM}>
		<button> Join </button>
	</a>
</section>
