import { describe, expect, it } from "bun:test";
import { activeFilterCount, applyFilters, groupByYear } from "./filter";
import type { PostData } from "./post-data";

function makePost(slug: string, published: string, tags: string[] = []): PostData {
	return {
		slug,
		title: "t",
		description: "",
		published,
		tags,
		category: "",
		readingMinutes: 1,
	};
}

const posts = [
	makePost("a", "2025-01-01T00:00:00.000Z", ["WSL"]),
	makePost("b", "2026-01-01T00:00:00.000Z", ["Windows"]),
	makePost("c", "2024-06-15T00:00:00.000Z", ["WSL", "Windows"]),
];

describe("applyFilters", () => {
	it("默认条件：newest 降序，不修改入参", () => {
		const snapshot = JSON.parse(JSON.stringify(posts));
		const out = applyFilters(posts, { sortBy: "newest", year: "all", tags: [] });
		expect(out.map((p) => p.slug)).toEqual(["b", "a", "c"]);
		expect(posts).toEqual(snapshot);
	});

	it("oldest 升序", () => {
		const out = applyFilters(posts, { sortBy: "oldest", year: "all", tags: [] });
		expect(out.map((p) => p.slug)).toEqual(["c", "a", "b"]);
	});

	it("按年过滤", () => {
		const out = applyFilters(posts, { sortBy: "newest", year: 2025, tags: [] });
		expect(out.map((p) => p.slug)).toEqual(["a"]);
	});

	it("标签 OR 语义：命中任一即显示", () => {
		const out = applyFilters(posts, { sortBy: "newest", year: "all", tags: ["Windows"] });
		expect(out.map((p) => p.slug)).toEqual(["b", "c"]);
	});
});

describe("activeFilterCount", () => {
	it("零激活", () => {
		expect(activeFilterCount({ sortBy: "newest", year: "all", tags: [] })).toBe(0);
	});

	it("年 + 标签×2 + 排序各计 1", () => {
		expect(activeFilterCount({ sortBy: "oldest", year: 2025, tags: ["a", "b"] })).toBe(4);
	});
});

describe("groupByYear", () => {
	it("年份降序，组内保持输入顺序", () => {
		const sorted = applyFilters(posts, { sortBy: "newest", year: "all", tags: [] });
		const groups = groupByYear(sorted);
		expect(groups.map(([y]) => y)).toEqual([2026, 2025, 2024]);
		expect(groups[1][1].map((p) => p.slug)).toEqual(["a"]);
	});
});
