<script lang="ts">
	import { filterState, type PostData } from "../lib/filter.svelte";

	let { posts }: { posts: PostData[] } = $props();

	const years = $derived(
		[...new Set(posts.map((p) => new Date(p.published).getFullYear()))].sort((a, b) => b - a),
	);
	const allTags = $derived([...new Set(posts.flatMap((p) => p.tags))].sort());
	const yearCounts = $derived(
		new Map(years.map((y) => [y, posts.filter((p) => new Date(p.published).getFullYear() === y).length])),
	);
	const tagCounts = $derived(
		new Map(allTags.map((t) => [t, posts.filter((p) => p.tags.includes(t)).length])),
	);

	function toggleTag(t: string) {
		filterState.tags = filterState.tags.includes(t)
			? filterState.tags.filter((x) => x !== t)
			: [...filterState.tags, t];
	}
</script>

<div class="flex flex-col gap-7 font-mono text-xs text-ink-tertiary">
	<div>
		<p class="uppercase tracking-wider">排序</p>
		<div class="mt-2 flex gap-2">
			<button
				onclick={() => (filterState.sortBy = "newest")}
				class="flex-1 rounded-lg border px-2.5 py-1.5 transition-all active:scale-95"
				class:border-accent={filterState.sortBy === "newest"}
				class:bg-accent={filterState.sortBy === "newest"}
				class:text-paper={filterState.sortBy === "newest"}
				class:shadow-sm={filterState.sortBy === "newest"}
				class:border-hairline={filterState.sortBy !== "newest"}
				class:hover:border-accent={filterState.sortBy !== "newest"}
				class:hover:text-accent={filterState.sortBy !== "newest"}
				aria-pressed={filterState.sortBy === "newest"}
			>
				最新
			</button>
			<button
				onclick={() => (filterState.sortBy = "oldest")}
				class="flex-1 rounded-lg border px-2.5 py-1.5 transition-all active:scale-95"
				class:border-accent={filterState.sortBy === "oldest"}
				class:bg-accent={filterState.sortBy === "oldest"}
				class:text-paper={filterState.sortBy === "oldest"}
				class:shadow-sm={filterState.sortBy === "oldest"}
				class:border-hairline={filterState.sortBy !== "oldest"}
				class:hover:border-accent={filterState.sortBy !== "oldest"}
				class:hover:text-accent={filterState.sortBy !== "oldest"}
				aria-pressed={filterState.sortBy === "oldest"}
			>
				最旧
			</button>
		</div>
	</div>

	<div>
		<p class="uppercase tracking-wider">时间</p>
		<ul class="mt-2 flex flex-col gap-0.5">
			<li>
				<button
					onclick={() => (filterState.year = "all")}
					class="flex w-full items-center justify-between rounded-lg px-2 py-2 transition-all active:scale-[0.97] hover:bg-paper-muted hover:text-accent"
					class:bg-paper-muted={filterState.year === "all"}
					class:font-semibold={filterState.year === "all"}
					class:text-accent={filterState.year === "all"}
					aria-pressed={filterState.year === "all"}
				>
					<span>全部</span><span>{posts.length}</span>
				</button>
			</li>
			{#each years as y}
				<li>
					<button
						onclick={() => (filterState.year = filterState.year === y ? "all" : y)}
						class="flex w-full items-center justify-between rounded-lg px-2 py-2 transition-all active:scale-[0.97] hover:bg-paper-muted hover:text-accent"
						class:bg-paper-muted={filterState.year === y}
						class:font-semibold={filterState.year === y}
						class:text-accent={filterState.year === y}
						aria-pressed={filterState.year === y}
					>
						<span>{y} 年</span><span>{yearCounts.get(y)}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>

	{#if allTags.length > 0}
		<div>
			<p class="uppercase tracking-wider">标签</p>
			<ul class="mt-2 flex flex-col gap-0.5">
				<li>
					<button
						onclick={() => (filterState.tags = [])}
						class="flex w-full items-center justify-between rounded-lg px-2 py-2 transition-all active:scale-[0.97] hover:bg-paper-muted hover:text-accent"
						class:bg-paper-muted={filterState.tags.length === 0}
						class:font-semibold={filterState.tags.length === 0}
						class:text-accent={filterState.tags.length === 0}
						aria-pressed={filterState.tags.length === 0}
					>
						<span>全部</span><span>{posts.length}</span>
					</button>
				</li>
				{#each allTags as t}
					<li>
						<button
							onclick={() => toggleTag(t)}
							class="flex w-full items-center justify-between rounded-lg px-2 py-2 transition-all active:scale-[0.97] hover:bg-paper-muted hover:text-accent"
							class:bg-paper-muted={filterState.tags.includes(t)}
							class:font-semibold={filterState.tags.includes(t)}
							class:text-accent={filterState.tags.includes(t)}
							aria-pressed={filterState.tags.includes(t)}
						>
							<span>{t}</span><span>{tagCounts.get(t)}</span>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
