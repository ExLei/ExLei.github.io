# CONTEXT.md — 领域词汇表

单 context repo（Astro 7 静态博客，Svelte 5 岛屿 + satteri markdown 管线）。术语在代码与讨论中保持一致；新概念先在此登记。

## 核心概念

- **文章（Post）**：`CollectionEntry<"posts">`，`src/content/posts` 下的内容集合记录（frontmatter + body）。
- **文章索引记录（PostData）**：Post 的客户端/输出端投影，`toPostData` 是唯一映射（`src/lib/post-data.ts`）。字段：slug / title / description / published(ISO) / tags / category / readingMinutes。
- **搜索索引记录（SearchIndexEntry）**：PostData + 全文纯文本（`search-index.json` 输出形状）。
- **筛选条件（FilterCriteria）**：`{ sortBy: "newest" | "oldest", year: "all" | number, tags: string[] }`。语义 owner = `src/lib/filter.ts`（纯函数 applyFilters / activeFilterCount / groupByYear）；状态持有 = `src/lib/filter.svelte.ts`（filterState 模块单例）。标签为 OR 语义（命中任一即显示）。
- **页面注册表（pageRegistry）**：静态页面集合唯一数据源（`src/config.ts`）。导航项（navItems）、筛选 Dock 显隐（filterablePaths）、sitemap 静态页全部派生自它。
- **文章 URL**：`postUrl(slug)`（绝对路径，带 base）/ `relativePostUrl(slug)`（RSS 用，无前导斜杠）。trailingSlash: always。
- **邻居（prev / next）**：文章页上下篇。**prev = 更旧一篇，next = 更新一篇**（列表按发布日期降序，prev = i+1）。首尾篇对应侧为 undefined。纯函数 `withNeighbors`（`src/lib/post-data.ts`）。
- **大纲（Toc）**：文章标题列表 + scrollspy。variant: `"aside"`（桌面固定列）| `"collapsible"`（移动端 details）。同页可并存，`[data-toc]` 容器内联动高亮。
- **主题偏好（ThemePreference）**：`"dark" | "light"`，存储键 `THEME_STORAGE_KEY = "theme"`。`resolveTheme`（`src/lib/theme-logic.ts`）是决议逻辑的纯函数形式（单测钉住）；BaseLayout 的 is:inline 脚本为其镜像（FOUC 前提，无法 import），改动必须两边同步——镜像漂移无构建期信号，属人工同步风险。

## 惯例

- 纯逻辑放 plain TS（bun:test 可直测）；`.svelte.ts` 模块只持 `$state`，语义放同名纯模块。
- 客户端组件不得运行时 import `lib/posts.ts`（会拖入 astro:content）；类型用 `import type`，投影类型从 `lib/post-data.ts` 取。
