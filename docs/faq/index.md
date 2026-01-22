---
outline: [1, 4]
---

# FAQ

Quick answers to common questions about Espanso Dynamic Forms.

## General Questions

### What is Espanso Dynamic Forms?

Espanso Dynamic Forms is a desktop application that extends Espanso's text expansion capabilities by providing schema-driven, 
interactive forms with templated output generation. It bridges three technologies: Espanso (text expansion), JSON Forms (form rendering), and Liquid (template engine).

### How does it work?

You type a keyword trigger (e.g., `:demo`) in any application, which launches a form window where you fill out fields, 
then click Submit to insert the formatted output at your cursor position.

### What platforms are supported?

Windows and Linux are officially supported. macOS has not been tested, but you may be able to build it yourself since it's an Electron application.

## Installation & Setup

### How do I install it?

1. Install [Espanso](https://espanso.org/) first
2. Download Espanso Dynamic Forms from the [releases page](https://github.com/lumetrium/espanso-dynamic-forms/releases)

### How do I create a trigger?

Add a trigger configuration to your Espanso config file (`~/.config/espanso/match/base.yml` on Linux/macOS or `%APPDATA%\espanso\match\base.yml` on Windows). 
The trigger must use `type: script` and pass the executable path with `--form-config` argument pointing to your form definition file.

### Why is `force_mode: clipboard` required?

This setting is required for multiline output insertion to work correctly.

## Form Config

### What file format do I use for forms?

Forms are defined in YAML or JSON files with at least three required sections: `schema`, `uischema`, and `template`.

### Where should I store my form files?

You can store form files anywhere on your system. Reference them using the `--form-config` argument in your Espanso trigger configuration.

### Can I use clipboard content in my forms?

Yes, use the `{{clipboard}}` token in the `data` section to populate fields with clipboard content and in the `template` section to include clipboard data in the output.

### Can I use environment variables?

Yes, use `{{env.VARIABLE_NAME}}` tokens in your form configuration. You can also pass environment variables via the `--env` command-line argument.

## Features & Capabilities

### What field types are supported?

The application supports all JSON Schema field types including text, numbers, booleans, dates, enums (dropdowns/radio buttons), arrays, and objects. It also includes custom file upload controls.

### How do I format the output?

Use Liquid templating syntax in the `template` section of your form configuration. Liquid supports filters, control flow, and variable interpolation. 

### Can I validate form inputs?

Yes, validation is built-in through JSON Schema. Define validation rules in the `schema` section (e.g., `required` fields, string patterns, number ranges).

### Where can I find examples?

Browse the [Forms Catalog](../library) for sample form configurations. You can also test the built-in demo form by typing `:demo` after installation. 

## Troubleshooting

### Where do I report issues?

Please [open an issue](https://github.com/lumetrium/espanso-dynamic-forms/issues/new) on GitHub.

### Where can I learn more?

- **Form syntax**: [JSON Forms documentation](https://jsonforms.io/docs)
- **Output formatting**: [Liquid templating](https://shopify.github.io/liquid/)
- **Trigger configuration**: [Espanso documentation](https://espanso.org/docs/)
- **UI components**: [Vuetify Renderers examples](https://jsonforms-vuetify-renderers.netlify.app/#/example/main)

### How do I debug my forms?
Press `Ctrl+Shift+I` while a form is open to access Developer Tools.

For more issues (like forms not opening at all), try running the application from the command line to see output logs:
```powershell
EspansoDynamicForms.exe --form-config path/to/form.yml
```
See the [CLI Reference](../reference/cli) for more details.
