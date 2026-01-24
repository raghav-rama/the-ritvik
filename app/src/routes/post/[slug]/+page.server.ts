import { postQuery as query, type Post } from '$lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { sanity }, params }) => {
	const { client, previewEnabled } = sanity;
	const options = { stega: previewEnabled ? true : false };
	// const { loadQuery } = event.locals;
	// const { slug } = event.params;

	// const params = { slug };
	// const initial = await loadQuery<Post>(query, params);

	const { slug } = params;
	const initial = await client.fetch<Post>(query, { slug }, options);

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	const queryParams = { slug };
	return {
		query,
		params: queryParams,
		options: { initial }
	};
};
