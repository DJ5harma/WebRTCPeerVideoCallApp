import type { IChatMessage, IPeerMouse } from '$lib/types';
import { writable } from 'svelte/store';

export const dataChannel = writable<RTCDataChannel>();
export const ChatDC = writable<IChatMessage>({ message: '' });

export const PeerMouseDC = writable<IPeerMouse>({
	type: 'mousemove',
	x: 0,
	y: 0
});
