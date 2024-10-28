<script lang="ts">
	import { goto } from '$app/navigation';
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
	<button onclick={() => goto('/room/' + ROOM)}>Join</button>
</section>
