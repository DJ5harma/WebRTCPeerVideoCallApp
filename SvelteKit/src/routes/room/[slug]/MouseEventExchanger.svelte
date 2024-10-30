<script lang="ts">
	import { onMount } from 'svelte';
	import { insideCall, PeerMouseChannelData } from '../../../states.svelte';
	import Icon from '@iconify/svelte';
	import { PEER_POINTER_WIDTH } from '$lib/hardcoded';

	let { dataChannel }: { dataChannel: RTCDataChannel } = $props();

	const mouseMoveHandler = (event: MouseEvent) => {
		if (!$insideCall) return;
		dataChannel.send(
			JSON.stringify({
				type: 'mousemove',
				x: event.clientX / innerWidth,
				y: event.clientY / innerHeight
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
	class="rounded-full absolute overflow-hidden"
	style={`top:${$PeerMouseChannelData.y}px; left:${$PeerMouseChannelData.x}px;`}
>
	<Icon
		icon="mage:mouse-pointer-fill"
		width={`${PEER_POINTER_WIDTH}px`}
		style="color:yellow;"
		class="z-50"
	/>
</div>
