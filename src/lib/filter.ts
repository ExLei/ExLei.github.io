/** 筛选语义（纯模块：无 Svelte runes、无 DOM，bun:test 可直测）
 *
 * filterState（filter.svelte.ts）只持有状态；谓词/排序/分组全部在此，
 * PostList / SearchBox / FilterDock 共用，语义只有一个 owner。
 */
import type { PostData } from "./post-data";

export type SortBy = "newest" | "oldest";

export type FilterCriteria = {
	sortBy: SortBy;
	year: "all" | number;
	/** 标签多选：空数组 = 全部；命中任一标签即显示（OR） */
	tags: string[];
};

/** 按 年 / 标签(OR) / 排序 过滤文章列表；不修改入参 */
export function applyFilters(posts: PostData[], criteria: FilterCriteria): PostData[] {
	let list = posts;
	if (criteria.year !== "all")
		list = list.filter((p) => new Date(p.published).getFullYear() === criteria.year);
	if (criteria.tags.length > 0)
		list = list.filter((p) => criteria.tags.some((t) => p.tags.includes(t)));
	return [...list].sort((a, b) => {
		const d = new Date(a.published).getTime() - new Date(b.published).getTime();
		return criteria.sortBy === "newest" ? -d : d;
	});
}

/** 激活的筛选项数量（year / tags / sortBy 各计 1，FilterDock 指示点用） */
export function activeFilterCount(criteria: FilterCriteria): number {
	return (
		(criteria.year !== "all" ? 1 : 0) +
		criteria.tags.length +
		(criteria.sortBy === "oldest" ? 1 : 0)
	);
}

/** 按年分组（年份降序；组内保持输入顺序——输入通常已按 sortBy 排好） */
export function groupByYear(posts: PostData[]): Array<[number, PostData[]]> {
	const m = new Map<number, PostData[]>();
	for (const p of posts) {
		const y = new Date(p.published).getFullYear();
		m.set(y, [...(m.get(y) ?? []), p]);
	}
	return [...m.entries()].sort((a, b) => b[0] - a[0]);
}
