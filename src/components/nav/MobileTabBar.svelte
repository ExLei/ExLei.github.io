<script lang="ts">
	import Icon from "@iconify/svelte";
	import { navItems, withBase } from "../../config";

	let path = $state("");
	$effect(() => {
		const update = () => (path = location.pathname);
		update();
		document.addEventListener("swup:page:view", update);
		window.addEventListener("popstate", update);
		return () => {
			document.removeEventListener("swup:page:view", update);
			window.removeEventListener("popstate", update);
		};
	});
	let activePath = $derived(path.endsWith("/") ? path : path + "/");
</script>

<nav
	class="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-hairline bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
	aria-label="移动端导航"
>
	{#each navItems as item (item.href)}
		<a
			href={withBase(item.href)}
			class="flex flex-col items-center gap-0.5 px-3 py-2 text-xs"
			aria-label={item.label}
			aria-current={activePath === withBase(item.href) ? "page" : undefined}
		>
			<Icon
				icon={item.icon}
				class="size-5 {activePath === withBase(item.href) ? 'text-accent' : ''}"
			/>
			<span class={activePath === withBase(item.href) ? "text-accent" : "text-ink-secondary"}>
				{item.label}
			</span>
		</a>
	{/each}
</nav>
