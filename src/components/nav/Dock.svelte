<script lang="ts">
	import Icon from "@iconify/svelte";
	import { navItems, withBase } from "../../config";

	/* 当前路径由客户端维护：View Transitions 导航后通过 astro:page-load 事件更新，
	使 Dock 常驻（不随页面重挂载）且指示点保持正确 */
	let path = $state("");

	$effect(() => {
		const update = () => (path = location.pathname);
		update();
		document.addEventListener("astro:page-load", update);
		window.addEventListener("popstate", update);
		return () => {
			document.removeEventListener("astro:page-load", update);
			window.removeEventListener("popstate", update);
		};
	});

	let activePath = $derived(path.endsWith("/") ? path : path + "/");

	let dockEl = $state<HTMLElement>();
	let scales = $state<number[]>(navItems.map(() => 1));

	/* macOS 风格：按指针与图标中心的距离放大，邻项联动 */
	function handleMove(e: PointerEvent) {
		const dock = dockEl;
		if (!dock) return;
		const rect = dock.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const links = dock.querySelectorAll<HTMLElement>("a");
		scales = navItems.map((_, i) => {
			const el = links[i];
			if (!el) return 1;
			const er = el.getBoundingClientRect();
			const cx = er.left - rect.left + er.width / 2;
			const d = Math.abs(x - cx);
			const maxDist = 110;
			const t = Math.max(0, 1 - d / maxDist);
			return 1 + t * 0.55;
		});
	}

	function handleLeave() {
		scales = navItems.map(() => 1);
	}
</script>

<nav
	bind:this={dockEl}
	onpointermove={handleMove}
	onpointerleave={handleLeave}
	class="flex items-end gap-1.5 rounded-2xl border border-hairline bg-paper/85 px-3 py-2 shadow-lg backdrop-blur-md"
	aria-label="主导航"
>
	{#each navItems as item, i (item.href)}
		<a
			href={withBase(item.href)}
			class="group relative flex flex-col items-center rounded-xl px-2 pb-1 pt-1.5 transition-colors duration-150 ease-out"
			style="transform: scale({scales[i]})"
			aria-label={item.label}
			aria-current={activePath === withBase(item.href) ? "page" : undefined}
		>
			<Icon icon={item.icon} class="size-6" />
			<span
				class="pointer-events-none absolute -top-10 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100"
			>
				{item.label}
			</span>
			<span
				class="mt-1 size-1 rounded-full {activePath === withBase(item.href)
					? 'bg-accent'
					: 'bg-transparent'}"
			></span>
		</a>
	{/each}
</nav>
