import { browser } from '$app/environment';
import { io } from 'socket.io-client';
import { writable } from 'svelte/store';

const SOCKET_URL = browser ? 'http://localhost:3000' : '';
export const iceServers = [
	{
		urls: ['stun:stun4.l.google.com:19302', 'stun:stunserver.org:3478', 'stun:stun.sipnet.net:3478']
	}
];
export const socket = $state(io(SOCKET_URL));

export const myName = writable('');
export const peerName = writable('');
export const room = writable('');

let PeerConnection: RTCPeerConnection | null = null;
export const pc = {
	createPeerConnection: () => {
		if (PeerConnection) {
			console.log('PC Already there');
			return;
		}
		PeerConnection = new RTCPeerConnection({ iceServers });
	},
	addTrack: (track: MediaStreamTrack, localStream: MediaStream) => {
		PeerConnection?.addTrack(track, localStream);
	}
	// add local streams to PC
	// listen remote streams and add to PC
	// listen for ice candidate
};
