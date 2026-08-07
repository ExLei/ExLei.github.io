import type { APIContext } from "astro";
import { getAllPosts } from "../lib/posts";

/** 构建期生成静态搜索索引：文章元信息 + 正文纯文本 */
export async function GET(_context: APIContext) {
	const posts = await getAllPosts();
	const index = posts.map((p) => ({
		slug: p.id,
		title: p.data.title,
		description: p.data.description,
		tags: p.data.tags,
		category: p.data.category,
		date: p.data.published.toISOString(),
		text: `${p.data.title}\n${p.data.description}\n${p.data.tags.join(" ")}\n${p.data.category}\n${(p.body ?? "").replace(/[#>*`_\-\[\]()!]/g, " ")}`,
	}));
	return new Response(JSON.stringify(index), {
		headers: { "Content-Type": "application/json" },
	});
}
