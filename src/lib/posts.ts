import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export async function getAllPosts(): Promise<Post[]> {
	const posts = await getCollection("posts");
	return posts
		.filter((p) => !p.data.draft)
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
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

export function getCategories(posts: Post[]): Array<[string, number]> {
	const m = new Map<string, number>();
	for (const p of posts) {
		if (p.data.category) m.set(p.data.category, (m.get(p.data.category) ?? 0) + 1);
	}
	return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export function getAllTags(posts: Post[]): Array<[string, number]> {
	const m = new Map<string, number>();
	for (const p of posts) {
		for (const t of p.data.tags) m.set(t, (m.get(t) ?? 0) + 1);
	}
	return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
