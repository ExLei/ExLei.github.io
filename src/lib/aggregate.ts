/** 纯聚合函数（无 astro 依赖，服务端与客户端组件共用） */

/** 统计标签出现次数，按次数降序 */
export function aggregateTags(posts: Array<{ tags: string[] }>): Array<[string, number]> {
	const m = new Map<string, number>();
	for (const p of posts) {
		for (const t of p.tags) m.set(t, (m.get(t) ?? 0) + 1);
	}
	return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

/** 统计分类出现次数，按次数降序 */
export function aggregateCategories(
	posts: Array<{ category: string | undefined }>,
): Array<[string, number]> {
	const m = new Map<string, number>();
	for (const p of posts) {
		if (p.category) m.set(p.category, (m.get(p.category) ?? 0) + 1);
	}
	return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
