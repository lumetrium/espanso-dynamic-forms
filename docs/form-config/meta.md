---
outline: [1, 4]
---

# meta


The `meta` top-level key of the [form config](./index) provides metadata about the form,
such as its name, description, version, author, and window properties.

> [!note] Optional Section
> If omitted, default values will be used for window properties.

## Purpose
At a high level, `meta` answers two fundamental questions about your form:

**1. "What is this form?"** - Documentation properties like `name`, `description`, `version`, and `author` help you (and others) understand what the form does and who maintains it. This is especially valuable when you have many forms and need to organize or share them.

**2. "How should this form appear?"** - Window properties like `title`, `width`, `height`, `opacity`, and position (`x`, `y`) control the user experience when the form opens. For example, a quick note-taking form might be small and semi-transparent, while a detailed data entry form might be larger and fully opaque.

It's conceptually distinct from the other top-level keys because it's about the **form container**, not the **form content**.

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


