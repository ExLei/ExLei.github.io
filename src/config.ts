/* 站点单一配置源 */

export const siteConfig = {
	title: "ExLei 的个人博客",
	subtitle: "新人博主，只会夏季八写",
	description: "记录 Windows 折腾过程与日常",
	lang: "zh-CN",
	timeZone: 8,
	author: {
		name: "ExLei",
		avatar: "/assets/images/exlei-avatar.png",
	},
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/ExLei",
		},
	],
};

/* 导航位置：bottom = Dock 栏（默认） | left | right */
export const navConfig = {
	position: "bottom" as "bottom" | "left" | "right",
};

export const navItems: Array<{ label: string; href: string; icon: string }> = [
	{ label: "首页", href: "/", icon: "material-symbols:home-rounded" },
	{ label: "归档", href: "/archive/", icon: "material-symbols:archive-rounded" },
	{ label: "搜索", href: "/search/", icon: "material-symbols:search-rounded" },
	{ label: "关于", href: "/about/", icon: "material-symbols:person-rounded" },
];

/** 为逻辑路径拼接 base 前缀（当前为根路径部署，base = "/"） */
export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL; // "/"
	if (path.startsWith(base)) return path;
	return base.replace(/\/+$/, "") + path;
}
