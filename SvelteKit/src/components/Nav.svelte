<script lang="ts">
	import { user } from '../states.svelte';
	import Icon from '@iconify/svelte';

	// Properly escaped SVG string
	const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112" fill="none" shape-rendering="auto"><metadata xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"><rdf:RDF><rdf:Description><dc:title>Avataaars</dc:title><dc:creator>Pablo Stanley</dc:creator><dc:source xsi:type="dcterms:URI">https://avataaars.com/</dc:source><dcterms:license xsi:type="dcterms:URI">https://avataaars.com/</dcterms:license><dc:rights>Remix of „Avataaars” (https://avataaars.com/) by „Pablo Stanley”, licensed under „Free for personal and commercial use.” (https://avataaars.com/)</dc:rights></rdf:Description></rdf:RDF></metadata><mask id="viewboxMask"><rect width="112" height="112" rx="0" ry="0" x="0" y="0" fill="#fff" /></mask><g mask="url(#viewboxMask)"><rect fill="#ffdbb4" width="112" height="112" x="0" y="0" /><g transform="translate(2 63)"><path fill-rule="evenodd" clip-rule="evenodd" d="M35.12 29.87a19 19 0 0 1 37.77.09c.08.77-.77 2.04-1.85 2.04H37.1C36 32 35 30.82 35.12 29.87Z" fill="#000" fill-opacity=".7"/><path d="M69.59 32H38.4a11 11 0 0 1 15.6-6.8A11 11 0 0 1 69.59 32Z" fill="#FF4F6D"/><path d="M66.57 17.75A5 5 0 0 1 65 18H44c-.8 0-1.57-.2-2.24-.53A18.92 18.92 0 0 1 54 13c4.82 0 9.22 1.8 12.57 4.75Z" fill="#fff"/></g><g transform="translate(28 51)"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 8c0 4.42 5.37 8 12 8s12-3.58 12-8" fill="#000" fill-opacity=".16"/></g><g transform="translate(0 19)"><path d="M44 22a14 14 0 1 1-28 0 14 14 0 0 1 28 0ZM96 22a14 14 0 1 1-28 0 14 14 0 0 1 28 0Z" fill="#fff"/><path d="M36 14a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM88 14a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" fill="#000" fill-opacity=".7"/></g><g transform="translate(0 11)"><path d="M15.6 14.16c4.49-6.32 14-9.5 23.75-6.36a2 2 0 1 0 1.23-3.81c-11.41-3.68-22.74.1-28.25 7.85a2 2 0 1 0 
3.26 2.32ZM96.38 21.16c-3.92-5.51-14.65-8.6-23.9-6.33a2 2 0 0 1-.95-3.88c10.74-2.64 23.17.94 28.1 7.9a2 2 0 1 1-3.25 2.3Z" fill="#000" fill-opacity=".6"/></g></g></svg>`;

	let show = $state(false);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="MenuTrigger" onclick={() => (show = !show)}>
	<Icon icon="material-symbols:menu-rounded" width="40" />
	<div class="w-10">
		{@html svgString}
	</div>
	<p>
		{$user.username}
	</p>
</div>

<div id="NavMain" class={show ? 'slideIn' : 'slideOut'}>
	<a href="/">Home</a>
	<a href="/form"> Account</a>
</div>

<style>
	div {
		background-color: rgb(30, 30, 30);
		box-shadow: 0px 0px 25px 2px rgb(60, 60, 200);
	}
	#MenuTrigger {
		position: absolute;
		top: 10px;
		left: 10px;
		border: solid;
		padding: 10px;
		cursor: pointer;
		z-index: 50;
	}
	#NavMain {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 100vh;
		flex-direction: column;
		gap: 20px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;

		a {
			text-align: center;
			padding: 10px 0;
			cursor: pointer;
			background-color: rgb(60, 60, 200);
			width: 90%;
			box-shadow: 0px 0px 10px 1px rgb(60, 60, 200);
			font-size: 100%;
		}
		a:hover {
			background-color: rgb(100, 100, 240);
		}
	}
	@keyframes slideIn {
		0% {
			width: 0;
			font-size: 0;
		}
		100% {
			width: 230px;
			font-size: 15px;
		}
	}
	@keyframes slideOut {
		0% {
			width: 230px;
			font-size: 15px;
		}
		100% {
			width: 0;
			font-size: 0;
		}
	}
	.slideIn {
		animation: slideIn 300ms forwards;
	}
	.slideOut {
		animation: slideOut 300ms forwards;
	}
</style>
