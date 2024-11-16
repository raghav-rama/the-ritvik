<script lang="ts">
	import { isForgotPasswordModalOpen, isLoginModalOpen } from '@/lib/store';
	import Button from '@/components/Button.svelte';
	import Input from '@/components/Input.svelte';
	import Modal from '@/components/Modal.svelte';

	let email = '';
	let loading = false;
	let isSuccess = false;

	async function handleSubmit() {
		loading = true;
		// TODO: Implement password reset logic
		await new Promise((resolve) => setTimeout(resolve, 2000));
		isSuccess = true;
		loading = false;
	}

	function closeModal() {
		isForgotPasswordModalOpen.set(false);
		// Reset state when modal closes
		setTimeout(() => {
			email = '';
			isSuccess = false;
		}, 200); // Wait for animation to finish
	}

	function backToLogin() {
		closeModal();
		isLoginModalOpen.set(true);
	}
</script>

<Modal id="forgot-password" isOpen={$isForgotPasswordModalOpen} on:close={closeModal}>
	<div class="forgot-password-form">
		{#if !isSuccess}
			<form on:submit|preventDefault={handleSubmit}>
				<h2>Reset Password</h2>
				<p class="description">
					Enter your email address and we'll send you instructions to reset your password.
				</p>

				<div class="form-group">
					<Input
						type="email"
						id="email"
						bind:value={email}
						required
						placeholder="Enter your email"
						disabled={loading}
					/>
				</div>

				<Button fullWidth type="submit" size="large" disabled={loading || !email}>
					{loading ? 'Sending...' : 'Send Reset Link'}
				</Button>

				<p class="back-to-login">
					Remember your password? <a href="#login" on:click|preventDefault={backToLogin}
						>Back to login</a
					>
				</p>
			</form>
		{:else}
			<div class="success-message">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="check-icon"
				>
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
				<h2>Check Your Email</h2>
				<p class="description">
					We've sent password reset instructions to <strong>{email}</strong>
				</p>
				<p class="sub-text">
					If you don't see the email, check your spam folder or
					<a href="#resend" on:click|preventDefault={handleSubmit}>click here to resend</a>
				</p>

				<Button fullWidth size="large" on:click={backToLogin}>Back to Login</Button>
			</div>
		{/if}
	</div>
</Modal>

<style>
	.forgot-password-form {
		width: 500px;
		margin: 0;
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--white);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	h2 {
		text-align: center;
		margin-bottom: var(--space-2);
		font-size: var(--font-size-5);
		color: var(--black);
	}

	.description {
		text-align: center;
		color: var(--gray-600);
		margin-bottom: var(--space-4);
		font-size: var(--font-size-2);
	}

	.form-group {
		margin-bottom: var(--space-3);
	}

	.back-to-login {
		text-align: center;
		margin-top: var(--space-4);
		font-size: var(--font-size-2);
		color: var(--gray-600);
	}

	.back-to-login a {
		color: var(--primary-600);
		text-decoration: none;
	}

	.back-to-login a:hover {
		text-decoration: underline;
	}

	.success-message {
		text-align: center;
		padding: var(--space-4) 0;
	}

	.check-icon {
		color: var(--success-600);
		margin-bottom: var(--space-3);
	}

	.sub-text {
		color: var(--gray-600);
		font-size: var(--font-size-2);
		margin: var(--space-4) 0;
	}

	.sub-text a {
		color: var(--primary-600);
		text-decoration: none;
	}

	.sub-text a:hover {
		text-decoration: underline;
	}

	strong {
		color: var(--gray-900);
	}

	@media (max-width: 480px) {
		.forgot-password-form {
			padding: var(--space-3);
			max-width: none;
			border-radius: 8px;
			width: 270px;
		}

		h2 {
			font-size: var(--font-size-4);
			margin-bottom: var(--space-2);
		}

		.description {
			font-size: var(--font-size-1);
			margin-bottom: var(--space-3);
		}

		.form-group {
			margin-bottom: var(--space-2);
		}

		.back-to-login {
			margin-top: var(--space-3);
			font-size: var(--font-size-1);
		}

		.sub-text {
			font-size: var(--font-size-1);
			margin: var(--space-3) 0;
		}

		.check-icon {
			width: 40px;
			height: 40px;
		}
	}
</style>
