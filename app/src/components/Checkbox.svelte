<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let checked: boolean = false;
	export let disabled: boolean = false;
	export let label: string = '';
	export let id: string = '';

	const dispatch = createEventDispatcher();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		dispatch('change', { checked });
	}
</script>

<label class="checkbox-container" class:disabled>
	<input type="checkbox" {checked} {disabled} {id} on:change={handleChange} />
	<span class="checkmark">
		<svg viewBox="0 0 24 24">
			<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
		</svg>
	</span>
	{#if label}
		<span class="label">{label}</span>
	{/if}
</label>

<style>
	.checkbox-container {
		display: inline-flex;
		align-items: center;
		position: relative;
		cursor: pointer;
		user-select: none;
		gap: var(--space-2);
	}

	.checkbox-container.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkmark {
		position: relative;
		height: 18px;
		width: 18px;
		background-color: var(--white);
		border: 2px solid var(--gray-600);
		border-radius: 2px;
		transition: all 0.2s ease-in-out;
	}

	input:checked ~ .checkmark {
		background-color: var(--orange-600);
		border-color: var(--orange-600);
	}

	.checkmark svg {
		position: absolute;
		display: none;
		width: 18px;
		height: 18px;
		fill: var(--white);
	}

	input:checked ~ .checkmark svg {
		display: block;
	}

	input:focus ~ .checkmark {
		box-shadow: 0 0 0 4px var(--orange-100);
	}

	.checkbox-container:hover input:not(:disabled) ~ .checkmark {
		border-color: var(--orange-600);
	}

	.label {
		font-size: var(--font-size-2);
		color: var(--black);
	}

	@media (max-width: 480px) {
		.label {
			font-size: var(--font-size-1);
		}
	}
</style>
