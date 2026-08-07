import type { APIContext } from "astro";

export function GET(_context: APIContext) {
	return new Response("User-agent: *\nAllow: /\n", {
		headers: { "Content-Type": "text/plain" },
	});
}
