---
outline: [1, 4]
---

# meta

The `meta` section controls the form window itself—its title, size, position, and opacity. It also lets you add documentation metadata like the form's name and version, and configure keyboard shortcuts.

> [!NOTE] Optional Section
> If you skip this section, the window uses default settings (800×800 pixels, fully opaque, centered).

---

## What Meta Controls

Think of `meta` as answering three questions:

1. **What is this form?** — Name, description, version, author (useful when you have many forms)
2. **How should the window appear?** — Title bar text, window size, position, transparency
3. **How do I interact with it?** — Keyboard shortcuts for submitting, resetting, or closing

[IMAGE: Two form windows side by side demonstrating different meta settings: left window is small (400x300), semi-transparent with title "Quick Note", positioned in top-right corner; right window is larger (800x600), fully opaque with title "Detailed Report", centered on screen]

## Example Usage

```yml
meta:
  name: Follow-up Email
  description: A template for sending follow-up emails...
  version: 1.0.0
  window:
    title: EDF Email
    opacity: 0.7
    height: 500
    width: 500
    x: 0
    y: 0
  hotkeys:
    submit: "ctrl+s"
    reset: "ctrl+r"
```


## Properties

Complete list of available properties in the `meta` section:

|Property|Type|Description|Default Value|
|---|---|---|---|
|`name`|`string`|Name of the form|-|
|`description`|`string`|Description of the form|-|
|`version`|`string`|Version of the form|-|
|`author`|`string`|Author of the form|-|

### Window Configuration

Properties under `meta.window`:

|Property|Type|Description|Default Value|
|---|---|---|---|
|`title`|`string`|Window title|"Espanso Dynamic Forms"|
|`width`|`number`|Window width in pixels|1500 (dev) / 800 (prod)|
|`height`|`number`|Window height in pixels|800|
|`opacity`|`number`|Window opacity (0.0 - 1.0)|1.0|
|`x`|`number`|Initial window X position|-|
|`y`|`number`|Initial window Y position|-|

### Hotkeys Configuration

Properties under `meta.hotkeys`. 

> [!TIP] Format
> Shortcuts are defined as strings using common modifiers (ctrl, alt, shift) and keys joined by `+`. Case insensitive. Examples: `ctrl+enter`, `shift+s`.

|Property|Type|Description|Default Value|
|---|---|---|---|
|`submit`|`string`|Hotkey to submit the form|`ctrl+enter` (or `cmd+enter` on macOS)|
|`reset`|`string`|Hotkey to reset the form|-|
|`close`|`string`|Hotkey to close the form|-|

