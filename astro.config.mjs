import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";
import { defineConfig } from "astro/config";
import { admonition } from "./src/plugins/admonition.mjs";

// https://astro.build/config
export default defineConfig({
	site: "https://exlei.github.io/",
	base: "/",
	trailingSlash: "always",
	markdown: {
		processor: satteri({
			features: { directive: true },
			mdastPlugins: [admonition],
		}),
	},
	integrations: [svelte()],
	vite: {
		plugins: [tailwindcss()],
		server: {
			watch: {
				ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/.astro/**"],
			},
		},
	},
});
