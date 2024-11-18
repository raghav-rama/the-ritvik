<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let isOpen = false;
	export let title: string | undefined = undefined;
	export let id: string | undefined = undefined;

	let isClosing = false;

	function closeModal() {
		isClosing = true;
		setTimeout(() => {
			dispatch('close');
			isClosing = false;
		}, 200);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen || isClosing}
	<div
		class="modal-backdrop"
		class:fade-out={isClosing}
		class:fade-in={!isClosing}
		on:click={closeModal}
		on:keydown={handleKeydown}
		role="button"
		tabindex="0"
	>
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<div
			{id}
			class="modal-content"
			class:slide-in={!isClosing}
			class:slide-out={isClosing}
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			tabindex="-1"
		>
			{#if title}
				<h2 id="modal-title">{title}</h2>
			{/if}
			<slot />
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
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		transition: opacity 200ms ease-out;
	}

	.modal-backdrop.fade-out {
		opacity: 0;
	}

	.modal-backdrop.fade-in {
		opacity: 1;
	}

	.modal-content {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1001;
		animation-duration: 200ms;
		animation-timing-function: ease-out;
	}

	.slide-in {
		animation-name: slideIn;
	}

	.slide-out {
		animation-name: slideOut;
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

	@keyframes slideOut {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(20px);
			opacity: 0;
		}
	}

	@media (prefers-color-scheme: dark) {
		.modal-backdrop {
			background: rgba(0, 0, 0, 0.8);
		}
	}

	h2 {
		text-align: center;
		margin-bottom: var(--space-4);
		font-size: var(--font-size-5);
		color: var(--black);
	}

	@media (max-width: 480px) {
		.modal-backdrop {
			padding: 0;
		}

		h2 {
			font-size: var(--font-size-4);
			margin-bottom: var(--space-3);
		}
	}
</style>
