import { describe, expect, it } from "bun:test";
import { formatPublishedDate, withNeighbors } from "./post-data";

describe("withNeighbors", () => {
	const items = [{ id: "a" }, { id: "b" }, { id: "c" }];

	it("中间项：prev = 更旧(i+1)，next = 更新(i-1)", () => {
		expect(withNeighbors(items, "b")).toEqual({ prev: { id: "c" }, next: { id: "a" } });
	});

	it("首项无 prev，末项无 next", () => {
		expect(withNeighbors(items, "a")).toEqual({ prev: { id: "b" }, next: undefined });
		expect(withNeighbors(items, "c")).toEqual({ prev: undefined, next: { id: "b" } });
	});

	it("缺失 id 返回空对象", () => {
		expect(withNeighbors(items, "zzz")).toEqual({});
	});
});

describe("formatPublishedDate", () => {
	it("zh-CN 长日期契约（无 Z 后缀按本地时区解析，跨时区确定）", () => {
		expect(formatPublishedDate("2026-01-15")).toBe("2026年1月15日");
	});
});
