<!-- ngl, I asked a chatbot for help  -->
<script lang="ts">
	import { onMount } from 'svelte';

	let props = $props();

	let x = $state(0);
	let y = $state(0);
	let isDragging = false;
	let offsetX = 0;
	let offsetY = 0;
	let elementWidth = 0;
	let elementHeight = 0;
	let draggableElement: Element;

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				elementWidth = entry.contentRect.width;
				elementHeight = entry.contentRect.height;
			}
		});
		if (props.loc === 'bottom-right') {
			y = innerHeight - 230;
			x = innerWidth - 300;
		} else if (props.loc === 'bottom-left') y = innerHeight - 230;

		resizeObserver.observe(draggableElement);

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			resizeObserver.disconnect(); // Clean up observer on unmount
		};
	});

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;

		offsetX = event.clientX - x;
		offsetY = event.clientY - y;
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging) {
			let newX = event.clientX - offsetX;
			let newY = event.clientY - offsetY;

			x = Math.max(0, Math.min(newX, window.innerWidth - elementWidth));
			y = Math.max(0, Math.min(newY, window.innerHeight - elementHeight));
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}
</script>

<div
	bind:this={draggableElement}
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
