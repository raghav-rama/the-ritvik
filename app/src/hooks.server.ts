import { handlePreviewMode, handleLiveLoader } from '@sanity/sveltekit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { serverClient } from '$lib/server/sanity/client';
import { token } from '$lib/server/sanity/api';

export const handle = sequence(
	handlePreviewMode({
		client: serverClient,
		preview: { redirect }
	}),
	handleLiveLoader({
		client: serverClient,
		browserToken: token,
		serverToken: token
	})
);
