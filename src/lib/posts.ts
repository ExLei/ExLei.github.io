import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { aggregateCategories, aggregateTags } from "./aggregate";
import { toPostData } from "./post-data";

export type Post = CollectionEntry<"posts">;

export { toPostData, type PostData, type SearchIndexEntry } from "./post-data";

export async function getAllPosts(): Promise<Post[]> {
	const posts = await getCollection("posts");
	return posts
		.filter((p) => !p.data.draft)
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

export async function getAllPostData(): Promise<import("./post-data").PostData[]> {
	return (await getAllPosts()).map(toPostData);
}

export async function getPost(
	slug: string,
): Promise<{ post: Post; prev?: Post; next?: Post } | undefined> {
	const posts = await getAllPosts();
	const i = posts.findIndex((p) => p.id === slug);
	if (i === -1) return undefined;
	return {
		post: posts[i],
		prev: posts[i + 1],
		next: posts[i - 1],
	};
}

/** Post 结构适配（Post.tags 在 data 下）→ 纯聚合 */
export function getAllTags(posts: Post[]): Array<[string, number]> {
	return aggregateTags(posts.map((p) => ({ tags: p.data.tags })));
}

export function getCategories(posts: Post[]): Array<[string, number]> {
	return aggregateCategories(posts.map((p) => ({ category: p.data.category })));
}
