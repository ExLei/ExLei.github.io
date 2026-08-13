/* 站点单一配置源 */

export const siteConfig = {
	title: "ExLei 的个人博客",
	subtitle: "新人博主，只会夏季八写",
	description: "记录 Windows 折腾过程与日常",
	lang: "zh-CN",
	author: {
		name: "ExLei",
		avatar: "/assets/images/exlei-avatar.png",
	},
};

export const navConfig = {
	position: "bottom" as "bottom" | "left" | "right",
};

/* 静态页面注册表：导航 / 筛选 Dock / sitemap 的唯一数据源 */
export const pageRegistry: Array<{
	path: string;
	label: string;
	icon: string;
	filterable: boolean;
}> = [
	{ path: "/", label: "首页", icon: "material-symbols:home-rounded", filterable: true },
	{ path: "/archive/", label: "归档", icon: "material-symbols:archive-rounded", filterable: true },
	{ path: "/search/", label: "搜索", icon: "material-symbols:search-rounded", filterable: true },
	{ path: "/about/", label: "关于", icon: "material-symbols:person-rounded", filterable: false },
];

/** 导航项（registry 的派生视图，形状保持 { label, href, icon }） */
export const navItems = pageRegistry.map(({ path, label, icon }) => ({
	label,
	href: path,
	icon,
}));

/** 可筛选页面路径（NavContainer 决定 FilterDock 显隐） */
export const filterablePaths = pageRegistry.filter((p) => p.filterable).map((p) => p.path);

/** 为逻辑路径拼接 base 前缀（当前为根路径部署，base = "/"；bun 测试环境无 BASE_URL 时容错为根路径） */
export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL ?? "/";
	if (path.startsWith(base)) return path;
	return base.replace(/\/+$/, "") + path;
}

/** 文章页 URL（trailingSlash: always） */
export function postUrl(slug: string): string {
	return withBase(`/posts/${slug}/`);
}

/** 文章页相对 URL（RSS 用：不带前导斜杠，确保解析到 base 子路径下） */
export function relativePostUrl(slug: string): string {
	return `posts/${slug}/`;
}
