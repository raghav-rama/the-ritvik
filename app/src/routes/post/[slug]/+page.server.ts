import { postQuery as query, type Post } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { sanity }, params }) => {
	const { loadQuery } = sanity;

	const { slug } = params;
	const queryParams = { slug };
	const initial = await loadQuery<Post>(query, queryParams);

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	return {
		query,
		params: queryParams,
		options: { initial }
	};
};
