import { client } from '$lib/sanity/client';
import { token } from '$lib/server/sanity/api';

export const serverClient = client.withConfig({
	token,
	useCdn: true,
	stega: true
});
