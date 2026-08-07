# ExLei 的个人博客

基于 [Astro](https://astro.build) 的静态博客，部署于 GitHub Pages。记录 Windows 折腾过程与日常。

## 技术栈

- **Astro 7** + **Tailwind CSS 4**（CSS-first）+ **Svelte 5**
- 客户端全文搜索（构建期生成 JSON 索引）
- 明暗主题（跟随系统 + 手动切换）
- [PagesCMS](https://pagescms.org) 后台管理（零配置，GitHub 官方）

## 本地开发

```bash
bun install     # 安装依赖
bun run dev     # 开发服务器 http://localhost:4321
bun run build   # 生产构建到 dist/
bun run preview # 预览生产构建
bun run check   # 类型检查
```

## 目录结构

```
src/
├── config.ts              # 站点信息 + 导航位置配置（bottom/left/right）
├── content.config.ts      # 文章 schema（title/published/description/tags/category/draft）
├── content/posts/         # 文章（Markdown，frontmatter 见下）
├── layouts/BaseLayout.astro
├── components/
│   ├── nav/               # Dock（底部）/ SideNav（左右）/ MobileTabBar
│   ├── PostCard.astro / PostMeta.astro / Toc.astro
│   ├── SearchBox.svelte   # 搜索
│   └── ThemeToggle.svelte # 明暗切换
├── lib/                   # 内容查询 / 阅读时长
├── pages/                 # 首页 / 归档 / 关于 / 搜索 / 文章详情 / 404 / RSS
└── styles/global.css      # Tailwind v4 设计 tokens
```

## 文章 frontmatter

```yaml
---
title: 文章标题
published: 2025-07-19        # 必填，发布日期
description: 摘要             # 列表与搜索用
tags: [Windows, 修复]
category: 技术
draft: false                 # true 时不发布
---
```

新建文章：直接写 `src/content/posts/<slug>.md` 并推送，或使用后台管理（见下）。

## 导航位置配置

`src/config.ts` 中修改：

```ts
export const navConfig = {
  position: "bottom", // "bottom"（Dock 栏） | "left" | "right"
};
```

## 部署

push 到 `main` 分支自动触发 GitHub Actions 构建并部署到
`https://ExLei.github.io/blog.github.io/`。

## 后台管理（Pages CMS）

使用 [Pages CMS](https://pagescms.org)（开源免费，GitHub 官方 OAuth 登录，登录 GitHub 时自动走双因素验证）。

### 首次配置

1. 打开 **https://pagescms.org**，点击 **Login with GitHub**（GitHub OAuth，支持 2FA 动态验证码）
2. 添加网站：选择仓库 `ExLei/blog.github.io`（按提示安装 Pages CMS GitHub App 并授权该仓库）
3. 配置文件自动识别仓库根的 `.pages.yml`（文章集合 + 标题/日期/摘要/标签/分类/草稿/正文）

### 使用

- 后台入口：**https://pagescms.org**（登录后进入网站管理）
- 新建文章：填标题、日期，文件名即 slug（如 `fix-xbox-app-error-0x80070057`），富文本编辑正文
- 保存后自动 commit 到 `main` → GitHub Actions 自动部署上线
- 图片上传至 `public/assets/images/`，文章内引用自动带 `/blog.github.io` 前缀

> 配置源为仓库根 `.pages.yml`；字段与 `src/content.config.ts` 的 schema 对齐。

## 搜索

构建期生成 `search-index.json`（文章标题/摘要/标签/正文纯文本），搜索页客户端过滤并高亮命中词，无外部依赖。
