/* 首页筛选共享状态（Svelte 5 runes：.svelte.ts 模块级 $state，跨组件响应式）
 * FilterPanel 写入，PostList/SearchBox 读取——筛选器与列表解耦 */
import type { PostData } from "./posts";

export type { PostData };

export const filterState = $state<{
	sortBy: "newest" | "oldest";
	year: "all" | number;
	/* 标签多选：空数组 = 全部；命中任一标签即显示（OR） */
	tags: string[];
}>({
	sortBy: "newest",
	year: "all",
	tags: [],
});
