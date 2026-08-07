<script lang="ts">
	import { withBase } from "../config";
	import { filterState, type PostData } from "../lib/filter.svelte";

	let { posts }: { posts: PostData[] } = $props();

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
