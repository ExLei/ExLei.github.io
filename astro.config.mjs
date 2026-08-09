import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import swup from "@swup/astro";
import { unified } from "@astrojs/markdown-remark";
import remarkDirective from "remark-directive";
import { defineConfig } from "astro/config";
import { admonition } from "./src/plugins/admonition.mjs";

// https://astro.build/config
export default defineConfig({
	site: "https://exlei.github.io/",
	base: "/",
	trailingSlash: "always",
	markdown: {
		processor: unified({ remarkPlugins: [remarkDirective, admonition] }),
	},
	integrations: [
		swup({
			theme: false,
			animationClass: "transition-main",
			containers: ["#swup"],
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
			smoothScrolling: false,
			resolveUrl: (url) => url,
			animateHistoryBrowsing: false,
		}),
		svelte(),
		sitemap(),
	],
	vite: {
		plugins: [tailwindcss()],
		server: {
			watch: {
				ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/.astro/**"],
			},
		},
	},
});
