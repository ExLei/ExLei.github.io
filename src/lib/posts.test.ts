import { describe, expect, it } from "bun:test";
import { toPostData } from "./post-data";
import type { Post } from "./posts";

/** 构造最小 Post（内容集合记录形状） */
function makePost(overrides: Partial<Post["data"]> = {}): Post {
	return {
		id: "test-post",
		body: "正文 **加粗** 内容",
		collection: "posts",
		data: {
			title: "测试文章",
			published: new Date("2026-01-15T00:00:00Z"),
			description: "摘要",
			tags: ["WSL", "Windows"],
			category: "技术",
			draft: false,
			...overrides,
		},
		render: undefined,
		filePath: undefined,
	} as unknown as Post;
}

describe("toPostData", () => {
	it("投影为索引记录形状（published 为 ISO 字符串）", () => {
		expect(toPostData(makePost())).toEqual({
			slug: "test-post",
			title: "测试文章",
			description: "摘要",
			published: "2026-01-15T00:00:00.000Z",
			tags: ["WSL", "Windows"],
			category: "技术",
			readingMinutes: expect.any(Number),
		});
	});

	it("空 body 也至少 1 分钟（最少阅读时长惯例）", () => {
		expect(toPostData(makePost()).readingMinutes).toBeGreaterThan(0);
		expect(toPostData({ ...makePost(), body: "" }).readingMinutes).toBe(1);
	});
});
