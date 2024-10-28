import { browser } from '$app/environment';
import { SOCKET_URL } from '$lib/hardcoded';
import type { CUser } from '$lib/types';
import { io } from 'socket.io-client';
import { writable } from 'svelte/store';

export const socket = $state(io(browser ? SOCKET_URL : ''));

export const user = writable<CUser>();
export const peerName = writable('');
export const room = writable('');

export const videoStarted = writable(false);

export const myCamDimensions = writable({
	width: 300,
	height: 230
});
export const peerCamDimensions = writable({
	width: 300,
	height: 230
});
