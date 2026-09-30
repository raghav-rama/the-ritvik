<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { urlFor } from '$lib/sanity/image';
	import type { Post } from '$lib/sanity/queries';

	let { post, loading = 'lazy' }: { post: Post; loading?: 'eager' | 'lazy' } = $props();
	const titleId = $props.id();
</script>

<a class="card" href={`/post/${post.slug.current}`} aria-labelledby={titleId}>
	{#if post.mainImage}
		<img
			class="card__cover"
			src={urlFor(post.mainImage).width(640).height(400).fit('crop').auto('format').url()}
			alt="Cover image for {post.title}"
			width="640"
			height="400"
			{loading}
		/>
	{:else}
		<div class="card__cover card__cover--none" aria-hidden="true">The Ritvik Blog</div>
	{/if}

	<div class="card__container">
		<h2 id={titleId} class="card__title">
			{post.title}
		</h2>
		{#if post.excerpt}
			<p class="card__excerpt">
				{post.excerpt}
			</p>
		{/if}
		<time class="card__date" datetime={post._createdAt}>
			{formatDate(post._createdAt)}
		</time>
	</div>
</a>

<style>
	.card {
		display: grid;
		gap: var(--space-4);
		padding: var(--space-5) 0;
		border-bottom: 1px solid var(--gray-200);
		color: var(--black);
		text-decoration: none;
	}

	.card__container {
		min-width: 0;
	}

	.card__cover {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 8 / 5;
		object-fit: cover;
		border-radius: var(--radius-md);
	}

	.card__cover--none {
		display: grid;
		place-items: center;
		background: var(--gray-100);
		color: var(--gray-600);
		font-family: var(--font-family-serif), serif;
	}

	.card__title {
		font-family: var(--font-family-sans), sans-serif;
		font-weight: 800;
		font-size: clamp(1.5rem, 2.4vw, 1.875rem);
		line-height: 1.2;
		letter-spacing: -0.025em;
		overflow-wrap: anywhere;
		margin: 0 0 var(--space-3);
	}

	.card__excerpt {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		overflow-wrap: anywhere;
		font-family: var(--font-family-serif), serif;
		font-weight: 400;
		font-size: var(--font-size-3);
		line-height: 1.6;
		margin: 0 0 var(--space-4);
	}

	.card__date {
		display: block;
		color: var(--gray-600);
		font-family: var(--font-family-sans), sans-serif;
		font-size: var(--font-size-1);
		line-height: 1.5;
	}

	.card:hover .card__title,
	.card:focus-visible .card__title {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.card:focus-visible {
		outline: 2px solid var(--blue-600);
		outline-offset: 6px;
		border-radius: var(--radius-sm);
	}

	.card:last-child {
		border-bottom: none;
	}

	@media (min-width: 700px) {
		.card {
			grid-template-columns: minmax(0, 30%) minmax(0, 1fr);
			align-items: center;
			gap: var(--space-5);
		}
	}
</style>
