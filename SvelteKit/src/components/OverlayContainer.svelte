<script lang="ts">
	let props = $props();
</script>

<section
	class="absolute top-0 left-0 w-full h-full flex flex-col gap-5 p-10 bg-white justify-center items-center bg-opacity-80 text-black"
>
	{@render props.children()}
</section>
