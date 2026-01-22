---
outline: [1, 4]
---

# Install on Linux

Espanso Dynamic Forms offers two main installation methods for Linux. 

The `.deb` package is recommended for Debian, Ubuntu, and derivative distributions for better system integration. 

The `.AppImage` is a universal package that should run on most modern Linux distributions.

## Option 1: Using the .deb Package (Debian/Ubuntu)

### Download

Use `wget` in the terminal:
```bash 
wget https://github.com/lumetrium/espanso-dynamic-forms/releases/latest/download/Espanso-Dynamic-Forms-Linux.deb
```

> [!tip] Older versions
> If you want to install a specific version, visit the [Releases page](https://github.com/lumetrium/espanso-dynamic-forms/releases) on GitHub

### Install
In your terminal:
- Navigate to the directory where you downloaded the file (e.g., `cd ~/Downloads`)
- Run the following command:


```bash
sudo apt install Espanso-Dynamic-Forms-Linux.deb
```

## Option 2: Using the .AppImage (Universal)

### Download

Use `wget` in the terminal:
```bash 
wget https://github.com/lumetrium/espanso-dynamic-forms/releases/latest/download/Espanso-Dynamic-Forms-Linux.AppImage
```

### Install

In your terminal:
- Navigate to the directory where you downloaded the file (e.g., `cd ~/Downloads`)
- Make the AppImage executable:

```bash
chmod +x Espanso-Dynamic-Forms-Linux.AppImage
```

- Run the application:

```bash
./Espanso-Dynamic-Forms-Linux.AppImage
```

> [!tip] Optional: Integration with system
> You can move the AppImage to a dedicated location and create a desktop entry for easier access:
> ```bash
> mkdir -p ~/.local/bin
> mv Espanso-Dynamic-Forms-Linux.AppImage ~/.local/bin/
> ```

## After Installation

Once you've installed Espanso Dynamic Forms, the application will **NOT** start automatically. You need to integrate it with Espanso by configuring a trigger.

See the [Getting Started](../getting-started/) guide for instructions on how to set up your first trigger and start using Espanso Dynamic Forms.

