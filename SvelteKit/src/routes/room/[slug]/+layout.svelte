<script lang="ts">
	import { onMount } from 'svelte';
	import { iceServers, peerName, room, socket, user } from '../../../states.svelte.js';
	import { toast } from '@zerodevx/svelte-toast';
	import Draggable from '../../../components/Draggable.svelte';

	let insideCall = $state(false);
	onMount(() => {
		toast.push('Tip: you can drag videos');
		socket.emit('join-room', { name: $user.username, room: $room });

		socket.on('new-joiner', (name) => {
			$peerName = name;
			toast.pop($peerName + ' has joined');
			socket.emit('inform-joiner-about-me', { name: $user.username, room: $room });
		});
		socket.on('i-left-the-room', () => {
			$peerName = '';
			toast.pop('Call ended');
		});
		socket.on('hi-from', (name) => ($peerName = name));

		return () => {
			socket.emit('leave-room', $room);
			socket.removeAllListeners();
		};
	});

	let localStream: MediaStream;
	let localVideoElement: HTMLVideoElement;
	let remoteVideoElement: HTMLVideoElement;

	let pc: RTCPeerConnection | null = null;

	const createPeerConnection = async () => !pc && (pc = new RTCPeerConnection({ iceServers }));

	const startMyVideo = async () =>
		navigator.mediaDevices
			.getUserMedia({ audio: true, video: true })
			.then((stream) => (localStream = stream) && (localVideoElement.srcObject = stream)); /////////////////

	const addTracksToPeerConnection = () =>
		localStream.getTracks().forEach((track) => pc?.addTrack(track, localStream));

	const startCall = async () =>
		pc!
			.createOffer()
			.then((offer) => pc?.setLocalDescription(offer))
			.then(() => socket.emit('my-offerD', { offerD: pc?.localDescription, room: $room }))
			.then(() => toast.pop('Call started'));

	onMount(() => {
		createPeerConnection().then(startMyVideo).then(addTracksToPeerConnection);
		if (!pc) return;

		pc.ontrack = (ev) => (remoteVideoElement.srcObject = ev.streams[0]);

		pc.onicecandidate = (ev) =>
			socket.emit('my-ice-candidate', { iceCandidate: ev.candidate, room: $room });

		pc.onconnectionstatechange = () => {
			const st = (pc && pc?.connectionState) || 'new';
			switch (st) {
				case 'disconnected':
					insideCall = false;
					break;
				case 'closed':
					insideCall = false;
					break;
				case 'failed':
					insideCall = false;
					break;
				case 'connected':
					insideCall = true;
					break;
			}
			toast.pop();
			toast.push(st);
		};

		socket.on('incoming-offerD', async (offerD) => {
			console.log('offerD came', offerD);
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
			socket.removeAllListeners();
			pc?.close();
			insideCall = false;
		};
	});

	let { children } = $props();

	let myCamWidth = $state(250);
	let peerCamWidth = $state(250);
</script>

<section class="overflow-hidden">
	<div>
		{$user.username}
		{@render children()}
		<p class="text-2xl">{($peerName || 'Nobody') + ' is here'}</p>
	</div>

	<Draggable loc="bottom-left">
		<div class="flex border-2">
			<p class="absolute left-1 bottom-1">You_</p>
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
			<p class="absolute left-1 bottom-1">Them_</p>
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

	<div class="absolute top-0 z-50">
		{#if !insideCall}
			<button class="bg-green-700" onclick={startCall}>Start Call</button>
		{:else}
			<a href="/"> <button class="bg-red-700"> EndCall </button> </a>
		{/if}
	</div>
	<div class="absolute bottom-0 z-50 flex-col">
		<p>Video sizes</p>
		<div class="flex-col gap-0">
			<div>
				You_ <input type="range" class="w-36" min="200" max="500" bind:value={myCamWidth} />
			</div>
			<div>
				Peer<input type="range" class="w-36" min="200" max="500" bind:value={peerCamWidth} />
			</div>
		</div>
	</div>
</section>
