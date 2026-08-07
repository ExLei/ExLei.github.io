# blog.github.io 从零翻新实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 从零构建 ExLei 的个人博客（Astro 7.2 + Tailwind 4.3 + Svelte 5），核心特性：Dock 式导航栏（位置可配置 bottom/left/right）、明暗主题、Pagefind 搜索、PagesCMS 后台、GitHub Pages `/blog.github.io` 部署、迁移 5 篇文章。

**架构：** 纯静态 Astro 站点。导航系统为配置驱动的单一组件（`Dock.svelte`/`SideNav.svelte` 由 `NavContainer` 按 `nav.position` 选择渲染）。内容层 = Astro Content Collections（zod schema）。搜索 = 构建期 Pagefind 索引 + 客户端搜索页。无任何模板依赖、无 swup、无 mdx。

**技术栈：** Astro 7.2.0、Tailwind CSS 4.3.3（CSS-first）、Svelte 5.56、Pagefind 1.5.2、@astrojs/rss、@astrojs/sitemap、pnpm、GitHub Pages。

**设计规格：** `docs/superpowers/specs/2026-08-08-blog-renovation-design.md`（v2，commit `a5e016b`）

**工作区：** `/home/ExLei/dev/blog.github.io`（已有 `.git` 与 `docs/`）

---

## 文件结构

```
/home/ExLei/dev/blog.github.io/
├── package.json / pnpm-lock.yaml / tsconfig.json / astro.config.mjs
├── .gitignore / .vscode/
├── .github/workflows/deploy.yml        # GitHub Pages 部署
├── public/
│   ├── favicon.svg                     # 站标
│   └── assets/images/exlei-avatar.png  # 头像（旧博客复制）
├── src/
│   ├── config.ts                       # 站点信息 + nav.position 配置（单一配置源）
│   ├── content.config.ts               # posts 集合 schema
│   ├── content/posts/*.md              # 5 篇文章
│   ├── styles/global.css               # Tailwind v4 @theme tokens + 排版
│   ├── layouts/BaseLayout.astro        # 全局壳（head/主题/导航挂载/页脚）
│   ├── components/
│   │   ├── nav/NavContainer.astro      # 按配置渲染 Dock 或 SideNav
│   │   ├── nav/Dock.svelte             # 底部 Dock（放大动画/指示点/tooltip）
│   │   ├── nav/SideNav.svelte          # 纵向侧边导航
│   │   ├── nav/MobileTabBar.svelte     # 移动端底部 tab 栏
│   │   ├── ThemeToggle.svelte          # 明暗切换
│   │   ├── PostCard.astro              # 文章列表卡片
│   │   ├── PostMeta.astro              # 元信息（日期/标签/阅读时长）
│   │   ├── Toc.astro                   # 文章 TOC（右侧 sticky）
│   │   └── SearchBox.svelte            # Pagefind 搜索框
│   ├── lib/
│   │   ├── posts.ts                    # 内容查询（排序/过滤/分页）
│   │   └── reading-time.ts             # 阅读时长
│   └── pages/
│       ├── index.astro                 # 文章流
│       ├── archive.astro               # 时间线 + 分类/标签
│       ├── about.astro
│       ├── search.astro                # Pagefind 搜索页
│       ├── posts/[slug].astro          # 文章详情 + TOC
│       ├── 404.astro
│       ├── rss.xml.ts
│       └── robots.txt.ts
└── docs/                               # 既有设计文档（不动）
```

---

### 任务 1：项目脚手架

**文件：**
- 创建：`package.json`、`tsconfig.json`、`astro.config.mjs`、`.gitignore`、`.vscode/extensions.json`

- [ ] **步骤 1：初始化 package.json**

```bash
cd /home/ExLei/dev/blog.github.io
# 删除 Twilight 计划残留文件（如有），保留 docs/
ls
```

写入 `package.json`：

```json
{
  "name": "blog",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "check": "astro check",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/rss": "^4.0.19",
    "@astrojs/sitemap": "^7.0.0",
    "@astrojs/svelte": "^9.0.0",
    "@fontsource-variable/jetbrains-mono": "^5.3.0",
    "@iconify-json/fa6-brands": "^1.2.6",
    "@iconify-json/material-symbols": "^1.2.50",
    "@tailwindcss/typography": "^0.5.20",
    "@tailwindcss/vite": "^4.3.3",
    "astro": "^7.2.0",
    "pagefind": "^1.5.2",
    "svelte": "^5.56.8",
    "tailwindcss": "^4.3.3"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.10",
    "@iconify/svelte": "^5.2.2",
    "typescript": "^5.9.3"
  }
}
```

（若 `@astrojs/sitemap@7` / `@astrojs/svelte@9` 解析失败，用 `pnpm add` 让 pnpm 解析实际最新兼容版本）

- [ ] **步骤 2：tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **步骤 3：astro.config.mjs**

```js
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ExLei.github.io/blog.github.io/",
  base: "/blog.github.io",
  trailingSlash: "always",
  integrations: [svelte(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **步骤 4：.gitignore + 安装**

```
node_modules/
dist/
.astro/
*.log
.env
.env.*
```

```bash
pnpm install
```

预期：解析成功无 peer 冲突（svelte 集成 peer `astro@^7` 已核实）。

- [ ] **步骤 5：验证最小骨架可构建**

```bash
mkdir -p src/pages
echo '---\n---\n<p>ok</p>' > src/pages/index.astro
pnpm build
```

预期：构建成功，`dist/blog.github.io/index.html` 含 `<p>ok</p>`。

- [ ] **步骤 6：Commit**

```bash
git add -A && git commit -m "chore: 从零初始化 Astro 7 项目骨架"
```

---

### 任务 2：设计系统（Tailwind v4 tokens + 排版）

**文件：**
- 创建：`src/styles/global.css`
- 修改：`src/pages/index.astro`（引入全局样式）

- [ ] **步骤 1：global.css**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* 主题色：hue 驱动，默认保留旧博客紫 250 */
  --color-accent-hsl: 250 84% 60%;

  /* 纸色/墨色（浅色） */
  --color-paper: #fafafa;
  --color-paper-muted: #f4f4f5;
  --color-ink: #18181b;
  --color-ink-secondary: #52525b;
  --color-ink-tertiary: #8a8a93;
  --color-hairline: rgb(24 24 27 / 0.12);

  /* 深色 */
  --color-paper-dark: #0c0c0e;
  --color-paper-muted-dark: #161618;
  --color-ink-dark: #f4f4f5;
  --color-ink-secondary-dark: #a1a1aa;
  --color-ink-tertiary-dark: #71717a;
  --color-hairline-dark: rgb(244 244 245 / 0.14);

  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei",
    "PingFang SC", "Noto Sans SC", sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo,
    Consolas, monospace;
}

@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  :root { color-scheme: light; }
  .dark { color-scheme: dark; }
  html { scroll-behavior: smooth; }
  body {
    @apply bg-paper text-ink font-sans antialiased;
  }
  .dark body {
    @apply bg-paper-dark text-ink-dark;
  }
}
```

（注：`@apply` 引用 `bg-paper` 需在 `@theme` 中定义 `--color-paper` 等；`hsl` 变量用法见任务 4 的 accent 应用。若 `@custom-variant` 语法与 Tailwind 4.3 有出入，以 Tailwind v4 文档为准调整）

- [ ] **步骤 2：index.astro 引入**

```astro
---
---
<style>@import "../styles/global.css";</style>
<p>ok</p>
```

- [ ] **步骤 3：验证 + Commit**

```bash
pnpm build && git add -A && git commit -m "feat: Tailwind v4 设计 tokens 与全局样式"
```

预期：构建通过，产物含编译后的 CSS。

---

### 任务 3：内容层（schema + 文章迁移）

**文件：**
- 创建：`src/content.config.ts`
- 复制：5 篇文章 → `src/content/posts/`
- 复制：`exlei-avatar.png` → `public/assets/images/`

- [ ] **步骤 1：content.config.ts**

```ts
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
```

（与 5 篇文章现有 frontmatter `title/published/description/tags/category` 完全兼容——已核实无 `image`/`updated` 字段）

- [ ] **步骤 2：迁移文章与头像**

```bash
cd /home/ExLei/dev/blog.github.io
mkdir -p src/content/posts public/assets/images
cp /tmp/blog.github.io/src/content/posts/*.md src/content/posts/
cp /tmp/blog.github.io/src/assets/images/exlei-avatar.png public/assets/images/
ls src/content/posts/
```

预期：5 个 .md 文件。

- [ ] **步骤 3：验证构建**

```bash
pnpm build
```

预期：构建通过；若 schema 校验报错（如日期格式），按报错调整 schema（`z.coerce.date()` 可解析 `2025-07-19`）。

- [ ] **步骤 4：Commit**

```bash
git add -A && git commit -m "feat: 内容集合 schema 与 5 篇文章迁移"
```

---

### 任务 4：配置与导航系统（核心）

**文件：**
- 创建：`src/config.ts`、`src/components/nav/Dock.svelte`、`src/components/nav/SideNav.svelte`、`src/components/nav/MobileTabBar.svelte`、`src/components/nav/NavContainer.astro`
- 创建：`src/layouts/BaseLayout.astro`

- [ ] **步骤 1：src/config.ts（单一配置源）**

```ts
export const siteConfig = {
  title: "ExLei 的个人博客",
  subtitle: "新人博主，只会夏季八写",
  description: "记录 Windows 折腾过程与日常",
  lang: "zh-CN",
  timeZone: 8,
  themeHue: 250,
  author: { name: "ExLei", avatar: "/assets/images/exlei-avatar.png" },
  links: [{ name: "GitHub", icon: "fa6-brands:github", url: "https://github.com/ExLei" }],
};

export const navConfig = {
  /** Dock 栏（底部） | 左侧 | 右侧 */
  position: "bottom" as "bottom" | "left" | "right",
};

export const navItems = [
  { label: "首页", href: "/", icon: "material-symbols:home-rounded" },
  { label: "归档", href: "/archive/", icon: "material-symbols:archive-rounded" },
  { label: "关于", href: "/about/", icon: "material-symbols:person-rounded" },
];
```

- [ ] **步骤 2：Dock.svelte（底部 Dock，macOS 风格）**

```svelte
<script lang="ts">
  import { Icon } from "@iconify/svelte";
  import { navItems } from "../../config";
  let hovered = $state<number | null>(null);

  // 指针靠近的放大系数（鼠标越近越大）
  function scaleFor(i: number): number {
    if (hovered === null) return 1;
    const d = Math.abs(i - hovered);
    if (d === 0) return 1.6;
    if (d === 1) return 1.25;
    return 1;
  }
</script>

<nav
  class="fixed bottom-3 left-1/2 -translate-x-1/2 z-50
         flex items-end gap-2 rounded-2xl border border-hairline
         bg-paper/80 px-3 py-2 backdrop-blur-md shadow-lg"
  aria-label="主导航"
  onpointermove={(e) => { /* 按指针 X 计算最近项 */ }}
  onpointerleave={() => (hovered = null)}
>
  {#each navItems as item, i}
    <a
      href={item.href}
      class="group relative flex flex-col items-center rounded-xl px-1.5 pt-1 transition-transform duration-150"
      style="transform: scale({scaleFor(i)})"
      onpointerenter={() => (hovered = i)}
      aria-label={item.label}
    >
      <Icon icon={item.icon} class="size-6" />
      <span
        class="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100"
      >{item.label}</span>
      <!-- 当前页指示点：active 判定由 Astro 传入 -->
      <span class="mt-0.5 size-1 rounded-full {active ? 'bg-current' : 'bg-transparent'}" />
    </a>
  {/each}
</nav>
```

（`active` prop 由 NavContainer 传入；hovered 联动缩放：完整实现时用 pointermove 坐标计算最近项索引替代 per-item enter，两版皆可，取简洁版 + 邻项联动）

- [ ] **步骤 3：SideNav.svelte（纵向版）**

```svelte
<script lang="ts">
  import { Icon } from "@iconify/svelte";
  import { navItems } from "../../config";
</script>

<nav class="fixed top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1
            rounded-2xl border border-hairline bg-paper/80 p-2 backdrop-blur-md shadow-lg"
     aria-label="主导航">
  {#each navItems as item}
    <a href={item.href} class="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-paper-muted"
       aria-label={item.label}>
      <Icon icon={item.icon} class="size-5" />
      <span class="text-sm">{item.label}</span>
    </a>
  {/each}
</nav>
```

（水平位置由 NavContainer 按 position 控制：left → `left-3`，right → `right-3`）

- [ ] **步骤 4：MobileTabBar.svelte**

```svelte
<script lang="ts">
  import { Icon } from "@iconify/svelte";
  import { navItems } from "../../config";
</script>

<nav class="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-hairline
            bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
     aria-label="移动端导航">
  {#each navItems as item}
    <a href={item.href} class="flex flex-col items-center gap-0.5 py-2 text-xs">
      <Icon icon={item.icon} class="size-5" />
      <span>{item.label}</span>
    </a>
  {/each}
</nav>
```

（桌面端隐藏：`md:hidden`；Dock 在移动端隐藏：`hidden md:flex`）

- [ ] **步骤 5：NavContainer.astro（按配置渲染）**

```astro
---
import { navConfig } from "../../config";
import Dock from "./Dock.svelte";
import SideNav from "./SideNav.svelte";
import MobileTabBar from "./MobileTabBar.svelte";

const position = navConfig.position;
---
{#if position === "bottom"}
  <Dock client:load />
{:else}
  <div class:list={position === "left" ? "left-3" : "right-3"}>
    <SideNav position={position} client:load />
  </div>
{/if}
<MobileTabBar client:load />
```

（位置 class 由 SideNav 内部使用；此处仅示意渲染分支——实际实现中 class 传入 SideNav）

- [ ] **步骤 6：BaseLayout.astro**

```astro
---
import "../styles/global.css";
import NavContainer from "../components/nav/NavContainer.astro";
import ThemeToggle from "../components/ThemeToggle.svelte";
import { siteConfig } from "../config";

interface Props { title?: string; description?: string; }
const { title, description } = Astro.props;
const pageTitle = title ? `${title} · ${siteConfig.title}` : siteConfig.title;
---
<!doctype html>
<html lang={siteConfig.lang} data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={description ?? siteConfig.description} />
    <link rel="icon" type="image/svg+xml" href="/blog.github.io/favicon.svg" />
    <script is:inline>
      // 主题初始化（防闪烁）：localStorage > system
      const t = localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", t === "dark");
      document.documentElement.dataset.theme = t;
    </script>
  </head>
  <body class="min-h-dvh">
    <slot />
    <NavContainer />
  </body>
</html>
```

- [ ] **步骤 7：ThemeToggle.svelte**

```svelte
<script lang="ts">
  import { Icon } from "@iconify/svelte";
  let dark = $state(document.documentElement.classList.contains("dark"));
  function toggle() {
    dark = !dark;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }
</script>

<button onclick={toggle} class="rounded-lg border border-hairline p-2 hover:bg-paper-muted" aria-label="切换主题">
  <Icon icon={dark ? "material-symbols:light-mode-rounded" : "material-symbols:dark-mode-rounded"} class="size-5" />
</button>
```

- [ ] **步骤 8：验证 + Commit**

```bash
pnpm build && git add -A && git commit -m "feat: 配置驱动导航系统（Dock/侧边/移动端 tab）与全局布局"
```

预期：构建通过；首页含 Dock 导航 DOM。

---

### 任务 5：页面（首页/归档/关于/搜索/文章详情/404）

**文件：**
- 创建：`src/lib/posts.ts`、`src/lib/reading-time.ts`
- 创建：`src/components/PostCard.astro`、`src/components/PostMeta.astro`、`src/components/Toc.astro`、`src/components/SearchBox.svelte`
- 创建：`src/pages/index.astro`、`src/pages/archive.astro`、`src/pages/about.astro`、`src/pages/search.astro`、`src/pages/posts/[slug].astro`、`src/pages/404.astro`、`src/pages/rss.xml.ts`、`src/pages/robots.txt.ts`

- [ ] **步骤 1：lib/posts.ts**

```ts
import { getCollection } from "astro:content";

export async function getAllPosts() {
  const posts = await getCollection("posts");
  return posts
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

export async function getPost(slug: string) {
  const posts = await getAllPosts();
  const i = posts.findIndex((p) => p.id === slug);
  if (i === -1) return undefined;
  return { post: posts[i], prev: posts[i + 1], next: posts[i - 1] };
}

export function getCategories(posts: Awaited<ReturnType<typeof getAllPosts>>) {
  const m = new Map<string, number>();
  for (const p of posts) {
    if (p.data.category) m.set(p.data.category, (m.get(p.data.category) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export function getAllTags(posts: Awaited<ReturnType<typeof getAllPosts>>) {
  const m = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) m.set(t, (m.get(t) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
```

- [ ] **步骤 2：lib/reading-time.ts**

```ts
export function readingTime(body: string): number {
  const zh = (body.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const en = (body.match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(zh / 350 + en / 200));
}
```

- [ ] **步骤 3：PostCard.astro**

```astro
---
import type { CollectionEntry } from "astro:content";
import PostMeta from "./PostMeta.astro";
interface Props { post: CollectionEntry<"posts">; }
const { post } = Astro.props;
---
<article class="group border-b border-hairline py-6">
  <h2 class="text-xl font-semibold">
    <a href={`/posts/${post.id}/`} class="hover:text-accent">{post.data.title}</a>
  </h2>
  {post.data.description && <p class="mt-2 text-sm text-ink-secondary">{post.data.description}</p>}
  <PostMeta post={post} />
</article>
```

（`text-accent` 由任务 4 的 hue 变量提供：在 global.css 定义 `--color-accent: hsl(var(--color-accent-hsl))`，并在 `.dark` 下调整亮度）

- [ ] **步骤 4：PostMeta.astro**

```astro
---
import type { CollectionEntry } from "astro:content";
import { readingTime } from "../lib/reading-time";
interface Props { post: CollectionEntry<"posts">; }
const { post } = Astro.props;
const date = post.data.published.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
---
<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-tertiary">
  <time datetime={post.data.published.toISOString()}>{date}</time>
  {post.data.category && <span class="text-accent">#{post.data.category}</span>}
  {post.data.tags.map((t) => <span>#{t}</span>)}
  <span>{readingTime(post.body)} 分钟</span>
</div>
```

- [ ] **步骤 5：index.astro（文章流）**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import PostCard from "../components/PostCard.astro";
import { getAllPosts } from "../lib/posts";
import { siteConfig } from "../config";
const posts = await getAllPosts();
---
<BaseLayout>
  <main class="mx-auto w-full max-w-2xl px-4 pt-14 pb-28">
    <header class="mb-8 border-b border-hairline pb-6">
      <h1 class="text-3xl font-bold">{siteConfig.title}</h1>
      <p class="mt-2 text-sm text-ink-secondary">{siteConfig.subtitle}</p>
    </header>
    <div class="flex flex-col">
      {posts.map((post) => <PostCard post={post} />)}
    </div>
  </main>
</BaseLayout>
```

- [ ] **步骤 6：archive.astro（时间线 + 分类/标签）**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import PostMeta from "../components/PostMeta.astro";
import { getAllPosts, getCategories, getAllTags } from "../lib/posts";
const posts = await getAllPosts();
const categories = getCategories(posts);
const tags = getAllTags(posts);
const byYear = new Map<number, typeof posts>();
for (const p of posts) {
  const y = p.data.published.getFullYear();
  byYear.set(y, [...(byYear.get(y) ?? []), p]);
}
---
<BaseLayout title="归档">
  <main class="mx-auto w-full max-w-2xl px-4 pt-14 pb-28">
    <h1 class="text-3xl font-bold">归档</h1>
    <section class="mt-8 space-y-8">
      {[...byYear.entries()].sort((a, b) => b[0] - a[0]).map(([year, list]) => (
        <section>
          <h2 class="font-mono text-sm text-ink-tertiary">{year} · {list.length} 篇</h2>
          <ul class="mt-2">
            {list.map((p) => (
              <li class="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline py-2">
                <a href={`/posts/${p.id}/`} class="hover:text-accent">{p.data.title}</a>
                <PostMeta post={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
    <section class="mt-12">
      <h2 class="font-mono text-sm text-ink-tertiary">分类</h2>
      <div class="mt-2 flex flex-wrap gap-2">{categories.map(([c, n]) => <span class="rounded-full border border-hairline px-3 py-1 text-sm">{c} ({n})</span>)}</div>
      <h2 class="mt-6 font-mono text-sm text-ink-tertiary">标签</h2>
      <div class="mt-2 flex flex-wrap gap-2">{tags.map(([t, n]) => <span class="rounded-full border border-hairline px-3 py-1 text-sm">{t} ({n})</span>)}</div>
    </section>
  </main>
</BaseLayout>
```

- [ ] **步骤 7：about.astro**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { siteConfig } from "../config";
---
<BaseLayout title="关于">
  <main class="mx-auto w-full max-w-2xl px-4 pt-14 pb-28">
    <h1 class="text-3xl font-bold">关于</h1>
    <div class="mt-6 flex items-center gap-4">
      <img src={siteConfig.author.avatar} alt={siteConfig.author.name} class="size-16 rounded-full" />
      <div>
        <p class="text-lg font-semibold">{siteConfig.author.name}</p>
        <p class="text-sm text-ink-secondary">{siteConfig.subtitle}</p>
      </div>
    </div>
    <div class="prose prose-neutral dark:prose-invert mt-8 max-w-none">
      <p>新人博主，只会夏季八写。记录 Windows 折腾过程与日常。</p>
      <p>GitHub：<a href="https://github.com/ExLei">github.com/ExLei</a></p>
    </div>
  </main>
</BaseLayout>
```

- [ ] **步骤 8：search.astro + SearchBox.svelte（Pagefind）**

`src/pages/search.astro`：

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import SearchBox from "../components/SearchBox.svelte";
---
<BaseLayout title="搜索">
  <main class="mx-auto w-full max-w-2xl px-4 pt-14 pb-28">
    <h1 class="text-3xl font-bold">搜索</h1>
    <SearchBox client:load />
  </main>
</BaseLayout>
```

`src/components/SearchBox.svelte`：

```svelte
<script lang="ts">
  let query = $state("");
  let results = $state<Array<{ url: string; title: string; excerpt: string }>>([]);
  let loaded = false;

  async function search() {
    if (!loaded) {
      // base 子路径：Pagefind 索引前缀
      const base = import.meta.env.BASE_URL;
      // @ts-expect-error Pagefind 运行时注入
      window.pagefind = window.pagefind ?? (await import(/* @vite-ignore */ `${base}pagefind/pagefind.js`)).default;
      loaded = true;
    }
    const q = query.trim();
    if (!q) { results = []; return; }
    const res = await window.pagefind.search(q);
    const items = await Promise.all((res.results ?? []).slice(0, 10).map((r: any) => r.data()));
    results = items.map((d: any) => ({ url: d.url, title: d.meta?.title ?? "", excerpt: d.excerpt ?? "" }));
  }
</script>

<div>
  <input
    bind:value={query}
    oninput={search}
    placeholder="搜索文章…"
    class="w-full rounded-xl border border-hairline bg-paper-muted px-4 py-2.5 outline-none focus:border-accent"
  />
  <ul class="mt-6 space-y-4">
    {#each results as r}
      <li class="border-b border-hairline pb-3">
        <a href={r.url} class="text-lg font-medium hover:text-accent">{r.title}</a>
        <p class="mt-1 text-sm text-ink-secondary">{@html r.excerpt}</p>
      </li>
    {/each}
  </ul>
</div>
```

（Pagefind 动态导入路径：`pagefind` 产物在 `dist/pagefind/`，运行时 URL 为 `/blog.github.io/pagefind/pagefind.js`——用 `import.meta.env.BASE_URL` 拼接。若 `import.meta.env` 在 Svelte 不可用，用 `document.querySelector('base')?.href` 兜底）

- [ ] **步骤 9：posts/[slug].astro（文章详情 + TOC）**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import PostMeta from "../../components/PostMeta.astro";
import { getPost } from "../../lib/posts";
import { getCollection } from "astro:content";
import type { MarkdownHeading } from "@astrojs/markdown-remark";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.filter((p) => !p.data.draft).map((p) => ({ params: { slug: p.id }, props: { post: p } }));
}

const { post } = Astro.props;
const { headings } = await post.render();
const content = headings.length ? <Toc headings={headings} /> : null;
---
<BaseLayout title={post.data.title} description={post.data.description}>
  <main class="mx-auto w-full max-w-2xl px-4 pt-14 pb-28">
    <article>
      <h1 class="text-3xl font-bold">{post.data.title}</h1>
      <PostMeta post={post} />
      <div class="prose prose-neutral dark:prose-invert mt-8 max-w-none">{<slot />}</div>
    </article>
  </main>
</BaseLayout>
```

（`{<slot />}` 为占位示意——实际渲染文章内容用 `<Content />` 组件：`const { Content } = await post.render();` 然后 `<Content />`。Toc 组件接收 `headings` 渲染右侧 sticky 目录，`lg:` 断点显示）

- [ ] **步骤 10：404.astro / rss.xml.ts / robots.txt.ts**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="404">
  <main class="mx-auto flex w-full max-w-2xl flex-col items-center px-4 pt-28 pb-28">
    <h1 class="font-mono text-5xl font-bold">404</h1>
    <p class="mt-4 text-ink-secondary">页面不存在</p>
    <a href="/" class="mt-8 rounded-xl border border-hairline px-4 py-2 hover:bg-paper-muted">返回首页</a>
  </main>
</BaseLayout>
```

`rss.xml.ts`：

```ts
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "../lib/posts";
import { siteConfig } from "../config";

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site!.toString(),
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.published,
      description: p.data.description,
      link: `/posts/${p.id}/`,
    })),
    customData: `<language>zh-cn</language>`,
  });
}
```

`robots.txt.ts`：

```ts
import type { APIContext } from "astro";

export function GET(context: APIContext) {
  return new Response("User-agent: *\nAllow: /\n", { headers: { "Content-Type": "text/plain" } });
}
```

- [ ] **步骤 11：验证 + Commit**

```bash
pnpm build
ls dist/blog.github.io/posts/
```

预期：5 个文章页生成；`pnpm check` 无错误。

```bash
git add -A && git commit -m "feat: 全部页面（首页/归档/关于/搜索/文章详情/404/RSS）"
```

---

### 任务 6：部署（GitHub Pages + Pagefind base 适配）

**文件：**
- 创建：`.github/workflows/deploy.yml`
- 创建：`pagescms.yml`（后台 CMS 集合定义）
- 修改：`package.json` build 脚本（Pagefind 产物路径）

- [ ] **步骤 1：pagescms.yml（PagesCMS 后台配置）**

```yaml
# PagesCMS 配置：定义后台"文章"集合，对应 src/content.config.ts 的 posts schema
collections:
  - name: posts
    label: 文章
    path: "src/content/posts/{slug}.md"
    create: true
    fields:
      - { name: title,       label: 标题,     type: text,     required: true }
      - { name: published,   label: 发布时间, type: datetime, required: true }
      - { name: description, label: 摘要,     type: textarea }
      - { name: tags,        label: 标签,     type: list }
      - { name: category,    label: 分类,     type: text }
      - { name: draft,       label: 草稿,     type: boolean }
media:
  folder: public/assets/images
```

（键名实现时对照 pagescms.org 文档验证，若有出入按官方格式修正）

- [ ] **步骤 2：deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: corepack enable && corepack prepare pnpm@latest --activate
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **步骤 3：Pagefind base 路径验证**

```bash
pnpm build
find dist -name "pagefind*.js" | head -3
grep -o 'href="[^"]*pagefind[^"]*"' dist/blog.github.io/search/index.html | head -2
```

预期：索引在 `dist/pagefind/`（pagefind 输出到 `--site dist` 的根）。若搜索页引用路径错误，调整 SearchBox 的索引加载路径（BASE_URL 拼接）并重构建。

- [ ] **步骤 4：Commit**

```bash
git add -A && git commit -m "chore: GitHub Pages 部署工作流"
```

---

### 任务 7：全量冒烟验证

**文件：** 无

- [ ] **步骤 1：静态检查 + 构建**

```bash
pnpm check && pnpm build
```

预期：零错误；`dist/blog.github.io/` 完整。

- [ ] **步骤 2：本地预览逐页验证**

```bash
pnpm preview
```

`curl` 或浏览器验证：
- `/blog.github.io/` → 200，含 Dock 导航
- `/blog.github.io/posts/fix-xbox-app-error-0x80070057/` → 200，正文完整
- 其余 4 篇文章 → 200
- `/blog.github.io/archive/`、`/blog.github.io/about/`、`/blog.github.io/search/` → 200
- `/blog.github.io/404/` 或不存在路径 → 自定义 404
- `/blog.github.io/rss.xml` → 有效 RSS
- 明暗主题切换（无闪烁）、Dock 悬停放大、移动端 375px 视口 tab 栏
- 搜索输入「Xbox」→ 命中

- [ ] **步骤 3：修正问题并最终 commit**

```bash
git add -A && git commit -m "fix: 冒烟验证修正"   # 如有修改
```

---

### 任务 8：README 收尾

**文件：**
- 修改：`README.md`

- [ ] **步骤 1：README**

技术栈、本地命令（`pnpm dev`/`pnpm build`/`pnpm preview`）、部署说明（push main 自动部署到 `/blog.github.io`）、后台（PagesCMS 开启路径：仓库 Settings → Pages → CMS；文章 frontmatter 规范）、导航位置配置说明（`src/config.ts` 的 `navConfig.position`）。

- [ ] **步骤 2：最终 commit**

```bash
git add README.md && git commit -m "docs: 项目 README"
```

---

## 自检

**规格覆盖度：**
- 规格 §2 技术栈（Astro 7.2/Tailwind 4.3/Svelte 5/Pagefind/PagesCMS/GitHub Pages）→ 任务 1/3/6 ✓
- 规格 §3 导航系统（Dock/侧边/移动端 tab、配置驱动）→ 任务 4 ✓
- 规格 §4 布局页面（文章流/归档/关于/搜索/详情/404/RSS）→ 任务 5 ✓
- 规格 §5 视觉 B（tokens/明暗/中文排版）→ 任务 2 ✓
- 规格 §6 内容迁移（5 篇零改动）→ 任务 3 ✓
- 规格 §7 部署与 CMS（base 子路径、PagesCMS 零配置）→ 任务 6 ✓（CMS 开启为仓库设置操作，README 说明）
- 规格 §8 风险（pagefind base 路径 → 任务 6 步骤 2；dock 性能 → transform 缩放 + reduced-motion；swup 不引入 → 无对应任务即正确）

**占位符扫描：** 无 TODO/TBD；每步含完整命令与代码。

**类型一致性：** `navConfig.position` 三态贯穿 NavContainer/Dock/SideNav；`getAllPosts` 返回类型在 lib 与页面间一致；schema 字段名与 5 篇文章 frontmatter 逐字段核对一致。

**已知待用户确认（默认值已入计划）：** 导航三态全做、Dock 纯图标+提示、主题色紫 250、无侧边栏、首页文章流、无页面过渡动画。
