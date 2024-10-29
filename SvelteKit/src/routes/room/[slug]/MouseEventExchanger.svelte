<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';

	let { dataChannel }: { dataChannel: RTCDataChannel } = $props();

	const sendHello = () => {
		if (dataChannel && dataChannel.readyState === 'open') {
			dataChannel.send('Hello from the other side!');
			toast.push('Sent: Hello from the other side!');
		} else {
			toast.push('Data channel is not open');
		}
	};
	onMount(() => {
		console.log({ dataChannel });
		dataChannel.onopen = () => {
			console.log('Data channel is open');
			toast.push('Data channel open, ready to send messages');
		};

		dataChannel.onmessage = (event) => {
			console.log('Received message:', event.data);
			toast.push('Message from peer: ' + event.data);
		};

		// dataChannel.onerror = (error) => {
		// 	console.log('Data Channel Error:', error);
		// };

		// dataChannel.onmessage = (event) => {
		// 	console.log('Got Data Channel Message:', event.data);
		// };

		// dataChannel.onopen = () => {
		// 	dataChannel.send('Hello World!');
		// };

		// dataChannel.onclose = () => {
		// 	console.log('The Data Channel is Closed');
		// };

		// document.addEventListener('mousemove', (e) => {
		// 	console.log(
		// 		JSON.stringify({
		// 			type: 'mousemove',
		// 			x: e.clientX,
		// 			y: e.clientY
		// 		})
		// 	);
		// });

		// document.addEventListener('mousedown', (e) => {
		// 	console.log(
		// 		JSON.stringify({
		// 			type: 'mousedown',
		// 			button: e.button,
		// 			x: e.clientX,
		// 			y: e.clientY
		// 		})
		// 	);
		// });

		// document.addEventListener('mouseup', (e) => {
		// 	console.log(
		// 		JSON.stringify({
		// 			type: 'mouseup',
		// 			button: e.button,
		// 			x: e.clientX,
		// 			y: e.clientY
		// 		})
		// 	);
		// });
	});
</script>

<div class="absolute bottom-20 left-5 z-50">
	<button class="bg-blue-500 p-2 rounded text-white" onclick={sendHello}>Send Hello</button>
</div>
