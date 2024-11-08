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
			description: 'My personal blog. I write about software engineering, web3 and spirituality.',
			image:
				'https://raw.githubusercontent.com/raghav-rama/the-ritvik/refs/heads/master/app/static/banner.png'
		}
	};
};
