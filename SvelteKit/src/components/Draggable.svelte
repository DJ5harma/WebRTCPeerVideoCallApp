<!-- ngl, I asked a chatbot for help  -->
<script lang="ts">
	import { onMount } from 'svelte';

	let props = $props();

	let x = $state(props.x);
	let y = $state(props.y);
	let isDragging = false;
	let offsetX = 0;
	let offsetY = 0;

	function handleMouseDown(event: unknown) {
		isDragging = true;

		offsetX = (event as MouseEvent).clientX - x;
		offsetY = (event as MouseEvent).clientY - y;
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging) {
			x = event.clientX - offsetX;
			y = event.clientY - offsetY;
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	onMount(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});
</script>

<div
	class="draggable"
	role="button"
	tabindex="0"
	onmousedown={handleMouseDown}
	style="top: {y}px; left: {x}px;"
	aria-label="Draggable component"
>
	<slot />
</div>

<style>
	.draggable {
		position: absolute;
		cursor: grab;
		user-select: none;
	}
</style>
