import { describe, expect, it } from "bun:test";
import { aggregateCategories, aggregateTags } from "./aggregate";

describe("aggregateTags", () => {
	it("统计标签出现次数并按次数降序", () => {
		const posts = [
			{ tags: ["WSL", "Windows"] },
			{ tags: ["Windows"] },
			{ tags: ["磁盘"] },
		];
		expect(aggregateTags(posts)).toEqual([
			["Windows", 2],
			["WSL", 1],
			["磁盘", 1],
		]);
	});

	it("空输入返回空数组", () => {
		expect(aggregateTags([])).toEqual([]);
	});
});

describe("aggregateCategories", () => {
	it("统计分类并跳过无分类文章", () => {
		const posts = [
			{ category: "技术" },
			{ category: "技术" },
			{ category: undefined },
		];
		expect(aggregateCategories(posts)).toEqual([["技术", 2]]);
	});
});
