/* 导航激活路径（Svelte 5 runes 模块单例）
 *
 * View Transitions 导航后经 astro:page-load 更新；popstate 处理浏览器前进/后退。
 * Dock / SideNav / MobileTabBar 共用，消除三份重复的路径监听样板。
 * 组件模板中调用 getActivePath()（函数内读 $state 建立响应式依赖；
 * 注意：Svelte 5 禁止从模块导出 $derived，故导出 getter 函数）。
 */
const path = $state({ value: "" });

function sync() {
	path.value = location.pathname;
}

export function getActivePath(): string {
	const p = path.value;
	return p.endsWith("/") ? p : p + "/";
}

/* 客户端初始化：模块加载时同步一次并注册监听（SSR 下跳过） */
if (typeof document !== "undefined") {
	sync();
	document.addEventListener("astro:page-load", sync);
	window.addEventListener("popstate", sync);
}
