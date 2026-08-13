/** 文章索引记录的单一映射（纯模块：仅类型依赖 astro:content，可独立单测） */
import type { CollectionEntry } from "astro:content";
import { readingTime } from "./reading-time";

/** 文章索引记录：Post 的客户端/输出端投影 */
export type PostData = {
	slug: string;
	title: string;
	description: string;
	/** ISO 日期字符串 */
	published: string;
	tags: string[];
	category: string;
	readingMinutes: number;
};

/** 搜索索引记录：PostData + 全文纯文本（search-index.json 的输出形状） */
export type SearchIndexEntry = PostData & { text: string };

/** Post → 索引记录的唯一映射（页面列表 / search-index / 筛选面板共用） */
export function toPostData(post: CollectionEntry<"posts">): PostData {
	return {
		slug: post.id,
		title: post.data.title,
		description: post.data.description,
		published: post.data.published.toISOString(),
		tags: post.data.tags,
		category: post.data.category,
		readingMinutes: readingTime(post.body ?? ""),
	};
}

/** zh-CN 长日期格式（PostList / PostMeta 共用，唯一 owner）
 * 手工拼接：不依赖 toLocaleDateString 的运行时 ICU 数据（small-icu 下输出会漂移）。 */
export function formatPublishedDate(iso: string): string {
	const d = new Date(iso);
	return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 文章邻居（按列表顺序）：prev = 更旧一篇（i+1），next = 更新一篇（i-1）；首尾为 undefined */
export function withNeighbors<T extends { id: string }>(
	items: T[],
	id: string,
): { prev?: T; next?: T } {
	const i = items.findIndex((it) => it.id === id);
	if (i === -1) return {};
	return { prev: items[i + 1], next: items[i - 1] };
}
