<script lang="ts">
	import { onMount } from 'svelte';
	import { insideCall, peer, room, socket, user } from '../../../states.svelte.js';
	import { toast } from '@zerodevx/svelte-toast';
	import { PC_CONFIG, PEER_POINTER_WIDTH } from '$lib/hardcoded.js';
	import type { OUser } from '$lib/types.js';
	import DragContainer from '../../../components/DragContainer.svelte';
	import { ChatDC, dataChannel, PeerMouseDC } from './dataChannelStates.js';
	import ChatBox from './ChatBox.svelte';

	let localStream: MediaStream;
	let localVideoElement: HTMLVideoElement;
	let remoteVideoElement = $state<HTMLVideoElement>();

	let pc = $state<RTCPeerConnection>();

	onMount(() => {
		toast.push('Please wait while we connect you two...');
		socket.emit('join-room', { USER: $user, room: $room });
		socket.on('new-joiner', (USER: OUser) => {
			if ($peer) return window.location.reload(); // if new joiner comes but we have an existing one, that means that the peer has refreshed tje page

			$peer = { ...USER };
			toast.pop($peer.username + ' has joined');
			socket.emit('inform-joiner-about-me', { USER: $user, room: $room });
		});
		socket.on('hi-from', (USER: OUser) => {
			$peer = { ...USER };
		});
	});
	$effect(() => {
		if (!$peer) insideCall.set(false);
	});

	const createPeerConnection = async () => {
		!pc && (pc = new RTCPeerConnection(PC_CONFIG));
		$dataChannel = pc.createDataChannel('messageChannel');
	};

	const startMyVideo = async () => {
		try {
			navigator.mediaDevices
				.getUserMedia({ audio: true, video: true })
				.then((stream) => (localStream = stream) && (localVideoElement.srcObject = stream))
				.then(addTracksToPeerConnection); /////////////////
		} catch (error) {
			toast.push('Error: Camera in use by another process!');
		}
	};

	const addTracksToPeerConnection = () =>
		localStream.getTracks().forEach((track) => pc?.addTrack(track, localStream));

	const startCall = async () =>
		pc!
			.createOffer()
			.then((offer) => pc?.setLocalDescription(offer))
			.then(() => socket.emit('my-offerD', { offerD: pc?.localDescription, room: $room }))
			.then(() => toast.push('Call started'))
			.then(() => toast.push('Tip: you can drag videos'));

	onMount(() => {
		createPeerConnection().then(startMyVideo);
		if (!pc) return;

		pc.ontrack = (ev) => remoteVideoElement && (remoteVideoElement.srcObject = ev.streams[0]);

		pc.onicecandidate = (ev) =>
			socket.emit('my-ice-candidate', { iceCandidate: ev.candidate, room: $room });

		pc.onconnectionstatechange = () => {
			const st = (pc && pc?.connectionState) || 'new';
			switch (st) {
				case 'disconnected':
					// if the peer disconnects, reload to refresh the whole page to restart pc I guess
					window.location.reload();
					break;
				case 'connected':
					$insideCall = true;
					break;
			}
			toast.push(st);
		};
		pc.ondatachannel = (e) => {
			const receiveChannel = e.channel;
			receiveChannel.onmessage = (e) => {
				const data = JSON.parse(e.data);
				if (data.type.startsWith('mouse'))
					PeerMouseDC.set({
						type: data.type,
						y: Math.min(innerHeight - PEER_POINTER_WIDTH, data.y * innerHeight),
						x: Math.min(innerWidth - PEER_POINTER_WIDTH, data.x * innerWidth)
					});
				else if (data.type === 'chatMessage') ChatDC.set(data);
			};
		};

		socket.on('incoming-offerD', async (offerD) => {
			await pc?.setRemoteDescription(offerD);
			const answer = await pc?.createAnswer();
			await pc?.setLocalDescription(answer);
			socket.emit('my-answerD', { answerD: pc?.localDescription, room: $room });
		});
		socket.on('incoming-answerD', (answerD) => pc?.setRemoteDescription(answerD));
		socket.on('incoming-ice-candidate', (iceCandidate) => pc?.addIceCandidate(iceCandidate));
		return () => {
			pc?.close();
			socket.removeAllListeners();
			// socket.disconnect();
			toast.push('Left the room' + ($peer ? ` with ${$peer.username}` : ''));
		};
	});

	let { children } = $props();

	let myCamWidth = $state(200);
	let peerCamWidth = $state(200);
</script>

{#if $dataChannel && pc}
	<!-- <MouseEventExchanger /> -->
	<ChatBox />
{/if}
<DragContainer loc="bottom-left">
	<div class="flex border-2">
		<p class="absolute left-2 bottom-2">You</p>
		<video
			src=""
			bind:this={localVideoElement}
			playsinline
			autoplay
			style={`width: ${myCamWidth}px;`}
		>
			<track kind="captions" />
		</video>
	</div>
</DragContainer>
<DragContainer loc="bottom-right">
	<div class="flex border-2">
		{#if $peer}
			<p class="absolute left-2 bottom-2">
				{$insideCall ? $peer.username : "Call hasn't been started yet"}
			</p>
		{/if}
		<video
			src=""
			bind:this={remoteVideoElement}
			playsinline
			autoplay
			style={`width: ${peerCamWidth}px;`}
		>
			<track kind="captions" />
		</video>
	</div>
</DragContainer>

{#if $insideCall}
	<div class="absolute top-0 z-50">
		<a href="/"> <button class="bg-red-700"> EndCall with ${$peer?.username}</button> </a>
	</div>
	<section class="w-full h-full [&>section]:w-full [&>section]:h-full">
		{@render children()}
	</section>
{/if}

<section>
	{#if $peer && !$insideCall}
		<button class="bg-green-700" onclick={startCall}>Start Call</button>
	{/if}

	<div class="absolute left-0 top-24 z-50 flex-col gap-0">
		<p>Video sizes</p>
		<div class="flex-col gap-0">
			<div>
				You_ <input
					type="range"
					class="w-36 cursor-pointer"
					min="200"
					max="500"
					bind:value={myCamWidth}
				/>
			</div>
			{#if $peer}
				<div>
					Peer<input
						type="range"
						class="w-36 cursor-pointer"
						min="200"
						max="500"
						bind:value={peerCamWidth}
					/>
				</div>
			{/if}
		</div>
	</div>
</section>
