import { browser } from '$app/environment';
import type { CUser } from '$lib/types';
import { io } from 'socket.io-client';
import { writable } from 'svelte/store';

const SOCKET_URL = browser ? 'http://localhost:3000' : '';
export const iceServers = [
	{
		urls: ['stun:stun4.l.google.com:19302', 'stun:stunserver.org:3478', 'stun:stun.sipnet.net:3478']
	}
];
export const socket = $state(io(SOCKET_URL));

export const user = writable<CUser>();
export const myName = writable('');
export const peerName = writable('');
export const room = writable('');

export const videoStarted = writable(false);
