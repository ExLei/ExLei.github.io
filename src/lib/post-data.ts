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
