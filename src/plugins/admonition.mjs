/**
 * 提醒条（Admonition）：把 Sätteri 原生 directive 解析出的 `containerDirective`
 * 节点（`:::tip|warning|danger|note`）渲染为
 * `<aside class="admonition admonition-<type>">` + 等宽大写类型标签。
 * 零额外依赖：satteri 由 astro 自带。
 */
import { defineMdastPlugin } from "satteri";

const TITLES = {
	tip: "TIP",
	warning: "WARNING",
	warn: "WARNING",
	caution: "WARNING",
	danger: "DANGER",
	note: "NOTE",
	info: "NOTE",
};

export const admonition = defineMdastPlugin({
	name: "admonition",
	containerDirective(node, ctx) {
		const name = node.name;
		ctx.setProperty(node, "data", {
			hName: "aside",
			hProperties: { className: ["admonition", `admonition-${name}`] },
		});
		ctx.prependChild(node, {
			type: "paragraph",
			children: [{ type: "text", value: TITLES[name] ?? name.toUpperCase() }],
			data: { hName: "p", hProperties: { className: ["admonition-title"] } },
		});
	},
});
