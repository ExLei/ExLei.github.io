<script lang="ts">
	import { withBase } from "../config";
	import { filterState, type PostData } from "../lib/filter.svelte";

	let {
		posts,
		groupByYear = false,
	}: { posts: PostData[]; groupByYear?: boolean } = $props();

	const filtered = $derived.by(() => {
		let list = posts;
		if (filterState.year !== "all")
			list = list.filter((p) => new Date(p.published).getFullYear() === filterState.year);
		if (filterState.tags.length > 0)
			list = list.filter((p) => filterState.tags.some((t) => p.tags.includes(t)));
		return [...list].sort((a, b) => {
			const d = new Date(a.published).getTime() - new Date(b.published).getTime();
			return filterState.sortBy === "newest" ? -d : d;
		});
	});

	/* 归档页按年分组（与筛选联动） */
	const grouped = $derived.by(() => {
		const m = new Map<number, PostData[]>();
		for (const p of filtered) {
			const y = new Date(p.published).getFullYear();
			m.set(y, [...(m.get(y) ?? []), p]);
		}
		return [...m.entries()].sort((a, b) => b[0] - a[0]);
	});

	function fmt(iso: string): string {
		return new Date(iso).toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}
</script>

{#if filtered.length === 0}
	<p class="mt-10 text-sm text-ink-tertiary">没有匹配的文章</p>
{:else if groupByYear}
	{#each grouped as [year, list]}
		<section class="mt-8 space-y-8 first:mt-0">
			<h2 class="font-mono text-sm text-ink-tertiary">
				{year} · {list.length} 篇
			</h2>
			<ul class="mt-2">
				{#each list as p (p.slug)}
					<li class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline py-2">
						<a href={withBase(`/posts/${p.slug}/`)} class="transition-colors hover:text-accent">
							{p.title}
						</a>
						<time datetime={p.published} class="font-mono text-xs text-ink-tertiary">
							{fmt(p.published)}
						</time>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
{:else}
	<div class="flex flex-col">
		{#each filtered as p (p.slug)}
			<article class="border-b border-hairline py-6">
				<h2 class="text-xl font-semibold leading-snug">
					<a href={withBase(`/posts/${p.slug}/`)} class="transition-colors hover:text-accent">
						{p.title}
					</a>
				</h2>
				{#if p.description}
					<p class="mt-2 text-sm text-ink-secondary">{p.description}</p>
				{/if}
				<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-tertiary">
					<time datetime={p.published}>{fmt(p.published)}</time>
					{#if p.category}
						<span class="text-accent">#{p.category}</span>
					{/if}
					{#each p.tags as t}
						<span>#{t}</span>
					{/each}
					<span>{p.readingMinutes} 分钟阅读</span>
				</div>
			</article>
		{/each}
	</div>
{/if}
