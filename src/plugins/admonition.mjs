/**
 * 提醒条（Admonition）渲染：将 `::: tip|warning|danger|note|info` 容器指令
 * 渲染为 `<aside class="admonition admonition-<type>">`，标题为大写类型标签。
 * 依赖 remark-directive 解析容器语法。
 */
import { visit } from "unist-util-visit";

const TITLES = {
	tip: "TIP",
	warning: "WARNING",
	warn: "WARNING",
	caution: "WARNING",
	danger: "DANGER",
	note: "NOTE",
	info: "NOTE",
};

export function admonition() {
	return (tree) => {
		visit(tree, (node) => {
			if (node.type !== "containerDirective") return;
			const data = node.data ?? (node.data = {});
			const name = node.name;
			data.hName = "aside";
			data.hProperties = { className: ["admonition", `admonition-${name}`] };
			node.children.unshift({
				type: "paragraph",
				data: { hName: "p", hProperties: { className: ["admonition-title"] } },
				children: [{ type: "text", value: TITLES[name] ?? name.toUpperCase() }],
			});
		});
	};
}
