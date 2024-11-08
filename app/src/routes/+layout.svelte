<script lang="ts">
	import { isPreviewing, VisualEditing } from '@sanity/visual-editing/svelte';
	import { page } from '$app/stores';
	import LiveMode from '../components/LiveMode.svelte';
</script>

{#if $isPreviewing}
	<a href={`/preview/disable?redirect=${$page.url.pathname}`} class="preview-toggle">
		<span>Preview Enabled</span>
		<span>Disable Preview</span>
	</a>
{/if}

<div class="container">
	<header class="header">
		<a class="header__title" href="/">Ritvik's Blog</a>
	</header>
	<main>
		<slot />
	</main>
	<footer class="footer">
		<p class="footer__text">
			Made with <svg
				data-sanity-icon="heart-filled"
				width="1em"
				height="1em"
				viewBox="0 0 25 25"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M17 16C15.8 17.3235 12.5 20.5 12.5 20.5C12.5 20.5 9.2 17.3235 8 16C5.2 12.9118 4.5 11.7059 4.5 9.5C4.5 7.29412 6.1 5.5 8.5 5.5C10.5 5.5 11.7 6.82353 12.5 8.14706C13.3 6.82353 14.5 5.5 16.5 5.5C18.9 5.5 20.5 7.29412 20.5 9.5C20.5 11.7059 19.8 12.9118 17 16Z"
					fill="currentColor"
					stroke="currentColor"
					stroke-width="1.2"
				/></svg
			>
			by Ritvik
			<a
				class="footer__text--link"
				href="https://github.com/raghav-rama/the-ritvik"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg width="1em" height="1em" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
						fill="#24292f"
					/></svg
				>
			</a>
		</p>
	</footer>
</div>

{#if $isPreviewing}
	<VisualEditing />
	<LiveMode />
{/if}

<style>
	.container {
		margin: 0 auto;
	}

	main {
		margin-top: 45px;
	}

	.header {
		display: flex;
		padding: 0 var(--space-1);
		border-bottom: 1px solid #ced2d9;

		z-index: 10;
		background: var(--white);
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
	}

	.header .header__title {
		font-weight: 800;
		font-size: var(--font-size-3);
		line-height: var(--line-height-1);
		padding-left: var(--space-2);
		margin: var(--space-3) 0;
		text-decoration: none;
		color: var(--black);
	}

	.footer {
		display: flex;
		justify-content: flex-end;
		padding: 0 var(--space-3);
	}

	.footer .footer__text {
		font-size: var(--font-size-1);
		line-height: var(--line-height-1);
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.footer .footer__text--link {
		margin-left: var(--space-1);
	}

	.footer .footer__text--link:hover {
		border-bottom: 1px solid var(--black);
	}

	@media (min-width: 575px) {
		.container {
			max-width: var(--max-width-1);
			padding: 0 var(--space-4);
		}

		main {
			margin-top: unset;
		}

		.header {
			position: unset;
			border-bottom: none;
			margin: var(--space-3) 0;
			padding: var(--space-2) 0;
			background: unset;
		}

		.header .header__title {
			margin: var(--space-3) 0 var(--space-2);
			font-size: var(--font-size-5);
		}

		.footer {
			margin: var(--space-3) 0;
		}
	}

	.preview-toggle {
		backdrop-filter: blur(12px);
		border-radius: 0.25rem;
		bottom: 1rem;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		color: #1f2937;
		display: block;
		font-size: 0.75rem;
		font-weight: 500;
		line-height: 1rem;
		padding-bottom: 0.5rem;
		padding-left: 0.75rem;
		padding-right: 0.75rem;
		padding-top: 0.5rem;
		position: fixed;
		right: 1rem;
		text-align: center;
		text-decoration: none;
		z-index: 50;
	}

	.preview-toggle:hover {
		background-color: #ef4444;
		color: #ffffff;
	}

	.preview-toggle span:first-child {
		display: block;
	}
	.preview-toggle:hover span:first-child {
		display: none;
	}

	.preview-toggle span:last-child {
		display: none;
	}
	.preview-toggle:hover span:last-child {
		display: block;
	}
</style>
