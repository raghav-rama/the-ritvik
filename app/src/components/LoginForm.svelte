<script lang="ts">
	import { isLoginModalOpen, isSignupModalOpen, isForgotPasswordModalOpen } from '@/lib/store';
	import Button from '@/components/Button.svelte';
	import Input from '@/components/Input.svelte';
	import Checkbox from '@/components/Checkbox.svelte';
	import Modal from '@/components/Modal.svelte';

	let email = '';
	let password = '';
	let rememberMe = false;
	let loading = false;

	$: canSubmit = email && password;

	async function handleSubmit() {
		loading = true;
		// TODO: Implement login logic
		await new Promise((resolve) => setTimeout(resolve, 2000));
		loading = false;
	}

	function closeModal() {
		isLoginModalOpen.set(false);
	}
</script>

<Modal id="login" isOpen={$isLoginModalOpen} on:close={closeModal}>
	<form class="login-form" on:submit|preventDefault={handleSubmit}>
		<h2>Login</h2>

		<div class="form-group">
			<Input type="email" id="email" bind:value={email} required placeholder="Enter your email" />
		</div>

		<div class="form-group">
			<Input
				type="password"
				id="password"
				bind:value={password}
				required
				placeholder="Enter your password"
			/>
		</div>

		<div class="form-options">
			<Checkbox bind:checked={rememberMe} label="Remember me" />
			<a
				href="#forgot-password"
				class="forgot-link"
				on:click|preventDefault={() => {
					closeModal();
					isForgotPasswordModalOpen.set(true);
				}}
			>
				Forgot password?
			</a>
		</div>

		<Button fullWidth type="submit" size="large" disabled={loading || !canSubmit}>
			{loading ? 'Logging in...' : 'Login'}
		</Button>

		<p class="register-prompt">
			New here? <a
				href="#signup"
				on:click|preventDefault={() => {
					closeModal();
					isSignupModalOpen.set(true);
				}}>Create an account</a
			>
		</p>
	</form>
</Modal>

<style>
	.login-form {
		width: 600px;
		height: 600px;
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

	:global(.login-form .button) {
		width: 100%;
		margin-top: var(--space-3);
	}

	.form-options {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.forgot-link {
		color: var(--primary-600);
		text-decoration: none;
		font-size: var(--font-size-2);
	}

	.forgot-link:hover {
		text-decoration: underline;
	}

	.register-prompt {
		text-align: center;
		margin-top: var(--space-4);
		font-size: var(--font-size-2);
		color: var(--gray-600);
	}

	.register-prompt a {
		color: var(--primary-600);
		text-decoration: none;
	}

	.register-prompt a:hover {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.login-form {
			padding: var(--space-3);
			max-width: none;
			border-radius: 8px;
			min-height: 100%;
			width: 270px;
			height: auto;
		}

		.form-options {
			font-size: var(--font-size-1);
		}

		.register-prompt {
			margin: 0;
			font-size: var(--font-size-1);
		}

		.forgot-link {
			font-size: var(--font-size-1);
		}

		.form-group {
			margin-bottom: var(--space-2);
		}

		.form-options {
			margin-bottom: var(--space-2);
		}

		.register-prompt {
			margin-top: var(--space-3);
		}
	}
</style>
