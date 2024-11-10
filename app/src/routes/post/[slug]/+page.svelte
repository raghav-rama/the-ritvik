<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import { useQuery } from '@sanity/svelte-loader';
	import { formatDate } from '$lib/utils';
	import { urlFor } from '$lib/sanity/image';
	import type { PageData } from './$types';
	import SanityImage from '@/components/SanityImage.svelte';
	import NormalTextSanity from '@/components/NormalTextSanity.svelte';

	export let data: PageData;
	const q = useQuery(data);

	$: ({ data: post } = $q);

	$: articleUrl = `https://theritvik.in/post/${post.slug.current}`;
	$: formattedExcerpt = post.excerpt?.substring(0, 160) || '';
</script>

<svelte:head>
	<title>{post.title} | The Ritvik Blog</title>
	<meta name="description" content={formattedExcerpt} />
	<link rel="canonical" href={articleUrl} />
	<meta name="robots" content="index, follow" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={formattedExcerpt} />
	<meta property="og:image" content={post.mainImage ? urlFor(post.mainImage).url() : ''} />
	<meta property="og:image:alt" content={`Cover image for ${post.title}`} />
	<meta property="og:url" content={articleUrl} />
	<meta property="og:site_name" content="The Ritvik Blog" />
	<meta property="og:locale" content="en_US" />

	<!-- Schema.org -->
	<meta property="article:published_time" content={post._createdAt} />
	<meta property="article:modified_time" content={post._updatedAt} />
	<meta property="article:author" content="Ritvik Singh" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={formattedExcerpt} />
	<meta name="twitter:image" content={post.mainImage ? urlFor(post.mainImage).url() : ''} />
	<meta name="twitter:creator" content="@Raghav__Rama" />
	<meta name="twitter:site" content="@Raghav__Rama" />

	<meta name="author" content="Ritvik Singh" />

	<meta name="theme-color" content="#FF0000" />

	<!-- Schema.org -->
	{@html `
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			"headline": "${post.title}",
			"image": "${post.mainImage ? urlFor(post.mainImage).url() : ''}",
			"datePublished": "${post._createdAt}",
			"dateModified": "${post._updatedAt}",
			"author": {
				"@type": "Person",
				"name": "Ritvik Singh",
				"url": "https://www.theritvik.in"
			},
			"publisher": {
				"@type": "Organization",
				"name": "The Ritvik Blog",
				"logo": {
					"@type": "ImageObject",
					"url": "https://www.theritvik.in/banner.png"
				}
			},
			"description": "${formattedExcerpt.replace(/"/g, '\\"')}",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "${articleUrl}"
			}
		}
	</script>
	`}
</svelte:head>

<section class="post">
	{#if post.mainImage}
		<img
			class="post__cover"
			src={urlFor(post.mainImage).url()}
			alt="Cover image for {post.title}"
		/>
	{:else}
		<div class="post__cover--none" />
	{/if}
	<div class="post__container">
		<h1 class="post__title">{post.title}</h1>
		{#if post.excerpt}
			<p class="post__excerpt">{post.excerpt}</p>
		{/if}
		<p class="post__date">
			<span class="post__date--updated"> Updated </span>
			{formatDate(post._updatedAt)}
		</p>
		{#if post.body}
			<div class="post__content">
				<PortableText
					components={{
						types: {
							image: SanityImage
						},
						listItem: NormalTextSanity
					}}
					value={post.body}
				/>
			</div>
		{/if}
	</div>
</section>

<style>
	.post {
		width: 100%;
		margin: var(--space-1) 0 var(--space-4);
	}

	.post .post__cover,
	.post .post__cover--none {
		width: 100%;
		height: 200px;
		-o-object-fit: cover;
		object-fit: cover;
	}

	.post .post__cover--none {
		background: var(--black);
	}

	.post .post__container {
		padding: 0 var(--space-3);
	}

	.post .post__content {
		font-family: var(--font-family-serif);
		font-weight: 400;
		font-size: var(--font-size-4);
		line-height: var(--line-height-5);
		letter-spacing: -0.02em;
		margin-top: var(--space-6);
	}

	.post .post__date--updated {
		font-weight: 200;
		opacity: 0.7;
		font-size: var(--font-size-2);
	}

	/* .post .post__content blockquote {
		border-left: 5px solid var(--black);
		padding-left: var(--space-3);
		margin-left: var(--space-4);
	}

	.post .post__content a {
		color: var(--blue-600);
		text-decoration: none;
	} */

	.post .post__title {
		font-family: var(--font-family-sans);
		font-size: var(--font-size-7);
		line-height: var(--line-height-6);
		margin: var(--space-4) 0;
		font-weight: 800;
	}

	.post .post__excerpt {
		font-family: var(--font-family-serif);
		font-size: var(--font-size-5);
		line-height: var(--line-height-4);
		margin-top: 0;
		font-weight: 400;
	}

	.post .post__date {
		font-family: var(--font-family-sans);
		font-weight: 600;
		font-family: var(--font-family-sans);
		font-size: var(--font-size-1);
		line-height: var(--line-height-1);
		margin-top: var(--space-4);
	}

	@media (min-width: 800px) {
		.post .post__cover,
		.post .post__cover--none {
			width: 750px;
			height: 380px;
		}

		.post .post__title {
			font-size: var(--font-size-10);
			line-height: var(--line-height-10);
			margin: var(--space-6) 0 0;
			letter-spacing: -0.025em;
		}

		.post .post__excerpt {
			font-size: var(--font-size-5);
			line-height: var(--line-height-5);
			margin-top: var(--space-3);
			margin-bottom: var(--space-3);
		}

		.post .post__date {
			font-size: var(--font-size-3);
			line-height: var(--line-height-2);
			margin-top: var(--space-0);
		}

		.post .post__content {
			margin-top: var(--space-7);
		}
	}
</style>
