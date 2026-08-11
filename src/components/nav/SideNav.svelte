<script lang="ts">
	import Icon from "@iconify/svelte";
	import { navItems, withBase } from "../../config";
	import { getActivePath } from "../../lib/nav.svelte";

	let { position = "left" }: { position?: "left" | "right" } = $props();
</script>

<nav
	class:list={[
		"fixed top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border border-hairline bg-paper/85 p-2 shadow-lg backdrop-blur-md md:flex",
		position === "left" ? "left-3" : "right-3",
	]}
	aria-label="主导航"
>
	{#each navItems as item (item.href)}
		<a
			href={withBase(item.href)}
			class="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-paper-muted"
			aria-label={item.label}
			aria-current={getActivePath() === withBase(item.href) ? "page" : undefined}
		>
			<Icon icon={item.icon} class="size-5" />
			<span class="text-sm">
				{item.label}
			</span>
			{#if getActivePath() === withBase(item.href)}
				<span class="ml-1 size-1.5 rounded-full bg-accent"></span>
			{/if}
		</a>
	{/each}
</nav>
