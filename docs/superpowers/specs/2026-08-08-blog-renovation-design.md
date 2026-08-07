# blog.github.io 全面翻新设计 v2（从零开始）

> 日期：2026-08-08
> 状态：**草案 v2，待用户审查**（v1 的 Twilight 模板方案经用户要求打回，改为从零实现）
> 用户指令：视觉选 B（简洁路线）；不 fork Twilight，从零开始；核心新需求 = Dock 式导航栏（底部），导航位置可自定义（底/左/右）

## 1. 背景与目标

- 现状：`ExLei/blog.github.io` 基于 Fuwari 模板（Astro 7.1.6 + Tailwind v3.4 + Stylus），5 篇中文 Windows 折腾类文章，GitHub Pages 部署（`/blog.github.io` 子路径）。
- 诉求：
  1. 全面翻新（v2 明确：**从零开始**，不基于任何模板）；
  2. 依赖升级到最新（从零实现天然一步到位）；
  3. **Dock 栏导航**：导航栏置于底部（macOS Dock 风格），位置可配置（底部/左侧/右侧）；
  4. 后台管理（用户前期明确要求；v2 默认 PagesCMS 零配置，Decap 可选）。
- 参考：`Spr-Aachen/Twilight`（功能参考样板——后台管理、搜索、归档等能力参照，不 fork 代码）；`zerx-lab/zerx-lab-website`（视觉气质参考，编辑派极简）。

## 2. 技术栈（全部最新）

| 层 | 选型 | 版本依据（2026-08 实测） |
|---|---|---|
| 框架 | Astro | 7.2.0（最新；从零实现无 Twilight 的 CMS 集成约束，不再被限制在 6.x） |
| CSS | Tailwind CSS | 4.3.3（CSS-first，`@theme` tokens，无 postcss 旧链路） |
| 交互组件 | Svelte | 5.56.8（Dock 放大动画、明暗切换、搜索交互） |
| 搜索 | Pagefind | 1.5.2（构建期索引，客户端搜索） |
| CMS | PagesCMS（GitHub 原生，零配置） | Decap CMS 可选（需 GitHub OAuth App，文档化） |
| 图标 | Iconify（fa6/material-symbols） | 与旧博客图标集一致 |
| 部署 | GitHub Pages `/blog.github.io` + Actions | Twilight 同款 workflow（withastro/action）可用 |

包管理器 pnpm（本地 11.20 / Node 26 已验证）。

## 3. 导航系统（核心新需求）

配置驱动，`src/config.ts`：

```ts
export const navConfig = {
  position: "bottom", // "bottom" | "left" | "right"
  // bottom = Dock 栏（macOS 风格）；left/right = 纵向侧边导航
}
```

### 3.1 Dock 栏（bottom，默认）

- 底部居中停靠，图标式导航项（首页/归档/关于/GitHub）
- 悬停放大动画（指针靠近邻项联动放大，macOS 行为，Svelte 实现）
- 当前页指示点；工具提示（tooltip）
- 桌面端半透明毛玻璃背景（backdrop-blur）

### 3.2 侧边导航（left / right）

- 同一组件纵向渲染：图标列 + 当前项指示条
- 内容区自动让位（CSS grid 切换）

### 3.3 移动端

- 任意位置配置下，Dock 固定为底部 tab 栏（不放大、不遮挡），适配手势安全区

## 4. 布局与页面

| 页面 | 路由 | 说明 |
|---|---|---|
| 首页 | `/` | 最新文章流（卡片式列表，无封面则文字标签） |
| 归档 | `/archive/` | 时间线 + 分类/标签聚合 |
| 关于 | `/about/` | 个人介绍 |
| 搜索 | `/search/` | Pagefind 客户端搜索，命中高亮 |
| 文章详情 | `/posts/<slug>/` | 正文 + TOC（右侧，粘性）+ 标签/分类 + 上一篇/下一篇 |
| 404 | `/404/` | 自定义 |
| Feed | `/rss.xml` `/atom.xml` | RSS 2.0 + Atom |
| 其他 | `robots.txt`、`sitemap` | 自动 |

- 桌面布局：单内容列（max-width ~720px 阅读宽度）+ 文章页右侧 TOC；无常驻侧边栏（归档页承担分类浏览）
- 明暗主题：`prefers-color-scheme` + 手动切换按钮（localStorage 记忆），`.dark` class 驱动

## 5. 视觉（B 简洁路线）

- 无壁纸/粒子/音乐/看板娘/动效横幅
- 设计 tokens（`src/styles/global.css` @theme）：中性纸色/墨色 + 可配置主题色（默认保留旧博客紫色 hue 250）
- 字体：系统中文栈（`-apple-system, "Segoe UI", "Microsoft YaHei", sans-serif`）+ 等宽点缀（代码/元信息）；不引外部字体（国内网络友好）
- 圆角克制、hairline 分割线；正文排版（标题层级、代码块、表格、引用）精细调校

## 6. 内容与数据

- 5 篇文章原样迁移：frontmatter `title/published/description/tags/category` 与 Astro content collections schema 直接兼容（无 image 字段，已核实）
- `src/content/posts/*.md` + `src/content.config.ts`（zod schema）
- 关于页内容取自旧博客 `about.astro`
- 头像复用 `exlei-avatar.png`

## 7. 部署与 CMS

- GitHub Pages 项目页：`site: "https://ExLei.github.io/blog.github.io/"`、`base: "/blog.github.io"`，push main 自动构建部署（withastro/action + deploy-pages）
- PagesCMS：仓库 Settings → Pages → CMS 开启，零配置（无 OAuth）
- Decap 可选：文档写明 `.decap.yml` + OAuth App 配置步骤，需要时启用

## 8. 风险清单

| 风险 | 等级 | 缓解 |
|---|---|---|
| base 子路径下 Pagefind/swup 路径解析 | 高 | 构建期验证；Pagefind 索引路径拼 `import.meta.env.BASE_URL`；不引入 swup（页面过渡非必需，减少风险面） |
| Dock 悬停放大动画性能 | 中 | CSS transform 仅动画 scale/translate；`prefers-reduced-motion` 降级 |
| Svelte 5 与 Astro 7 集成 | 低 | `@astrojs/svelte@9` 官方支持 astro ^7（已核实 peer） |
| PagesCMS 功能限制（无嵌套/预览） | 低 | 写文章够用；需要时切 Decap |

## 9. 待确认项（默认值）

1. 导航三态 bottom/left/right —— **默认三态全做**（组件复用，成本低）
2. Dock 形态 —— **默认纯图标 + 工具提示**（macOS 风格）
3. 主题色 —— **默认保留紫色 hue 250**
4. 侧边栏 —— **默认不要**（归档页承担分类浏览）
5. 首页形态 —— **默认文章流**（无大 hero）
6. 页面过渡动画 —— **默认不做**（swup 不引入）
