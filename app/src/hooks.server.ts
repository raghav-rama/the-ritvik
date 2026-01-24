import { handlePreviewMode, handleQueryLoader, setServerClient } from '@sanity/sveltekit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { serverClient } from '$lib/server/sanity/client';

setServerClient(serverClient);

export const handle = sequence(
	handlePreviewMode({
		client: serverClient,
		preview: { redirect }
	}),
	handleQueryLoader()
);
