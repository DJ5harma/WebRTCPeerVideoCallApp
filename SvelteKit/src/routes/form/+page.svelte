<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import { user } from '../../states.svelte';

	let formType: 'Register' | 'Login' = $state('Login');
	let formData = $state({
		username: '',
		password: '',
		email: ''
	});
	let confirmedPassword = $state('');
	async function handleSubmit() {
		if (formType === 'Register' && confirmedPassword != formData.password)
			return toast.push('Passwords mismatch');
		if (formType === 'Register' && formData.password.length < 6)
			return toast.push('Password too short');

		const response = await fetch(`/api/${formType.toLowerCase()}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		const result = await response.json();
		if (result.error) return toast.push(result.error);
		$user = result.user;
		toast.push(formType + ' action complete!');
		goto('/');
	}
</script>

<section class="gap-4">
	<h1 class="text-2xl">Form</h1>
	{#if formType === 'Register'}
		<input bind:value={formData.username} placeholder="Username" />
	{/if}
	<input bind:value={formData.email} type="email" placeholder="Email" class="p-4" />
	<input
		bind:value={formData.password}
		type="password"
		placeholder="Password (min: 6)"
		class="p-4"
	/>
	{#if formType === 'Register'}
		<input bind:value={confirmedPassword} type="password" placeholder="Confirm Password" />
	{/if}
	<button onclick={handleSubmit}>{formType}</button>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<p
		onclick={() => (formType = formType === 'Login' ? 'Register' : 'Login')}
		class="cursor-pointer"
	>
		Or click here to {formType === 'Login' ? 'Register' : 'Login'}!
	</p>
</section>
