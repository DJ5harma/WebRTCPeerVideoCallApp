<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	import { user } from '../../states.svelte';

	let formType: 'Register' | 'Login' = 'Login';
	let formData = {
		username: '',
		password: '',
		email: ''
	};
	let confirmedPassword = '';
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

<section>
	<h1>Form</h1>
	<div>
		<button onclick={() => (formType = 'Login')} class={formType === 'Login' ? 'selected' : ''}
			>Login</button
		>
		<button onclick={() => (formType = 'Register')} class={formType !== 'Login' ? 'selected' : ''}
			>Register</button
		>
	</div>
	{#if formType === 'Register'}
		<input
			onchange={(e) => (formData.username = e.currentTarget.value)}
			type="text"
			placeholder="username"
			value={formData.username}
		/>
	{/if}
	<input
		onchange={(e) => (formData.email = e.currentTarget.value)}
		type="email"
		placeholder="email"
		value={formData.email}
	/>
	<input
		onchange={(e) => (formData.password = e.currentTarget.value)}
		type="password"
		placeholder="password (min: 6)"
		value={formData.password}
	/>
	{#if formType === 'Register'}
		<input
			onchange={(e) => (confirmedPassword = e.currentTarget.value)}
			type="password"
			placeholder="confirm-password"
			value={confirmedPassword}
		/>
	{/if}
	<button onclick={handleSubmit} style="background-color: black; color:white;">{formType}</button>
</section>
