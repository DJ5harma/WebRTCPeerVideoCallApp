<script lang="ts">
	import Icon from '@iconify/svelte';
	import { insideCall } from '../../../states.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { ChatDC, dataChannel } from './dataChannelStates';

	let show = $state<boolean>(false);

	let myMessage: string = $state('');

	let chat: {
		fromPeer?: true;
		message: string;
	}[] = $state([]);
	ChatDC.subscribe((val) => {
		if (val.message) chat.push({ message: val.message, fromPeer: true });
	});
	function sendMessage() {
		if (!$insideCall) return toast.push('You need to be in call with someone to send a message');
		if (myMessage) chat.push({ message: myMessage });

		$dataChannel.send(
			JSON.stringify({
				type: 'chatMessage',
				message: myMessage
			})
		);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="ChatBoxTrigger" onclick={() => (show = !show)}>
	<Icon icon="basil:chat-outline" width="40" />
</div>
<div id="ChatBoxMain" class={show ? 'fadeIn' : 'fadeOut'}>
	<div class="w-full pr-4 font-bold p-2">Chat</div>
	<div
		class="flex-grow flex-col gap-1 justify-start w-full overflow-y-auto overflow-x-hidden break-words"
	>
		{#each chat as obj}
			{#if obj.fromPeer}
				<section class="w-full flex-row justify-start p-0">
					<p class="bg-white text-black p-4 rounded-l-none max-w-full w-fit">
						{obj.message}
					</p>
				</section>
			{:else}
				<section class="w-full flex-row justify-end p-0">
					<p class="bg-black text-white p-4 rounded-r-none max-w-full w-fit">
						{obj.message}
					</p>
				</section>
			{/if}
		{/each}
	</div>
	<div id="messageInput" class="border-2 w-full pr-4">
		<input
			bind:value={myMessage}
			placeholder="Enter your message"
			class="w-full p-4 outline-none"
		/>
		<Icon onclick={sendMessage} icon="lsicon:send-filled" class="cursor-pointer" width="35" />
	</div>
</div>

<style>
	div {
		background-color: rgb(30, 30, 30);
	}
	#ChatBoxTrigger {
		position: absolute;
		top: 10px;
		right: 10px;
		border: solid;
		padding: 10px;
		cursor: pointer;
		z-index: 1;
	}
	#ChatBoxMain {
		position: absolute;
		bottom: 0;
		right: 0;
		height: 100vh;
		width: 400px;
		flex-direction: column;
		gap: 10px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		justify-content: flex-start;
	}
	#messageInput,
	#ChatBoxMain,
	#ChatBoxTrigger {
		box-shadow: 0px 0px 25px 2px rgb(200, 60, 60);
		box-shadow: 0px 0px 25px 2px rgb(200, 60, 60);
	}
	@keyframes fadeIn {
		0% {
			opacity: 0;
			font-size: 0;
		}
		100% {
			opacity: 100%;
			font-size: 15px;
		}
	}
	@keyframes fadeOut {
		0% {
			opacity: 100%;
			font-size: 15px;
		}
		100% {
			opacity: 0;
			font-size: 0;
		}
	}
	.fadeIn {
		animation: fadeIn 300ms forwards;
	}
	.fadeOut {
		animation: fadeOut 300ms forwards;
	}
</style>
