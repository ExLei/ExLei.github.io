/* 主题状态（Svelte 5 runes，模块级单例）
 *
 * 职责分工：
 * - BaseLayout 内联脚本是「决策者」：首屏防闪烁 + astro:page-load 后从
 *   localStorage/系统偏好重应用 html.dark class（无依赖兜底）
 * - 本 store 从 DOM 单向同步 themeState（图标/UI 状态永远与 DOM 一致），
 *   写入只经 toggleTheme（写 localStorage + class + state）
 */
export const themeState = $state({ dark: false });

function syncFromDom() {
	themeState.dark = document.documentElement.classList.contains("dark");
}

export function toggleTheme() {
	const dark = !themeState.dark;
	try {
		localStorage.setItem("theme", dark ? "dark" : "light");
	} catch {
		/* 隐私模式下 localStorage 可能不可用，仅切换 class */
	}
	document.documentElement.classList.toggle("dark", dark);
	themeState.dark = dark;
}

/* 客户端初始化：挂载时同步一次；导航后（内联脚本重应用 class）再次同步，
 * 修复 persist 下图标状态与 DOM 脱节 */
if (typeof document !== "undefined") {
	syncFromDom();
	document.addEventListener("astro:page-load", syncFromDom);
}
