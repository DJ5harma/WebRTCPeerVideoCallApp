<script lang="ts">
	import { onMount } from 'svelte';
	import { insideCall } from '../../../states.svelte';
	import Icon from '@iconify/svelte';
	import { PEER_POINTER_WIDTH } from '$lib/hardcoded';
	import { dataChannel, PeerMouseDC } from './dataChannelStates';

	const simulateClick = (x: number, y: number) => {
		const event = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true,
			screenX: x,
			screenY: y
		});

		const element = document.elementFromPoint(x, y);
		if (element) element.dispatchEvent(event);
	};

	PeerMouseDC.subscribe((val) => {
		if (val.type === 'mousedown') simulateClick(val.x, val.y);
	});

	const mouseMoveHandler = (event: MouseEvent) => {
		if (!$insideCall) return;
		$dataChannel.send(
			JSON.stringify({
				type: 'mousemove',
				x: event.clientX / innerWidth,
				y: event.clientY / innerHeight
			})
		);
	};
	const mouseDownHandler = (event: MouseEvent) => {
		if (!$insideCall) return;
		$dataChannel.send(
			JSON.stringify({
				type: 'mousedown',
				x: event.clientX / innerWidth,
				y: event.clientY / innerHeight,
				button: event.button
			})
		);
	};
	const mouseUpHandler = (event: MouseEvent) => {
		if (!$insideCall) return;
		$dataChannel.send(
			JSON.stringify({
				type: 'mouseup',
				x: event.clientX / innerWidth,
				y: event.clientY / innerHeight,
				button: event.button
			})
		);
	};

	onMount(() => {
		document.addEventListener('mousemove', mouseMoveHandler);
		document.addEventListener('mousedown', mouseDownHandler);
		document.addEventListener('mouseup', mouseUpHandler);
		return () => {
			document.removeEventListener('mousemove', mouseMoveHandler);
			document.removeEventListener('mousedown', mouseDownHandler);
			document.removeEventListener('mouseup', mouseUpHandler);
		};
	});
</script>

<div
	class="rounded-full absolute overflow-hidden"
	style={`top:${$PeerMouseDC.y}px; left:${$PeerMouseDC.x}px;`}
>
	<Icon
		icon="mage:mouse-pointer-fill"
		width={`${PEER_POINTER_WIDTH}px`}
		style="color:yellow;"
		class="z-50"
	/>
</div>
