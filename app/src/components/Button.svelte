<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'text' | 'outlined' = 'primary';
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let fullWidth: boolean = false;
	export let formaction: string | undefined = undefined;

	function createRipple(event: MouseEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		const ripple = document.createElement('span');
		const rect = button.getBoundingClientRect();

		const size = Math.max(rect.width, rect.height);
		const x = event.clientX - rect.left - size / 2;
		const y = event.clientY - rect.top - size / 2;

		ripple.style.width = ripple.style.height = `${size}px`;
		ripple.style.left = `${x}px`;
		ripple.style.top = `${y}px`;
		ripple.classList.add('ripple');

		const existingRipple = button.getElementsByClassName('ripple')[0];
		if (existingRipple) {
			existingRipple.remove();
		}

		button.appendChild(ripple);
	}
</script>

<button
	{type}
	{disabled}
	class="button {variant} {size}"
	class:full-width={fullWidth}
	{formaction}
	on:click
	on:mousedown={createRipple}
>
	<slot />
</button>

<style>
	.full-width {
		width: 100%;
	}

	.button {
		font-family: inherit;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-weight: 500;
		letter-spacing: 0.02857em;
		text-transform: uppercase;
		transition:
			background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
			box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
			border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
			color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
		position: relative;
		overflow: hidden;
	}

	.button:disabled {
		background-color: rgba(0, 0, 0, 0.12);
		color: rgba(0, 0, 0, 0.26);
		cursor: default;
		pointer-events: none;
	}

	/* Variants */
	.primary {
		background-color: var(--orange-100);
		color: #000;
		box-shadow:
			0px 3px 1px -2px rgba(0, 0, 0, 0.2),
			0px 2px 2px 0px rgba(0, 0, 0, 0.14),
			0px 1px 5px 0px rgba(0, 0, 0, 0.12);
	}

	.primary:hover {
		background-color: var(--orange-200);
	}

	.secondary {
		background-color: #9c27b0;
		color: #fff;
		box-shadow:
			0px 3px 1px -2px rgba(0, 0, 0, 0.2),
			0px 2px 2px 0px rgba(0, 0, 0, 0.14),
			0px 1px 5px 0px rgba(0, 0, 0, 0.12);
	}

	.secondary:hover {
		background-color: #7b1fa2;
	}

	.text {
		background-color: transparent;
		color: var(--orange-200);
		box-shadow: none;
	}

	.text:hover {
		background-color: rgba(25, 118, 210, 0.04);
	}

	.outlined {
		background-color: transparent;
		border: 1px solid var(--orange-600);
		color: var(--orange-800);
		box-shadow: none;
	}

	.outlined:hover {
		background-color: rgba(255, 152, 0, 0.04);
		border-color: var(--orange-200);
		color: var(--orange-200);
	}

	.outlined:disabled {
		border: 1px solid rgba(0, 0, 0, 0.12);
	}

	/* Sizes */
	.small {
		padding: 4px 10px;
		font-size: 0.8125rem;
	}

	.medium {
		padding: 6px 16px;
		font-size: 0.875rem;
	}

	.large {
		padding: 8px 22px;
		font-size: 0.9375rem;
	}

	:global(.ripple) {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple 600ms linear;
		background-color: rgba(255, 255, 255, 0.7);
		pointer-events: none;
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}
</style>
