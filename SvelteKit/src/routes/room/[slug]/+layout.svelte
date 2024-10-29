<script lang="ts">
	import { onMount } from 'svelte';
	import { insideCall, peer, room, socket, user } from '../../../states.svelte.js';
	import { toast } from '@zerodevx/svelte-toast';
	import { PC_CONFIG } from '$lib/hardcoded.js';
	import type { OUser } from '$lib/types.js';
	import Draggable from './Draggable.svelte';
	import MouseEventExchanger from './MouseEventExchanger.svelte';

	let localStream: MediaStream;
	let localVideoElement: HTMLVideoElement;
	let remoteVideoElement = $state<HTMLVideoElement>();

	let dataChannel = $state<RTCDataChannel>();

	let pc: RTCPeerConnection;

	onMount(() => {
		toast.push('Please wait while we connect/reconnect you two!');
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
		dataChannel = pc.createDataChannel('messageChannel');
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
			.then(() => toast.pop('Call started'))
			.then(() => toast.push('Tip: you can drag videos'));

	onMount(() => {
		createPeerConnection().then(startMyVideo);
		if (!pc) return;

		pc.ondatachannel = (event) => {
			const receiveChannel = event.channel;
			receiveChannel.onmessage = (event) => {
				console.log('Message received:', event.data);
				toast.push('Message received: ' + event.data);
			};
		};

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

		socket.on('incoming-offerD', async (offerD) => {
			await pc?.setRemoteDescription(offerD);
			const answer = await pc?.createAnswer();
			await pc?.setLocalDescription(answer);
			socket.emit('my-answerD', { answerD: pc?.localDescription, room: $room });
		});
		socket.on('incoming-answerD', async (answerD) => await pc?.setRemoteDescription(answerD));
		socket.on(
			'incoming-ice-candidate',
			async (iceCandidate) => await pc?.addIceCandidate(iceCandidate)
		);
		return () => {
			insideCall.set(false);
			pc?.close();
			socket.removeAllListeners();
			toast.push('Left the room' + ($peer ? ` with ${$peer.username}` : ''));
		};
	});

	let { children } = $props();

	let myCamWidth = $state(250);
	let peerCamWidth = $state(250);
</script>

<Draggable loc="bottom-left">
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
</Draggable>
<Draggable loc="bottom-right">
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
</Draggable>

{#if dataChannel}
	<MouseEventExchanger {dataChannel} />
{/if}

<section class="overflow-hidden">
	<div>
		{@render children()}
		<p class="text-2xl">{($peer ? $peer.username : 'Nobody else') + ' is here'}</p>
		{#if $peer && !$insideCall}
			<button class="bg-green-700" onclick={startCall}>Start Call</button>
		{/if}
	</div>

	<div class="absolute top-0 z-50">
		{#if $insideCall}
			<a href="/"> <button class="bg-red-700"> EndCall </button> </a>
		{/if}
	</div>
	<div class="absolute bottom-0 z-50 flex-col">
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
