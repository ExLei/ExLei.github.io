# ExLei 的个人博客

基于 [Astro](https://astro.build) 的静态博客，部署于 GitHub Pages 根路径（https://exlei.github.io/）。记录 Windows 折腾过程与日常。

## 技术栈

- **Astro 7** + **Tailwind CSS 4**（CSS-first 设计 tokens）+ **Svelte 5**
- **SWUP** 无刷新页面过渡（Dock 导航等全局组件常驻）
- 客户端全文搜索（构建期生成 `search-index.json`，无外部依赖）
- 首页筛选：底部 Dock 风格筛选器（排序 / 时间范围 / 标签多选）
- 文章页目录（TOC）：sticky 跟随滚动 + scrollspy 高亮
- Sitemap 与 RSS 订阅（构建期生成）
- 明暗主题（跟随系统 + 手动切换）
- [Pages CMS](https://pagescms.org) 后台管理（GitHub OAuth 登录，零自建服务）

## 本地开发

```bash
bun install     # 安装依赖
bun run dev     # 开发服务器 http://localhost:4321
bun run build   # 生产构建到 dist/
bun run preview # 预览生产构建
bun run check   # 类型检查（astro check）
```

## 目录结构

```
src/
├── config.ts              # 站点信息、导航项、导航位置（bottom/left/right）
├── content.config.ts      # 文章 schema（见下）
├── content/posts/         # 文章（Markdown，frontmatter 见下）
├── layouts/
│   └── BaseLayout.astro   # 全局布局：head、SWUP 容器、footer（含 RSS 入口）
├── components/
│   ├── nav/
│   │   ├── NavContainer.astro  # 底部导航组容器（筛选 Dock + 主 Dock 并排）
│   │   ├── Dock.svelte         # 主 Dock（macOS 缩放指针效果）
│   │   ├── FilterDock.svelte   # 筛选 Dock（默认收起，弹出详细筛选面板）
│   │   ├── SideNav.svelte      # 左右侧导航（navConfig.position = left/right）
│   │   └── MobileTabBar.svelte # 移动端底部 Tab 栏
│   ├── PostCard.astro / PostMeta.astro / PostList.svelte
│   ├── Toc.astro           # 文章目录（sticky + scrollspy）
│   ├── FilterPanel.svelte  # 筛选面板（排序/时间/标签，数据自取）
│   ├── SearchBox.svelte    # 搜索框（实时过滤 + 高亮）
│   └── ThemeToggle.svelte  # 明暗切换
├── lib/
│   ├── posts.ts            # 文章查询（按发布时间排序、上下篇）
│   ├── reading-time.ts     # 阅读时长估算
│   └── filter.svelte.ts    # 筛选状态共享 store（跨 island）
├── pages/                  # 首页 / 归档 / 关于 / 搜索 / 文章详情 / 404
│   ├── rss.xml.ts          # RSS 订阅
│   ├── sitemap-index.xml   # 由 @astrojs/sitemap 生成
│   ├── robots.txt.ts       # robots.txt
│   └── search-index.json.ts # 搜索索引（构建期生成）
└── styles/global.css       # Tailwind v4 设计 tokens（纸白/墨黑/hairline/accent）
```

## 文章 frontmatter

`src/content/posts/<slug>.md`，schema 见 `src/content.config.ts`：

```yaml
---
title: 文章标题
published: 2025-07-19        # 必填，发布日期（yyyy-MM-dd）
description: 摘要             # 列表与搜索用
updated: 2025-08-01          # 可选，修订日期
tags: [Windows, 修复]        # 可选，多标签
category: 技术                # 可选
draft: false                 # true 时不发布
---
```

新建文章：直接写 `src/content/posts/<slug>.md` 并推送，或使用后台管理（见下）。

## 导航位置配置

`src/config.ts` 中修改：

```ts
export const navConfig = {
  position: "bottom", // "bottom"（Dock 栏，默认） | "left" | "right"
};
```

## 部署

push 到 `main` 分支自动触发 GitHub Actions（`.github/workflows/deploy.yml`，使用 bun 构建）并部署到 **https://exlei.github.io/**。

## 后台管理（Pages CMS）

使用 [Pages CMS](https://pagescms.org)（开源免费，GitHub OAuth 登录，支持 2FA 动态验证码，无需自建服务）。

### 首次配置

1. 打开 **https://pagescms.org**，点击 **Login with GitHub**
2. 添加网站：选择仓库 `ExLei/ExLei.github.io`（按提示安装 Pages CMS GitHub App 并授权该仓库）
3. 自动识别仓库根 `.pages.yml`（文章集合 + 标题/日期/摘要/分类/草稿/正文）

### 使用

- 后台入口：**https://pagescms.org**（登录后进入网站管理）
- 新建文章：填标题、日期，文件名即 slug（如 `fix-xbox-app-error-0x80070057`），富文本编辑正文
- 保存后自动 commit 到 `main` → GitHub Actions 自动部署上线
- 图片上传至 `public/assets/images/`，文章内引用为 `/assets/images/<文件名>`

> 配置源为仓库根 `.pages.yml`；字段与 `src/content.config.ts` 的 schema 对齐。

## 搜索与筛选

- **搜索**：构建期生成 `search-index.json`（标题/摘要/标签/正文纯文本），`/search/` 页客户端过滤并高亮命中词
- **筛选**：首页底部筛选 Dock（与主 Dock 并排），默认收起为图标按钮，点击弹出详细面板；支持排序（最新/最旧）、年份多选、标签多选（OR 语义）；有活动筛选时 Dock 图标显示 accent 指示点；移动端为文章列表上方的折叠面板

## RSS

订阅地址：**https://exlei.github.io/rss.xml**（每篇文章的链接均为绝对 URL）；所有页面底部 footer 均有入口，head 含 `<link rel="alternate" type="application/rss+xml">` 供阅读器自动发现。
