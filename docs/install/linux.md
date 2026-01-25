---
outline: [1, 4]
---

# Install on Linux

Espanso Dynamic Forms offers two installation methods for Linux. Choose the one that best fits your distribution.

| Method | Best For | Pros |
|--------|----------|------|
| `.deb` package | Debian, Ubuntu, Linux Mint, Pop!_OS | System integration, automatic updates via apt |
| `.AppImage` | Any Linux distribution | Universal, no installation required, portable |


## Option 1: Using the .deb Package

This method is recommended for Debian-based distributions. The package installs the executable to `/usr/bin/espanso-dynamic-forms`.

### Download

Open a terminal and run:

```bash
wget https://github.com/lumetrium/espanso-dynamic-forms/releases/latest/download/Espanso-Dynamic-Forms-Linux.deb
```

> [!TIP] Need a specific version?
> Visit the [Releases page](https://github.com/lumetrium/espanso-dynamic-forms/releases) on GitHub to download older versions.

### Install

Run the following command to install:

```bash
sudo apt install ./Espanso-Dynamic-Forms-Linux.deb
```

### Verify Installation

Confirm the installation succeeded:

```bash
which espanso-dynamic-forms
```

This should output `/usr/bin/espanso-dynamic-forms`. If you see this path, you're ready to continue.

## Option 2: Using the .AppImage

AppImages are portable executables that work on most Linux distributions without installation.

### Download

Open a terminal and run:

```bash
wget https://github.com/lumetrium/espanso-dynamic-forms/releases/latest/download/Espanso-Dynamic-Forms-Linux.AppImage
```

### Make It Executable

Before you can run the AppImage, you need to make it executable:

```bash
chmod +x Espanso-Dynamic-Forms-Linux.AppImage
```

### Run the Application

You can now run the application directly:

```bash
./Espanso-Dynamic-Forms-Linux.AppImage --help
```

> [!TIP] Optional: Move to a Permanent Location
> For easier access, move the AppImage to a location in your PATH:
> ```bash
> mkdir -p ~/.local/bin
> mv Espanso-Dynamic-Forms-Linux.AppImage ~/.local/bin/espanso-dynamic-forms
> ```
> Make sure `~/.local/bin` is in your PATH. You can then reference `espanso-dynamic-forms` in your Espanso triggers.

## What's Next?

The application does **not** start automatically. Espanso Dynamic Forms is designed to be launched by Espanso triggers.
Follow the [Getting Started](../getting-started/) guide to create your first trigger and test your installation.
