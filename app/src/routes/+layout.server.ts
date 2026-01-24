import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals: { sanity } }) => {
	const { previewEnabled } = sanity;
	return { previewEnabled };
};
