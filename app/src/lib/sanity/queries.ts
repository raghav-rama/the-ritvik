import type { PortableTextBlock } from '@portabletext/types';
import type { ImageAsset, Slug } from '@sanity/types';
import { defineQuery } from '@sanity/sveltekit';

export const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0]`);

export const postsQuery = defineQuery(
	`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
);

export interface Post {
	_type: 'post';
	_createdAt: string;
	_updatedAt: string;
	title?: string;
	slug: Slug;
	excerpt?: string;
	mainImage?: ImageAsset;
	body: PortableTextBlock[];
}
