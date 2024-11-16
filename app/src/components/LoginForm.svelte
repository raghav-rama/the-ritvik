<script lang="ts">
	import { isLoginModalOpen } from '@/lib/store';
	import Button from '@/components/Button.svelte';
	import Input from '@/components/Input.svelte';
	import Checkbox from '@/components/Checkbox.svelte';

	let email = '';
	let password = '';
	let rememberMe = false;
	let loading = false;

	async function handleSubmit() {
		loading = true;
		// TODO: Implement login logic
		await new Promise((resolve) => setTimeout(resolve, 2000));
		loading = false;
	}

	function closeModal() {
		isLoginModalOpen.set(false);
	}

	// Close modal when clicking escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $isLoginModalOpen}
	<div
		class="modal-backdrop"
		on:click={closeModal}
		on:keydown={closeModal}
		role="button"
		tabindex="0"
	>
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<div
			class="modal-content"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby="login-title"
			tabindex="-1"
		>
			<form class="login-form" on:submit|preventDefault={handleSubmit}>
				<h2 id="login-title">Login</h2>

				<div class="form-group">
					<Input
						type="email"
						id="email"
						bind:value={email}
						required
						placeholder="Enter your email"
					/>
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
					<a href="/" class="forgot-link">Forgot password?</a>
				</div>

				<Button fullWidth type="submit" size="large" disabled={loading}>
					{loading ? 'Logging in...' : 'Login'}
				</Button>

				<p class="register-prompt">
					New here? <a href="/">Create an account</a>
				</p>
			</form>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		display: flex;
		align-items: center;
		justify-content: center;
		animation: slideIn 0.2s ease-out;
		z-index: 1001;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	@keyframes slideIn {
		from {
			transform: translateY(-20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

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
			width: auto;
		}

		.modal-backdrop {
			padding: 0;
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
		}

		.register-prompt {
			margin-top: var(--space-3);
		}
	}
</style>
