<script lang="ts">
	import { onMount } from 'svelte';
	import { insideCall, PeerMouseChannelData } from '../../../states.svelte';
	import Icon from '@iconify/svelte';

	let { dataChannel }: { dataChannel: RTCDataChannel } = $props();

	const mouseMoveHandler = (event: MouseEvent) => {
		if (!$insideCall) return;
		dataChannel.send(
			JSON.stringify({
				type: 'mousemove',
				x: event.clientX,
				y: event.clientY
			})
		);
	};

	onMount(() => {
		document.addEventListener('mousemove', mouseMoveHandler);
		return () => {
			document.removeEventListener('mousemove', mouseMoveHandler);
		};
	});
</script>

<div
	class="rounded-full absolute"
	style={`top:${$PeerMouseChannelData.y}px; left:${$PeerMouseChannelData.x}px;`}
>
	<Icon icon="mage:mouse-pointer-fill" width="30" style="color:yellow;" class="z-50" />
</div>
