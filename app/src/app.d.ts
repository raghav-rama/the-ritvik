import type { SanityLocals } from '@sanity/sveltekit';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals extends SanityLocals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
