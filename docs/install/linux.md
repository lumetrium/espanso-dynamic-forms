---
outline: [1, 4]
---

# Install on Linux

Espanso Dynamic Forms offers two installation methods for Linux. Choose one that best fits your distribution.

| Method | Best For | Pros |
|--------|----------|------|
| `.deb` package | Debian, Ubuntu, Linux Mint, Pop!_OS | System integration, automatic updates via apt |
| `.AppImage` | Any Linux distribution | Universal, no installation required, portable |


## Option 1: Using a .deb Package

This method is recommended for Debian-based distributions. This package installs the executable to `/usr/bin/edf`.

### Download

Open a terminal and run:

```bash
wget https://github.com/lumetrium/espanso-dynamic-forms/releases/latest/download/Espanso-Dynamic-Forms-Linux.deb
```

> [!TIP] Need a specific version?
> Visit the [Releases page](https://github.com/lumetrium/espanso-dynamic-forms/releases) on GitHub to download older versions.

### Install

Run this command to install:

```bash
sudo apt install ./Espanso-Dynamic-Forms-Linux.deb
```

### Verify Installation

Confirm installation succeeded:

```bash
which edf
```

This should output `/usr/bin/edf`. If you see this path, you're ready to continue.

## Option 2: Using an AppImage

AppImages are portable executables that work on most Linux distributions without installation.

### Download

Open a terminal and run:

```bash
wget https://github.com/lumetrium/espanso-dynamic-forms/releases/latest/download/Espanso-Dynamic-Forms-Linux.AppImage
```

### Make It Executable

Before you can run this AppImage, you need to make it executable:

```bash
chmod +x Espanso-Dynamic-Forms-Linux.AppImage
```

### Run

You can now run it directly:

```bash
./Espanso-Dynamic-Forms-Linux.AppImage --help
```

> [!Note] Optional: Move to a Permanent Location
> For easier access, move your AppImage to a location in your PATH:
> ```bash
> mkdir -p ~/.local/bin
> mv Espanso-Dynamic-Forms-Linux.AppImage ~/.local/bin/edf
> ```
> Make sure `~/.local/bin` is in your PATH. You can then reference `edf` in your Espanso triggers.

## What's Next?

Espanso Dynamic Forms does **not** start automatically. It is designed to be launched by Espanso triggers.
Follow the [Getting Started](../getting-started/) guide to create your first trigger and test your installation.
