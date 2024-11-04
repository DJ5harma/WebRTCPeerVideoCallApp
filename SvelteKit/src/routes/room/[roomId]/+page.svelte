<script>
	import { page } from '$app/stores';
</script>

<section>
	<a href={`/room/${$page.data.roomId}/tic-tac-toe`}>Tic Tac Toe</a>
</section>

<style>
	a {
		color: white;
		background-color: rgb(60, 60, 200);
		padding: 15px;
	}
</style>
