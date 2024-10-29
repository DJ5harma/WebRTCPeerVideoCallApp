<!-- <script lang="ts">
	import { onMount } from 'svelte';

	let { dataChannel, pc }: { dataChannel: RTCDataChannel; pc: RTCPeerConnection } = $props();

	// const mouseMoveHandler = (event: MouseEvent) => {
	// 	dataChannel.send(
	// 		JSON.stringify({
	// 			type: 'mousemove',
	// 			x: event.clientX,
	// 			y: event.clientY
	// 		})
	// 	);
	// };

	// const mouseDownHandler = (event: MouseEvent) => {
	// 	dataChannel.send(
	// 		JSON.stringify({
	// 			type: 'mousedown',
	// 			button: event.button,
	// 			x: event.clientX,
	// 			y: event.clientY
	// 		})
	// 	);
	// };

	// const mouseUpHandler = (event: MouseEvent) => {
	// 	dataChannel.send(
	// 		JSON.stringify({
	// 			type: 'mouseup',
	// 			button: event.button,
	// 			x: event.clientX,
	// 			y: event.clientY
	// 		})
	// 	);
	// };

	// const addMouseListeners = () => {
	// 	document.addEventListener('mousemove', mouseMoveHandler);
	// 	document.addEventListener('mousedown', mouseDownHandler);
	// 	document.addEventListener('mouseup', mouseUpHandler);
	// };
	// const removeMouseListeners = () => {
	// 	document.removeEventListener('mousemove', mouseMoveHandler);
	// 	document.removeEventListener('mousedown', mouseDownHandler);
	// 	document.removeEventListener('mouseup', mouseUpHandler);
	// };

	onMount(() => {
		console.log({ dataChannel });

		pc.ondatachannel = (event) => {
			const receiveChannel = event.channel;
			receiveChannel.onmessage = (event) => {
				console.log('Message received:', event.data);
			};
		};
		// addMouseListeners();
		// return () => {
		// 	removeMouseListeners();
		// 	dataChannel.close();
		// };
	});
</script> -->
