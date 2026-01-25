<h1 align="center">Espanso Dynamic Forms</h1>

<div align="center">

[![](https://img.shields.io/github/v/release/lumetrium/espanso-dynamic-forms?style=for-the-badge)](https://github.com/lumetrium/espanso-dynamic-forms/releases/latest) ![](https://img.shields.io/github/downloads/lumetrium/espanso-dynamic-forms/total?style=for-the-badge) ![GitHub](https://img.shields.io/github/license/lumetrium/espanso-dynamic-forms?style=for-the-badge)

</div>

<p align="center">
<img src="./public/logos/edf.png" height="140"/>
</p>

<p align="center">
<strong>Powerful forms for <a href="https://espanso.org/">Espanso</a>.</strong><br/>
Define rich, interactive forms in YAML. Insert templated output anywhere.
</p>

<p align="center">

<video src="https://github.com/user-attachments/assets/4114287e-7169-46c6-aeb9-f7c350ca53fb" loop="true" autoplay="autoplay" controls muted />

<a href="https://lumetrium.com/espanso-dynamic-forms/docs/library/ready-made/">See more examples</a>
</p>


## Why Espanso Dynamic Forms?

Espanso's built-in forms are great for quick input. But what if you need:

- **Validation** — required fields, patterns, type checking
- **Advanced layouts** — tabs, groups, conditional visibility
- **More input types** — date pickers, file uploads, checkboxes, sliders
- **Powerful templating** — conditionals, loops, filters with [Liquid](https://shopify.github.io/liquid/)

**Espanso Dynamic Forms** fills that gap. Define your form in a YAML file, reference it in an Espanso trigger, and get a polished Material Design form every time.

→ [Compare to Espanso Forms](https://lumetrium.com/espanso-dynamic-forms/docs/compare-to-espanso-forms/) to see the full differences.

<p align="center">

<img height="246" src="https://media.lumetrium.com/edf/compare/espanso.png" alt="Espanso Forms (built-in)" />
<img height="246" src="https://media.lumetrium.com/edf/compare/edf-compact.png" alt="Espanso Dynamic Forms (this app)" />

</p>


## Quick Start

**1. Install** — Download from [Releases](https://github.com/lumetrium/espanso-dynamic-forms/releases) and install. ([Installation Guide](https://lumetrium.com/espanso-dynamic-forms/docs/install/))

**2. Add a trigger** to your Espanso config (`%APPDATA%\espanso\match\base.yml` on Windows):

```yml
matches:
  - trigger: ":demo"
    replace: "{{output}}"
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/demo.yml
```

**3. Type `:demo`** in any text field — fill the form, hit Submit, and watch the output appear.

→ [Getting Started Guide](https://lumetrium.com/espanso-dynamic-forms/docs/getting-started/) for step-by-step setup.

## How It Works

```
📝 You type a trigger → 📋 Form appears → ✍️ Fill fields → ✅ Submit → 📤 Formatted text inserted
```

Your forms are defined in YAML with four sections:

| Section | Purpose |
|---------|---------|
| `schema` | Define fields and types ([docs](https://lumetrium.com/espanso-dynamic-forms/docs/form-config/schema)) |
| `uischema` | Control layout and appearance ([docs](https://lumetrium.com/espanso-dynamic-forms/docs/form-config/uischema)) |
| `data` | Set default values, use `{{clipboard}}` ([docs](https://lumetrium.com/espanso-dynamic-forms/docs/form-config/data)) |
| `template` | Format output with Liquid syntax ([docs](https://lumetrium.com/espanso-dynamic-forms/docs/form-config/template)) |

→ [Form Config Reference](https://lumetrium.com/espanso-dynamic-forms/docs/form-config/) for complete documentation.

## Ready-Made Forms

The app includes a library of pre-built forms:

| Form | Trigger | Use Case |
|------|---------|----------|
| [Code Assistance](https://lumetrium.com/espanso-dynamic-forms/docs/library/ready-made/code) | `:code` | Get AI help with code |
| [Email](https://lumetrium.com/espanso-dynamic-forms/docs/library/ready-made/email) | `:email` | Draft follow-up emails |
| [Reply](https://lumetrium.com/espanso-dynamic-forms/docs/library/ready-made/reply) | `:reply` | Compose message replies |
| [Files](https://lumetrium.com/espanso-dynamic-forms/docs/library/ready-made/files) | `:files` | Batch file processing |

→ [Forms Library](https://lumetrium.com/espanso-dynamic-forms/docs/library/) for all available forms and boilerplate snippets.

Need something custom? The **[Form Factory](https://lumetrium.com/espanso-dynamic-forms/docs/library/factory/)** helps you describe what you need and generates the config with AI.

## Features at a Glance

- **JSON Forms schema** — industry-standard way to define form structure
- **Liquid templating** — filters, conditionals, loops for flexible output
- **Material Design UI** — clean, modern interface via Vuetify
- **Validation built-in** — required fields, patterns, type checking
- **Environment variables** — `{{env.VAR}}` and `{{clipboard}}` tokens
- **File handling** — upload files, read content, extract metadata
- **Tabbed interfaces** — organize complex forms with categories
- **Conditional visibility** — show/hide fields based on other values

## Platforms

| Platform | Status |
|----------|--------|
| Windows | ✅ Supported |
| Linux | ✅ Supported |
| macOS | ⚠️ Not tested (should work since it's Electron) |

## Documentation

**[Espanso Dynamic Forms Docs](https://lumetrium.com/espanso-dynamic-forms/docs/)** — The full documentation site:

- [Getting Started](https://lumetrium.com/espanso-dynamic-forms/docs/getting-started/) — Installation and first form
- [Form Config](https://lumetrium.com/espanso-dynamic-forms/docs/form-config/) — Schema, UI, data, and templates
- [Form Elements](https://lumetrium.com/espanso-dynamic-forms/docs/form-elements/) — Controls and layouts reference
- [Liquid Templating](https://lumetrium.com/espanso-dynamic-forms/docs/liquid/) — Output formatting guide
- [Use Cases](https://lumetrium.com/espanso-dynamic-forms/docs/use-cases/) — Real-world examples

## Contributing

Interested in contributing? See the codebase overview:

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lumetrium/espanso-dynamic-forms)

**Questions or issues?** [Open an issue](https://github.com/lumetrium/espanso-dynamic-forms/issues/new) on GitHub.

## Check out my other project

<a href="https://chromewebstore.google.com/detail/definer-popup-dictionary/noagjioaihamoljcbelhdlldnmlgnkon?utm_source=espanso-dynamic-forms&utm_medium=referral&utm_content=readme">
  <img src="./public/logos/definer.png" style="margin-right: 1em" height="40px" align="left"/>
</a>

**[Definer - Popup Translator & Dictionary](https://chromewebstore.google.com/detail/definer-popup-dictionary/noagjioaihamoljcbelhdlldnmlgnkon?utm_source=espanso-dynamic-forms&utm_medium=referral&utm_content=readme)**  
Instant definitions, translations, search, and AI results for words and phrases you select or type.
