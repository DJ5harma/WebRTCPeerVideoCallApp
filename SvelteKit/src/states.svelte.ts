import { browser } from '$app/environment';
import { SOCKET_URL } from '$lib/hardcoded';
import type { IUser, OUser } from '$lib/types';
import { io } from 'socket.io-client';
import { writable } from 'svelte/store';

export const socket = $state(io(browser ? SOCKET_URL : ''));

export const peer = writable<OUser | null>();
export const user = writable<IUser>();
export const room = writable('');

export const insideCall = writable(false);
