<script lang="ts">
	import { user } from '../states.svelte';
	let ROOM = $state('1234');
</script>

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
