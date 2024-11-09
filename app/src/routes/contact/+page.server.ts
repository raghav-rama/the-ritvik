import type { PageServerLoad } from '../$types';

export const prerender = true;

export const load: PageServerLoad = async (event) => {
	return {
		metadata: {
			title: 'Contact | The Ritvik Blog',
			description: "Can't resist the urge to contact me? Haha, I'm flattered!",
			image: 'https://theritvik.in/banner.svg'
		}
	};
};
