<script lang="ts">
	import Icon from "@iconify/svelte";

	let dark = $state(false);

	// $effect 仅在客户端运行（SSR 跳过），避免访问 document
	$effect(() => {
		dark = document.documentElement.classList.contains("dark");
	});

	function toggle() {
		dark = !dark;
		document.documentElement.classList.toggle("dark", dark);
		localStorage.setItem("theme", dark ? "dark" : "light");
	}
</script>

<button
	onclick={toggle}
	class="fixed right-4 top-4 z-50 rounded-xl border border-hairline bg-paper/85 p-2 shadow-sm backdrop-blur-md transition-colors hover:bg-paper-muted"
	aria-label="切换明暗主题"
>
	<Icon
		icon={dark ? "material-symbols:light-mode-rounded" : "material-symbols:dark-mode-rounded"}
		class="size-5"
	/>
</button>
