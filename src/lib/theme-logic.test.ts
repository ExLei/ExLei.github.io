import { describe, expect, it } from "bun:test";
import { resolveTheme } from "./theme-logic";

describe("resolveTheme", () => {
	it("无显式偏好：跟随系统", () => {
		expect(resolveTheme(null, true)).toBe(true);
		expect(resolveTheme(null, false)).toBe(false);
	});

	it("显式 dark：无视系统偏好", () => {
		expect(resolveTheme("dark", false)).toBe(true);
	});

	it("显式 light：无视系统偏好", () => {
		expect(resolveTheme("light", true)).toBe(false);
	});

	it("未知存储值视为跟随系统", () => {
		expect(resolveTheme("garbage", true)).toBe(true);
		expect(resolveTheme("garbage", false)).toBe(false);
	});
});
