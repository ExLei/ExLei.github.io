/**
 * 正文图片统一处理：
 * - markdown 语法图片（`![]()`）：hast 层 wrapNode 包裹为原图链接；
 * - 裸 HTML 图片（`<img ...>`，Pages CMS 富文本常见输出）：mdast 层正则
 *   处理 `html` 节点，仅当节点整体为单个 `<img>` 标签时包裹，其余原样跳过；
 * - 统一加 `loading="lazy"`（图源为 800KB~4MB 的 GitHub 附件，首屏受益）。
 * 包裹目标：`<a href="原图" target="_blank" data-lightbox="post">`，
 * 禁用 JS 时点击直接新标签打开原图。
 * 零额外依赖：satteri 由 astro 自带。
 */
import { defineHastPlugin, defineMdastPlugin } from "satteri";

/** 整值恰好是单个 <img> 标签（自闭合或非自闭合） */
const SINGLE_IMG_TAG = /^<img\b[^>]*>$/s;
/** 双引号或单引号 src（提取不成功则整条跳过，保持原文） */
const SRC_ATTR = /\bsrc\s*=\s*("([^"]*)"|'([^']*)')/;

function wrapHtml(src, imgTag) {
	const withLazy = /\bloading\s*=/i.test(imgTag)
		? imgTag
		: imgTag.replace(/\s*\/?>$/, ' loading="lazy"$&');
	return `<a href="${src}" target="_blank" rel="noopener noreferrer" class="img-lightbox-link" data-lightbox="post">${withLazy}</a>`;
}

export const imageLightboxMdast = defineMdastPlugin({
	name: "image-lightbox-mdast",
	html(node, ctx) {
		const value = node.value;
		if (!SINGLE_IMG_TAG.test(value)) return;
		const match = SRC_ATTR.exec(value);
		if (!match) return;
		const src = match[2] ?? match[3];
		if (typeof src !== "string" || src === "") return;
		ctx.replaceNode(node, { type: "html", value: wrapHtml(src, value) });
	},
});

export const imageLightboxHast = defineHastPlugin({
	name: "image-lightbox-hast",
	element: {
		filter: ["img"],
		visit(node, ctx) {
			const src = node.properties?.src;
			if (typeof src !== "string" || src === "") return;

			ctx.setProperty(node, "loading", "lazy");

			const parent = ctx.parent(node);
			if (parent?.type === "element" && parent.tagName === "a") return;

			ctx.wrapNode(node, {
				type: "element",
				tagName: "a",
				properties: {
					href: src,
					target: "_blank",
					rel: "noopener noreferrer",
					className: ["img-lightbox-link"],
					"data-lightbox": "post",
				},
				children: [],
			});
		},
	},
});
