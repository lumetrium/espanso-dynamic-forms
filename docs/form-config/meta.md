---
outline: [1, 4]
---

# meta

The `meta` section controls the form window itself—its title, size, position, and opacity. It also lets you add documentation metadata like the form's name and version.

> [!NOTE] Optional Section
> If you skip this section, the window uses default settings (800×800 pixels, fully opaque, centered).

---

## What Meta Controls

Think of `meta` as answering two questions:

1. **What is this form?** — Name, description, version, author (useful when you have many forms)
2. **How should the window appear?** — Title bar text, window size, position, transparency

[IMAGE: Two form windows side by side demonstrating different meta settings: left window is small (400x300), semi-transparent with title "Quick Note", positioned in top-right corner; right window is larger (800x600), fully opaque with title "Detailed Report", centered on screen]

## Example Usage

```yml
meta:  
  name: Follow-up Email  
  description: A template for sending follow-up emails...  
  version: 1.0.0  
  title: EDF Email  
  opacity: 0.7  
  height: 500  
  width: 500  
  x: 0  
  y: 0
```


## Properties

Complete list of available properties in the `meta` section:

|Property|Type|Description|Default Value|
|---|---|---|---|
|`name`|`string`|Name of the form|-|
|`description`|`string`|Description of the form|-|
|`version`|`string`|Version of the form|-|
|`author`|`string`|Author of the form|-|
|`title`|`string`|Window title|"Espanso Dynamic Forms"|
|`width`|`number`|Window width in pixels|1500 (dev) / 800 (prod)|
|`height`|`number`|Window height in pixels|800|
|`opacity`|`number`|Window opacity (0.0 - 1.0)|1.0|
|`x`|`number`|Initial window X position|-|
|`y`|`number`|Initial window Y position|-|


