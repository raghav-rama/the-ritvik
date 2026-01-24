import { postQuery as query, type Post } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';
import { sanityFetch } from '@sanity/sveltekit';

export const load: PageServerLoad = async (event) => {
	const { slug } = event.params;
	const queryParams = { slug };
	const initial = await sanityFetch(event, { query, params: queryParams });

	return {
		query,
		params: queryParams,
		options: { initial }
	};
};
