<script lang="ts">
	import Icon from "@iconify/svelte";
	import { themeState, toggleTheme } from "../lib/theme.svelte";
</script>

<button
	onclick={toggleTheme}
	class="fixed right-4 top-4 z-50 rounded-xl border border-hairline bg-paper/85 p-2 shadow-sm backdrop-blur-md transition-colors hover:bg-paper-muted"
	aria-label="切换明暗主题"
>
	<Icon
		icon={themeState.dark ? "material-symbols:light-mode-rounded" : "material-symbols:dark-mode-rounded"}
		class="size-5"
	/>
</button>
