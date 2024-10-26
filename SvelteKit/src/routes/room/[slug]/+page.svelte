<script lang="ts">
	import { onMount } from 'svelte';
	import { iceServers, myName, peerName, room, socket } from '../../../states.svelte.js';
	import { toast } from '@zerodevx/svelte-toast';

	export let data;

	onMount(() => {
		$room = data.slug;
		$myName = `User${(Math.random() * 10000).toFixed()}`;
		socket.emit('join-room', { name: $myName, room: $room });

		socket.on('new-joiner', (name) => {
			$peerName = name;
			toast.pop($peerName + ' has joined');
			socket.emit('inform-joiner-about-me', { name: $myName, room: $room });
		});
		socket.on('i-left-the-room', () => {
			$peerName = '';
			toast.pop($peerName + ' has left the room');
		});
		socket.on('hi-from', (name) => {
			console.log('hi from ', name);
			$peerName = name;
		});

		return () => {
			socket.emit('leave-room', $room);
			socket.removeAllListeners();
		};
	});
	let localStream: MediaStream;
	let localVideoElement: HTMLVideoElement;

	let remoteStream: MediaStream | null = null;
	let remoteVideoElement: HTMLVideoElement;

	let pc: RTCPeerConnection | null = null;

	async function startMyVideo() {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
		console.log({ stream });
		localStream = stream;
		localVideoElement.srcObject = stream;
		addTracksToPeerConnection();
	}
	async function createPeerConnection() {
		if (pc) {
			console.log('PC Already there --createPeerConnection');
			return;
		}
		pc = new RTCPeerConnection({ iceServers });
	}
	function addTracksToPeerConnection() {
		localStream.getTracks().forEach((track) => {
			pc?.addTrack(track, localStream);
		});
	}
	async function startCall() {
		if (!pc) return console.log('pc undefined --startCall');

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);
		socket.emit('my-offerD', { offerD: pc.localDescription, room: $room });
	}

	onMount(() => {
		createPeerConnection().then(() => startMyVideo());
		// startMyVideo();
		if (!pc) return;
		// listen to remote stream
		pc.ontrack = (ev) => {
			remoteVideoElement.srcObject = ev.streams[0];
		};

		// listen for my own ice-candidate
		pc.onicecandidate = (ev) => {
			console.log('ice candidate inocoming from stun......');

			socket.emit('my-ice-candidate', { iceCandidate: ev.candidate, room: $room });
		};

		socket.on('incoming-offerD', async (offerD) => {
			console.log('offerD came', offerD);
			await pc?.setRemoteDescription(offerD);
			const answer = await pc?.createAnswer();
			await pc?.setLocalDescription(answer);
			socket.emit('my-answerD', { answerD: pc?.localDescription, room: $room });
		});

		socket.on('incoming-answerD', async (answerD) => {
			console.log('answerD came', answerD);
			await pc?.setRemoteDescription(answerD);
		});

		socket.on('incoming-ice-candidate', async (iceCandidate) => {
			await pc?.addIceCandidate(iceCandidate); // check for new RTCIceCandidate(iceCandidate)
			console.log('ice-candidate arrived', iceCandidate);
		});
		return () => {
			socket.removeAllListeners();
		};
	});
	// let allowMyVideo = false;
</script>

<section>
	<div>
		{$myName}
		<h1>Room {$room}</h1>
		<p class="text-2xl">{($peerName || 'Nobody') + ' is here'}</p>
	</div>
	<video src="" bind:this={localVideoElement} class="border-2 border-white" playsinline autoplay>
		<track kind="captions" />
	</video>
	<video src="" bind:this={remoteVideoElement} class="border-2 border-white" playsinline autoplay>
		<track kind="captions" />
	</video>
	<div>
		<!-- <button >Allow to send your video</button> -->
		<button class="bg-green-700" onclick={startCall}>Start Call</button>
		<a href="/">
			<button> Go Home </button>
		</a>
		<button class="bg-green-700" onclick={addTracksToPeerConnection}>Allow my video</button>
	</div>
</section>
