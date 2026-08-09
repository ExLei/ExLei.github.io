<script lang="ts">
	import Icon from "@iconify/svelte";
	import { filterState } from "../../lib/filter.svelte";
	import FilterPanel from "../FilterPanel.svelte";

	/* 筛选 Dock：与主 Dock 同风格，默认收起，按下弹出详细筛选面板 */
	let open = $state(false);
	let rootEl = $state<HTMLElement>();

	const activeCount = $derived(
		(filterState.year !== "all" ? 1 : 0) +
			filterState.tags.length +
			(filterState.sortBy === "oldest" ? 1 : 0),
	);

	/* 点击外部收起 */
	$effect(() => {
		if (!open) return;
		const handler = (e: PointerEvent) => {
			if (rootEl && !rootEl.contains(e.target as Node)) open = false;
		};
		document.addEventListener("pointerdown", handler);
		return () => document.removeEventListener("pointerdown", handler);
	});

	/* ESC 收起 */
	$effect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") open = false;
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	});
</script>

<div
	bind:this={rootEl}
	class="relative flex items-end rounded-2xl border border-hairline bg-paper/85 px-3 py-2 shadow-lg backdrop-blur-md"
>
	<button
		onclick={() => (open = !open)}
		class="group relative flex flex-col items-center rounded-xl px-2 pb-1 pt-1.5 transition-colors duration-150 ease-out"
		aria-label="筛选"
		aria-expanded={open}
	>
		<Icon icon="material-symbols:tune-rounded" class="size-6" />
		<span
			class="pointer-events-none absolute -top-10 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100"
		>
			筛选
		</span>
		<span
			class="mt-1 size-1 rounded-full {activeCount > 0 || open ? 'bg-accent' : 'bg-transparent'}"
		></span>
	</button>

	{#if open}
		<div
			class="absolute bottom-full left-0 mb-3 w-56 rounded-2xl border border-hairline bg-paper/95 p-4 shadow-lg backdrop-blur-md"
		>
			<FilterPanel />
		</div>
	{/if}
</div>
