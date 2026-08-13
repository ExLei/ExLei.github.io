import { describe, expect, it } from "bun:test";
import { filterablePaths, navItems, postUrl, relativePostUrl } from "./config";

describe("postUrl", () => {
	it("尾斜杠 always", () => {
		expect(postUrl("hello-world")).toBe("/posts/hello-world/");
	});

	it("RSS 相对 URL 无前导斜杠", () => {
		expect(relativePostUrl("hello-world")).toBe("posts/hello-world/");
	});
});

describe("pageRegistry", () => {
	it("navItems 形状与顺序契约（字面量钉住派生）", () => {
		expect(navItems).toEqual([
			{ label: "首页", href: "/", icon: "material-symbols:home-rounded" },
			{ label: "归档", href: "/archive/", icon: "material-symbols:archive-rounded" },
			{ label: "搜索", href: "/search/", icon: "material-symbols:search-rounded" },
			{ label: "关于", href: "/about/", icon: "material-symbols:person-rounded" },
		]);
	});

	it("filterablePaths 只含标记页", () => {
		expect(filterablePaths).toEqual(["/", "/archive/", "/search/"]);
	});
});
