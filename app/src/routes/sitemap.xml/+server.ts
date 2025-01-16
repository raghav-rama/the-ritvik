import { client } from '$lib/sanity/client';
import type { RequestHandler } from '@sveltejs/kit';

interface Post {
	slug: { current: string };
	_updatedAt: string;
}

const WEBSITE_URL = 'https://www.theritvik.in';

const staticPages = [
	{
		url: '/',
		priority: 1.0
	},
	{
		url: '/contact',
		priority: 0.8
	}
];

export const GET: RequestHandler = async () => {
	const posts = await client.fetch(`*[_type == "post"] {
    slug,
    _updatedAt
  }`);

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${staticPages
		.map(
			(page) => `
  <url>
    <loc>${WEBSITE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>${page.priority.toFixed(2)}</priority>
  </url>`
		)
		.join('')}
  ${posts
		.map(
			(post: Post) => `
  <url>
    <loc>${WEBSITE_URL}/post/${post.slug.current}</loc>
    <lastmod>${new Date(post._updatedAt).toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>`
		)
		.join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
