/** 主题偏好决议（纯函数，bun 可直测）
 *
 * ⚠ BaseLayout.astro 的 is:inline 脚本无法 import 模块（FOUC 前提），
 * 其 applyTheme 逻辑是本文件 resolveTheme 的镜像——改这里必须同步改那里。
 */
export const THEME_STORAGE_KEY = "theme";

export type ThemePreference = "dark" | "light";

/** saved=null → 跟随系统；显式 "dark"/"light" → 覆盖系统偏好 */
export function resolveTheme(saved: string | null, systemDark: boolean): boolean {
	return saved === "dark" || (saved !== "light" && systemDark);
}
