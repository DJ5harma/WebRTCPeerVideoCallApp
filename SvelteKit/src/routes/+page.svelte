<script lang="ts">
	import { onMount } from 'svelte';
	import { myName, room, socket } from '../states.svelte';
	import { goto } from '$app/navigation';

	const MY_NAME = `User${(Math.random() * 10000).toFixed()}`;
	let ROOM = $state('1234');
	onMount(() => {
		$myName = MY_NAME;
		return () => {
			socket.removeAllListeners();
		};
	});
</script>

<section>
	<div class="">
		<p>Name :</p>
		<input bind:value={$myName} />
	</div>
	<div>
		<p>Room :</p>
		<input bind:value={ROOM} />
	</div>
	<button onclick={() => goto('/room/' + ROOM)}>Join</button>
</section>
