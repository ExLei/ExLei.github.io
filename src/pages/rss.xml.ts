import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "../lib/posts";
import { relativePostUrl, siteConfig } from "../config";


export async function GET(context: APIContext) {
	const posts = await getAllPosts();
	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: context.site!.toString(),
		items: posts.map((p) => ({
			title: p.data.title,
			pubDate: p.data.published,
			description: p.data.description,
			// 相对路径（不带前导 /），确保解析到 base 子路径下
			link: relativePostUrl(p.id),
		})),
		customData: `<language>zh-cn</language>`,
	});
}
