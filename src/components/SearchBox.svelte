<script lang="ts">
	import { withBase } from "../config";
	import { filterState } from "../lib/filter.svelte";
	import type { SearchIndexEntry } from "../lib/posts";

	let query = $state("");
	let results = $state<Array<{ url: string; title: string; excerpt: string }>>([]);
	let busy = $state(false);
	let index: SearchIndexEntry[] | null = null;

	/* 筛选 Dock 条件变化时重新搜索（建立响应式依赖） */
	$effect(() => {
		void filterState.sortBy;
		void filterState.year;
		void filterState.tags;
		if (query.trim()) search();
	});

	function highlight(text: string, terms: string[]): string {
		let out = text;
		for (const t of terms) {
			out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>");
		}
		return out;
	}

	function makeExcerpt(doc: (typeof index)[number], terms: string[]): string {
		const hay = `${doc.description} ${doc.tags.join(" ")} ${doc.category}`.trim();
		if (!hay) return "";
		// 优先展示含命中的上下文
		for (const t of terms) {
			const i = hay.toLowerCase().indexOf(t);
			if (i !== -1) {
				const start = Math.max(0, i - 30);
				const slice = hay.slice(start, i + t.length + 60);
				return (start > 0 ? "…" : "") + highlight(slice, terms) + (i + t.length + 60 < hay.length ? "…" : "");
			}
		}
		return highlight(hay.slice(0, 90), terms);
	}

	async function search() {
		const q = query.trim();
		if (!q) {
			results = [];
			return;
		}
		try {
			index ??= await (await fetch(withBase("/search-index.json"))).json();
			const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
			const hits = index
				.filter((doc) => terms.every((t) => doc.text.toLowerCase().includes(t)))
				.filter(
					(doc) =>
						filterState.year === "all" ||
						new Date(doc.published).getFullYear() === filterState.year,
				)
				.filter(
					(doc) =>
						filterState.tags.length === 0 ||
						filterState.tags.some((t) => doc.tags.includes(t)),
				)
				.sort((a, b) => {
					const d = new Date(a.published).getTime() - new Date(b.date).getTime();
					return filterState.sortBy === "newest" ? -d : d;
				})
				.slice(0, 10);
			results = hits.map((doc) => ({
				url: withBase(`/posts/${doc.slug}/`),
				title: highlight(doc.title, terms),
				excerpt: makeExcerpt(doc, terms),
			}));
		} catch (e) {
			console.error("搜索失败:", e);
			results = [];
		} finally {
			busy = false;
		}
	}
</script>

<div>
	<input
		bind:value={query}
		oninput={search}
		placeholder="搜索文章…"
		class="w-full rounded-xl border border-hairline bg-paper-muted px-4 py-2.5 outline-none transition-colors focus:border-accent"
		aria-label="搜索文章"
		autofocus
	/>
	{#if busy}
		<p class="mt-6 text-sm text-ink-tertiary">搜索中…</p>
	{:else if results.length === 0 && query.trim()}
		<p class="mt-6 text-sm text-ink-tertiary">没有匹配的结果</p>
	{:else}
		<ul class="mt-6 space-y-4">
			{#each results as r (r.url)}
				<li class="border-b border-hairline pb-3">
					<a href={r.url} class="text-lg font-medium transition-colors hover:text-accent">
						{@html r.title}
					</a>
					{#if r.excerpt}
						<p class="mt-1 text-sm text-ink-secondary">{@html r.excerpt}</p>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
