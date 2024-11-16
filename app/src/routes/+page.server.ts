import { postsQuery as query, type Post } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { loadQuery } = event.locals;
	const initial = await loadQuery<Post[]>(query);

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	return {
		query,
		options: { initial },
		metadata: {
			title: 'The Ritvik Blog',
			description:
				"Dive into the latest in software engineering, blockchain technology, and Web3 development, where innovation meets practicality. Beyond the code, discover how technology can intersect with spiritual growth and mindful living, creating a balance between cutting-edge solutions and personal transformation.\n\n Join me on this journey of technical expertise, thoughtful innovation, and purposeful growth, shaping a future that's both impactful and human-centered.",
			image: 'https://www.theritvik.in/banner.png'
		}
	};
};
