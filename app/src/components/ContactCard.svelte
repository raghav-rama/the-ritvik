<script lang="ts">
	export let href: string;
	export let icon: string;
	export let title: string;

	import Icon from '@iconify/svelte';
</script>

<a {href} target="_blank" rel="noopener noreferrer">
	<div class="container">
		<div class="container__contact-card">
			<div class="container__contact-card__icon">
				<Icon {icon} />
			</div>
			<span>{title}</span>
		</div>
	</div>
</a>

<style>
	.container {
		display: flex;
		justify-content: center;
	}
	.container__contact-card {
		transition: transform 0.1s ease-in-out;
		display: flex;
		align-items: center;
		border: 3px solid var(--black);
		border-radius: 0.5rem;
		padding: 0.5rem;
		width: 100%;
		background: rgb(255, 130, 0);
		background: radial-gradient(
			circle,
			rgba(255, 130, 0, 0.267927239255077) 0%,
			rgba(255, 207, 0, 0.48361351376488093) 100%
		);
	}
	.container__contact-card:hover {
		transform: scale(1.02);
	}
	.container__contact-card__icon {
		display: flex;
		align-items: center;
		margin-right: 1rem;
		font-size: var(--font-size-5);
	}
	span {
		flex: 1;
		text-align: center;
		font-size: var(--font-size-4);
	}

	@media (min-width: 768px) {
		.container__contact-card__icon {
			font-size: var(--font-size-7);
		}
		span {
			font-size: var(--font-size-5);
		}
	}
</style>
