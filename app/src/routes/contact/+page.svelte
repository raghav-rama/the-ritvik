<script lang="ts">
	import type { PageData } from '../$types';
	import ContactCard from '@/components/ContactCard.svelte';
	export let data: PageData;

	const contactCards = [
		{ href: 'https://github.com/raghav-rama', icon: 'line-md:github', title: 'GitHub' },
		{
			href: 'https://www.linkedin.com/in/ritviksingh258',
			icon: 'line-md:linkedin',
			title: 'LinkedIn'
		},
		{
			href: 'https://twitter.com/Raghav__Rama',
			icon: 'line-md:twitter-x',
			title: 'X (formerly Twitter)'
		},
		{ href: 'https://t.me/hackerrboy', icon: 'line-md:telegram', title: 'Telegram' },
		{ href: 'https://www.youtube.com/@hackerboy5328', icon: 'line-md:youtube', title: 'YouTube' },
		{ href: 'mailto:hi@theritvik.in', icon: 'line-md:email', title: 'Email' }
	];

	$: ({ metadata } = data);
</script>

<section>
	<h1>Can't resist the urge to contact me? Haha, I'm flattered!</h1>
	<p>
		You can find me on the following platforms. Feel free to reach out to me. I'm always open to
		discussions and collaborations.
	</p>

	<div class="cards-container">
		{#each contactCards as card}
			<ContactCard {...card} />
		{/each}
	</div>

	<div class="ps-container">
		<h2 class="ps-container__title">P.S. Some embarrasing facts about me:</h2>
		<ul class="ps-container__facts">
			<li>My reddit karma is sub zero 😭</li>
			<li>I don't have an instagram account 🤷‍♂️</li>
		</ul>
	</div>
</section>

<svelte:head>
	<title>{metadata.title}</title>
	<meta name="description" content={metadata.description} />
	<meta property="og:image" content={metadata.image} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://theritvik.in/contact" />
	<meta property="og:site_name" content="The Ritvik Blog" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />
	<meta name="twitter:image" content={metadata.image} />
</svelte:head>

<style>
	section {
		margin: 0 auto;
		padding: 0 0.5rem;
	}
	.cards-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.ps-container {
		display: flex;
		flex-direction: column;
	}
	.ps-container__title {
		margin-bottom: 0rem;
	}
	.ps-container__facts {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}
	.ps-container__facts li {
		margin: 0;
		list-style-position: unset;
	}
</style>
