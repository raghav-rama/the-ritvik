<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string = '';
	export let type: string = 'text';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let error: string = '';
	export let fullWidth: boolean = false;
	export let id: string = '';
	export let name: string = '';

	const dispatch = createEventDispatcher();

	let focused = false;
	let inputElement: HTMLInputElement;

	function handleFocus() {
		focused = true;
		dispatch('focus');
	}

	function handleBlur() {
		focused = false;
		dispatch('blur');
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		dispatch('input', { value });
	}
</script>

<div class="input-container" class:full-width={fullWidth}>
	<div class="input-wrapper" class:focused class:error={!!error} class:disabled>
		<label class:active={focused || value} for={id}>{placeholder}</label>
		<input
			{name}
			{type}
			{required}
			{disabled}
			{value}
			{id}
			bind:this={inputElement}
			on:focus={handleFocus}
			on:blur={handleBlur}
			on:input={handleInput}
		/>
	</div>
	{#if error}
		<div class="error-text">{error}</div>
	{/if}
</div>

<style>
	.input-container {
		margin: var(--space-2) 0;
	}

	.full-width {
		width: 100%;
	}

	.input-wrapper {
		position: relative;
		border: 2px solid var(--primary-200);
		border-radius: var(--radius-md);
		background-color: var(--white);
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.input-wrapper:hover:not(.disabled) {
		border-color: var(--orange-300);
	}

	.input-wrapper.focused {
		border-color: var(--primary-500);
		background-color: var(--white);
	}

	.input-wrapper.error {
		border-color: var(--red-500);
	}

	.input-wrapper.disabled {
		background-color: var(--gray-100);
		border-color: var(--gray-300);
		cursor: not-allowed;
	}

	label {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		font-size: var(--font-size-2);
		color: var(--gray-600);
		pointer-events: none;
		transition: all 0.2s ease;
		background-color: var(--white);
		padding: 0 4px;
	}

	label.active {
		top: 0;
		transform: translateY(-50%) scale(0.75);
		transform-origin: left top;
	}

	input {
		width: 100%;
		padding: 16px 12px;
		border: none;
		background: transparent;
		outline: none;
		font-size: var(--font-size-2);
		color: var(--gray-900);
	}

	.error-text {
		margin-top: 4px;
		color: var(--red-500);
		font-size: var(--font-size-1);
	}
</style>
