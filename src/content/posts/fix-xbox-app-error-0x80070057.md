---
title: "修复Xbox应用无法打开 错误代码-0x80070057"
published: 2025-07-19
description: "Xbox 应用打不开，错误 0x80070057？用官方的 Gaming Services 修复工具解决。"
---

翻阅 Xbox 支持网站

https://support.xbox.com/zh-CN/help/games-apps/troubleshooting/troubleshoot-games-windows-10

发现 Xbox 提供了运行游戏服务修复工具 gaming-services-repair-tool

https://support.xbox.com/zh-CN/help/games-apps/troubleshooting/gaming-services-repair-tool

运行修复 GamingServices 服务，修复成功

:::warning
注意！运行修复工具过程中，GamingServices 服务将会在 `C:\Windows\System32` 创建目录，请确保此行为不会被防护软件拦截
:::

<img width="979" height="512" alt="Image" src="https://github.com/user-attachments/assets/d6f4035f-9ca4-4b48-89c2-74b58110db7c" />
