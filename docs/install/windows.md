---
outline: [1, 4]
---

# Install on Windows

Follow these steps to install Espanso Dynamic Forms using a Windows installer.

## Step 1: Download Installer

Download the latest version directly:  
**[Espanso-Dynamic-Forms-Win-Setup.exe](https://github.com/lumetrium/espanso-dynamic-forms/releases/latest/download/Espanso-Dynamic-Forms-Win-Setup.exe)**

> [!TIP] Need a specific version?
> Visit the [Releases page](https://github.com/lumetrium/espanso-dynamic-forms/releases) on GitHub to download older versions.

## Step 2: Run Installer

1. Double-click the downloaded `.exe` file
2. If Windows SmartScreen appears with a warning, click **"More info"** then **"Run anyway"**

> [!NOTE] About SmartScreen
> Windows may show a warning because the installer isn't signed with an expensive code-signing certificate. 
> The application is safe to install; you can [review the source code](https://github.com/lumetrium/espanso-dynamic-forms) on GitHub.

## Step 3: Choose Installation Location

The default installation folder is:
```
C:/Program Files/Espanso Dynamic Forms
```

You can change this location if needed, but the default works for most users.

![install-location.avif](https://media.lumetrium.com/edf/windows/install-location.avif)

## Step 4: Complete Installation

1. Click **"Install"** to begin
2. Wait for installation to finish (usually takes a few seconds)
3. Click **"Finish"** to close the installer

The application does **not** start automatically. You'll launch it through Espanso triggers instead.

---

## Alternative: Zip (no installer)

Releases also include a **Windows zip** — the unpacked app, same layout as after installation, but **without** running setup.

1. On the [Releases](https://github.com/lumetrium/espanso-dynamic-forms/releases) page, download the file named like **`Espanso Dynamic Forms-<version>-win.zip`** (not the `-Win-Setup.exe` installer).
2. Extract the archive to a folder you control (for example under your user profile).
3. In your Espanso match, use the **full path to `EDF.exe`** inside that folder as the first `args` entry for the script (plus `--form-config` as usual).

## What's Next?

Now that Espanso Dynamic Forms is installed, you need to configure Espanso to use it.
Follow the [Getting Started](../getting-started/) guide to create your first trigger.
