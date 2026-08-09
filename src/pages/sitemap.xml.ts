import type { APIContext } from "astro";
import { getAllPosts } from "../lib/posts";

/** 自托管 sitemap（零依赖）：静态页面 + 全部文章，lastmod 取发布日期 */
export async function GET(context: APIContext) {
	const origin = context.site?.origin ?? "https://exlei.github.io";
	const posts = await getAllPosts();

	const staticPages = ["/", "/archive/", "/search/", "/about/"];
	const entries = [
		...staticPages.map((p) => ({ loc: `${origin}${p}`, lastmod: null })),
		...posts.map((p) => ({
			loc: `${origin}/posts/${p.id}/`,
			lastmod: p.data.published.toISOString(),
		})),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) =>
			`  <url>\n    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""}\n  </url>`,
	)
	.join("\n")}
</urlset>
`;

	return new Response(xml, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
}
