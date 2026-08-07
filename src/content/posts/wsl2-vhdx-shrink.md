---
title: "WSL2 磁盘瘦身：把 ext4.vhdx 压到 100 GB"
published: 2026-08-08
description: "WSL2 的 ext4.vhdx 只增不减，实测 230.6 GB 文件实际只用 55 GB。备份后把默认 VHD 大小改为 100 GB，注销再导入即可瘦身。"
tags: [WSL, Windows, 磁盘]
category: "技术"
draft: false
---

`ext4.vhdx` 是动态扩展盘，只增不减：删文件、清 Docker、清缓存，文件都不会变小。新装发行版默认上限 1 TB (1048576 MB)，迟早长满。本文实测：文件 230.6 GB，实际只用 55 GB。

做法：备份 → 改默认 VHD 大小 → 注销 → 重新导入，数据原样保留。

## 开始前

- Windows 11 + WSL2，管理员权限 PowerShell（开始菜单搜 PowerShell → 右键 → 以管理员身份运行）
- 磁盘剩余 ≥ 60 GB（放备份），全程约 20 分钟（导出 7 分钟、导入 5 分钟，都在等）

## 确认现状

```powershell
wsl.exe --system -d <发行版名> df -h /mnt/wslg/distro
dir "$env:LOCALAPPDATA\Packages" -Filter ext4.vhdx -Recurse
```

第一条是官方最新的磁盘检查命令（从系统发行版看目标发行版的虚拟盘）。若无效，先升级 WSL：

```powershell
wsl.exe --update
```

或用备用命令（在默认发行版里查看）：

```powershell
wsl df -h /
```

`<发行版名>` 换成你自己的。vhdx 一般在 `%LOCALAPPDATA%\Packages` 下，自己移动过就在自定义目录，如 `D:\Application\WSL\ext4.vhdx`。文件远大于已用空间才值得做，差不多的话这篇帮不上你，你的盘没膨胀。

## 1. 备份

```powershell
wsl --shutdown
wsl --export <发行版名> D:\backup.tar
```

导出后确认文件大小合理（应接近已用空间，本文 56 GB）。备份是安全网。

## 2. 改默认 VHD 大小

设置 → 应用 → WSL (或搜 "WSL Settings")，把默认 VHD 大小从 `1048576` 改成 `102400` MB（100 GB），保存。只影响新创建的发行版，不用重启。

## 3. 注销

```powershell
wsl --unregister <发行版名>
```

会删掉当前磁盘文件，确认备份已完成再做。看到"操作成功完成"即可。

## 4. 重新导入

```powershell
wsl --import <发行版名> <安装目录> D:\backup.tar
```

`<安装目录>` 放新 vhdx，如 `D:\Application\WSL`。导入约 5 分钟，完成后虚拟盘按 100 GB 建立，数据原样在里面。

## 验证

```powershell
wsl.exe --system -d <发行版名> df -h /mnt/wslg/distro
```

`Size` 应约 98 GB（100 GB 虚拟盘去掉文件系统开销），文件大小和之前一致就成功了：

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdd         98G   57G   37G  61% /mnt/wslg/distro
```

再确认系统正常：

```powershell
wsl.exe --distribution <发行版名> locale -a
```

应能看到你的语言，如 `zh_CN.utf8`。
