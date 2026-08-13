import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { aggregateCategories, aggregateTags } from "./aggregate";
import { toPostData } from "./post-data";

export type Post = CollectionEntry<"posts">;

export { toPostData, type PostData, type SearchIndexEntry } from "./post-data";

let allPostsCache: Promise<Post[]> | undefined;

export function getAllPosts(): Promise<Post[]> {
	allPostsCache ??= getCollection("posts").then((posts) =>
		posts
			.filter((p) => !p.data.draft)
			.sort((a, b) => b.data.published.getTime() - a.data.published.getTime()),
	);
	return allPostsCache;
}

export async function getAllPostData(): Promise<import("./post-data").PostData[]> {
	return (await getAllPosts()).map(toPostData);
}


/** Post 结构适配（Post.tags 在 data 下）→ 纯聚合 */
export function getAllTags(posts: Post[]): Array<[string, number]> {
	return aggregateTags(posts.map((p) => ({ tags: p.data.tags })));
}

export function getCategories(posts: Post[]): Array<[string, number]> {
	return aggregateCategories(posts.map((p) => ({ category: p.data.category })));
}
