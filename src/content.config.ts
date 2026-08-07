import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		published: z.coerce.date(),
		updated: z.coerce.date().optional(),
		description: z.string().default(""),
		tags: z.array(z.string()).default([]),
		category: z.string().default(""),
		draft: z.boolean().default(false),
	}),
});

export const collections = { posts };
