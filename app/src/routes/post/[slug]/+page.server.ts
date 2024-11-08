import { postQuery as query, type Post } from '$lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { loadQuery } = event.locals;
	const { slug } = event.params;

	const params = { slug };
	const initial = await loadQuery<Post>(query, params);

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	return {
		query,
		params,
		options: { initial },
		metadata: {
			title: `${initial.data.title} | The Ritvik Blog`,
			description: initial.data.excerpt,
			image: initial.data.mainImage ? urlFor(initial.data.mainImage).url() : undefined
		}
	};
};
