<!-- ngl, I asked a chatbot for help  -->
<script lang="ts">
	import { CAM_VIDEO } from '$lib/hardcoded';
	import { onMount } from 'svelte';

	let props = $props();

	let width = CAM_VIDEO.width; // Initial width
	let height = CAM_VIDEO.height;
	let x = $state(0);
	let y = $state(0);
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
		if (props.loc === 'bottom-left') x = 10;
		else if (props.loc === 'bottom-right') x = window.innerWidth - width - 10;
		y = window.innerHeight - height - 10; // Small margin from the bottom edge

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
	{@render props.children()}
</div>

<style>
	.draggable {
		position: absolute;
		cursor: grab;
		user-select: none;
	}
</style>
