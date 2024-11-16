<script lang="ts">
	import { isSignupModalOpen, isLoginModalOpen } from '@/lib/store';
	import Button from '@/components/Button.svelte';
	import Input from '@/components/Input.svelte';
	import Checkbox from '@/components/Checkbox.svelte';
	import Modal from '@/components/Modal.svelte';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let fullName = '';
	let agreeToTerms = false;
	let loading = false;

	$: passwordsMatch = password === confirmPassword;
	$: canSubmit = email && password && confirmPassword && fullName && agreeToTerms && passwordsMatch;

	async function handleSubmit() {
		if (!canSubmit) return;

		loading = true;
		// TODO: Implement signup logic
		await new Promise((resolve) => setTimeout(resolve, 2000));
		loading = false;
	}

	function closeModal() {
		isSignupModalOpen.set(false);
	}
</script>

<Modal id="signup" isOpen={$isSignupModalOpen} on:close={closeModal}>
	<form class="signup-form" on:submit|preventDefault={handleSubmit}>
		<h2>Create Account</h2>

		<div class="form-group">
			<Input type="text" id="fullName" bind:value={fullName} required placeholder="Full name" />
		</div>

		<div class="form-group">
			<Input type="email" id="email" bind:value={email} required placeholder="Email address" />
		</div>

		<div class="form-group">
			<Input
				type="password"
				id="password"
				bind:value={password}
				required
				placeholder="Create password"
			/>
		</div>

		<div class="form-group">
			<Input
				type="password"
				id="confirmPassword"
				bind:value={confirmPassword}
				required
				placeholder="Confirm password"
			/>
			{#if confirmPassword && !passwordsMatch}
				<p class="error-message">Passwords do not match</p>
			{/if}
		</div>

		<div class="form-options">
			<Checkbox bind:checked={agreeToTerms} label="I agree to the Terms of Service" />
		</div>

		<Button fullWidth type="submit" size="large" disabled={loading || !canSubmit}>
			{loading ? 'Creating account...' : 'Create Account'}
		</Button>

		<p class="login-prompt">
			Already have an account? <a
				href="#login"
				on:click|preventDefault={() => {
					closeModal();
					isLoginModalOpen.set(true);
				}}>Login</a
			>
		</p>
	</form>
</Modal>

<style>
	.signup-form {
		width: 600px;
		margin: 0;
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	h2 {
		text-align: center;
		margin-bottom: var(--space-4);
		font-size: var(--font-size-5);
		color: var(--black);
	}

	.form-group {
		margin-bottom: var(--space-3);
	}

	.error-message {
		color: var(--error-600);
		font-size: var(--font-size-2);
		margin-top: var(--space-1);
	}

	:global(.signup-form .button) {
		width: 100%;
		margin-top: var(--space-3);
	}

	.form-options {
		margin-bottom: var(--space-3);
	}

	.login-prompt {
		text-align: center;
		margin-top: var(--space-4);
		font-size: var(--font-size-2);
		color: var(--gray-600);
	}

	.login-prompt a {
		color: var(--primary-600);
		text-decoration: none;
	}

	.login-prompt a:hover {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.signup-form {
			padding: var(--space-3);
			max-width: none;
			border-radius: 8px;
			width: 270px;
		}

		h2 {
			font-size: var(--font-size-4);
			margin-bottom: var(--space-3);
		}

		.form-group {
			margin-bottom: var(--space-2);
		}

		.form-options {
			margin-bottom: var(--space-2);
			font-size: var(--font-size-1);
		}

		.login-prompt {
			margin-top: var(--space-3);
			font-size: var(--font-size-1);
		}

		.error-message {
			font-size: var(--font-size-1);
		}
	}
</style>
