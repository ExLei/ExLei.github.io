/**
 * 文章正文灯箱：点击 data-lightbox="post" 的图片链接 → <dialog> 弹层显示原图。
 * - 聚合文章内全部图片，支持前后切换（多图时显示计数器）
 * - 关闭：ESC（dialog 原生）/ 点击背景 / ✕ 按钮
 * - 无 JS 时该脚本不执行，链接本身 target="_blank" 直接新标签打开原图
 * 零依赖，仅在文章页加载。
 */

interface GalleryItem {
	src: string;
	alt: string;
}

export function initLightbox(): void {
	const links = Array.from(
		document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox="post"]'),
	);
	if (links.length === 0) return;

	const items: GalleryItem[] = links.map((a) => ({
		src: a.href,
		alt: a.querySelector("img")?.alt ?? "",
	}));

	const dialog = document.createElement("dialog");
	dialog.className = "lightbox";
	dialog.setAttribute("aria-label", "图片查看器");

	const frame = document.createElement("div");
	frame.className = "lightbox-frame";
	const img = document.createElement("img");
	frame.append(img);
	dialog.append(frame);

	const btn = (label: string, cls: string, glyph: string) => {
		const b = document.createElement("button");
		b.type = "button";
		b.className = `lightbox-btn ${cls}`;
		b.setAttribute("aria-label", label);
		b.textContent = glyph;
		dialog.append(b);
		return b;
	};
	const close = btn("关闭", "lightbox-close", "✕");
	const prev = btn("上一张", "lightbox-prev", "‹");
	const next = btn("下一张", "lightbox-next", "›");

	const counter = document.createElement("span");
	counter.className = "lightbox-counter";
	dialog.append(counter);

	document.body.append(dialog);

	const total = items.length;
	let current = 0;

	function show(index: number): void {
		current = index;
		img.src = items[index].src;
		img.alt = items[index].alt;
		counter.textContent = `${index + 1} / ${total}`;
		const multi = total > 1;
		prev.hidden = !multi;
		next.hidden = !multi;
		if (multi) {
			prev.disabled = index === 0;
			next.disabled = index === total - 1;
		}
	}

	links.forEach((a, i) => {
		a.addEventListener("click", (e) => {
			e.preventDefault();
			show(i);
			dialog.showModal();
		});
	});
	close.addEventListener("click", () => dialog.close());
	prev.addEventListener("click", () => show(current - 1));
	next.addEventListener("click", () => show(current + 1));
	dialog.addEventListener("click", (e) => {
		// 点背景（dialog 或 frame）关闭；点图片本身不关闭
		if (e.target === dialog || e.target === frame) dialog.close();
	});
}
