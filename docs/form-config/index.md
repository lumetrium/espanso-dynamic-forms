---
outline: [1, 4]
---

# Form Config

In Espanso Dynamic Forms, the form is defined using a configuration file written in either **YAML** or **JSON** format.

This file specifies the fields, their types, labels, default values, validation rules, and other properties that determine how the form behaves and appears.

The path to the config file must be provided through the `--form-config` option when launching EDF from an Espanso trigger. See [Getting Started](../getting-started/) for more details.

## Structure

There are exactly **6** main sections in a Form Config file: [`schema`](./schema), [`uischema`](./uischema), [`template`](./template), [`data`](./data), [`meta`](./meta), and [`i18n`](./i18n).

Each section serves a specific purpose, and only `schema`, `uischema`, and `template` are required for the form to function properly.

TODO: turn into a table for better readability

- [`schema`](./schema) - **required** - defines form's fields and their, follows [JSON Forms](../json-forms/)
- [`uischema`](./uischema) - **required** - defines form's layout and appearance, follows [JSON Forms](../json-forms/)
- [`data`](./data) - _optional_ - provides initial values for the form's fields
- [`template`](./template) - **required** - defines how the form's data will be used to generate the final output, uses [Liquid](../liquid/) templating language
- [`i18n`](./i18n) - _optional_ - localization strings for different languages
- [`meta`](./meta) - _optional_ - additional metadata about the form

## Examples

Let's see a couple of examples of Form Config files.

### Minimal

Simple form that asks for a name and greets the user:

```yml
schema:
  type: object
  properties:
    name:
      type: string
      title: 'Name'

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: '#/properties/name'

template: |
  Hello, {{ name }}!
```

### Realistic

A more complex form that collects user information and generates a formatted output, we'll use all sections this time:

````yml
meta:
  name: File Text Extractor
  description: Extracts and outputs text content from a selected file.
  version: 1.0.0
  title: Extract Text from File
  opacity: 1
  height: 500
  width: 500
  x: 0
  y: 0

schema:
  type: object
  required:
    - singleFile
  properties:
    singleFile:
      type: object
      format: file
      i18n: myFile

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/singleFile"
      options:
        accept: "text/*"

data:
  singleFile:
    path: "C:/Windows/System32/drivers/etc/hosts"

i18n:
  en:
    myFile:
      description: Please upload
      selectedFile: Selected file
      fileNumber: File {index}
      remove: Remove
  ru:
    myFile:
      description: Пожалуйста, загрузите
      selectedFile: Выбранный файл
      fileNumber: Файл {index}
      remove: Удалить

template: |
  {{singleFile.text}}
````

### Catalog

You can find a collection of ready-to-use configs in the [Forms Catalog](../library/).
