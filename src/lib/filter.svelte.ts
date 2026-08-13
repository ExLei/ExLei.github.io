/* 首页筛选共享状态（Svelte 5 runes：.svelte.ts 模块级 $state，跨组件响应式）
 * FilterPanel 写入，PostList/SearchBox 读取——筛选器与列表解耦。
 * 筛选语义（谓词/排序/分组）在 ./filter（纯模块，bun 可直测），此处只持状态。 */
import type { FilterCriteria } from "./filter";

export const filterState = $state<FilterCriteria>({
	sortBy: "newest",
	year: "all",
	tags: [],
});
