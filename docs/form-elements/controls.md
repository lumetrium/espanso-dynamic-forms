---
outline: [1, 4]
---

# Form Controls

Controls are input elements that allow users to enter data. Each control connects to a schema property via its `scope`.

## Control Structure

Every control has this basic structure:

```yml
- type: Control
  scope: "#/properties/fieldName"
  label: Display Label
  options:
    # Control-specific options
```

| Property | Required | Description |
|----------|----------|-------------|
| `type` | Yes | Always `Control` |
| `scope` | Yes | JSON Pointer to schema property |
| `label` | No | Override the default label |
| `options` | No | Control-specific configuration |
| `rule` | No | Conditional visibility rule |

## Text Input

The default control for `string` type fields.

```yml
# Schema
name:
  type: string

# UI Schema
- type: Control
  scope: "#/properties/name"
  label: Your Name
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `focus` | boolean | Auto-focus this field on form open |

```yml
options:
  focus: true
```

## Textarea

Multi-line text input for longer content.

```yml
# Schema
description:
  type: string

# UI Schema
- type: Control
  scope: "#/properties/description"
  label: Description
  options:
    multi: true
    vuetify:
      v-textarea:
        rows: 5
        persistentHint: true
        placeholder: Enter details here...
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `multi` | boolean | Enable multi-line input |
| `vuetify.v-textarea.rows` | number | Number of visible rows |
| `vuetify.v-textarea.placeholder` | string | Placeholder text |
| `vuetify.v-textarea.persistentHint` | boolean | Keep hint visible |

---

## Number Input

For numeric values.

```yml
# Schema
quantity:
  type: integer
  minimum: 1
  maximum: 100
  default: 1

# Or for decimals
price:
  type: number
  minimum: 0
```

The control renders automatically based on type. Use `integer` for whole numbers, `number` for decimals.

## Slider

An alternative number input rendered as a draggable slider.

```yml
# Schema
rating:
  type: integer
  minimum: 1
  maximum: 10
  default: 5

# UI Schema
- type: Control
  scope: "#/properties/rating"
  label: Rating
  options:
    slider: true
```

## Checkbox (Single)

A single true/false checkbox.

```yml
# Schema
acceptTerms:
  type: boolean
  default: false

# UI Schema
- type: Control
  scope: "#/properties/acceptTerms"
  label: I accept the terms and conditions
```

## Dropdown Select

Selection from predefined options.

```yml
# Schema
priority:
  type: string
  enum:
    - High
    - Medium
    - Low

# UI Schema (default dropdown)
- type: Control
  scope: "#/properties/priority"
  label: Priority
```

### Autocomplete Dropdown

For longer lists, enable searchable autocomplete:

```yml
- type: Control
  scope: "#/properties/language"
  label: Language
  options:
    format: select
    vuetify:
      v-autocomplete:
        hideDetails: true
```

## Radio Buttons

Display enum options as radio buttons instead of a dropdown.

```yml
# Schema
type:
  type: string
  enum:
    - message
    - email
    - post

# UI Schema
- type: Control
  scope: "#/properties/type"
  label: Content Type
  options:
    format: radio
    vuetify:
      v-radio-group:
        inline: true       # Horizontal layout
        hideDetails: true  # Hide validation messages
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `format` | `"radio"` | Render as radio buttons |
| `vuetify.v-radio-group.inline` | boolean | Horizontal arrangement |
| `vuetify.v-radio-group.hideDetails` | boolean | Hide hint/error space |

## Checkbox Group

Multi-select from predefined options using checkboxes.

```yml
# Schema
selections:
  type: array
  items:
    type: string
    enum:
      - Option A
      - Option B
      - Option C
  uniqueItems: true

# UI Schema
- type: Control
  scope: "#/properties/selections"
  label: Select Options
  options:
    format: checkbox
    vuetify:
      v-input:
        class: vertical  # Stack vertically
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `format` | `"checkbox"` | Render as checkboxes |
| `vuetify.v-input.class` | `"vertical"` | Stack vertically |

## Date Picker

Calendar-based date selection.

```yml
# Schema
dueDate:
  type: string
  format: date

# UI Schema
- type: Control
  scope: "#/properties/dueDate"
  label: Due Date
  options:
    dateFormat: DD.MM.YYYY      # Display format
    dateSaveFormat: YYYY-MM-DD  # Storage format
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `dateFormat` | string | Display format (moment.js) |
| `dateSaveFormat` | string | How date is stored in data |

### Default to Today

```yml
data:
  dueDate: "{{ 'now' | date: '%Y-%m-%d' }}"
```

## File Upload (Single)

Upload a single file.

```yml
# Schema
document:
  type: object
  format: file
  i18n: fileLabels  # Optional translation key

# UI Schema
- type: Control
  scope: "#/properties/document"
  options:
    accept: ".pdf, .docx"
```

### File Properties in Template

| Property | Description |
|----------|-------------|
| `file.text` | File contents as text |
| `file.name` | Filename without extension |
| `file.fullName` | Filename with extension |
| `file.extension` | File extension |
| `file.size` | Size in bytes |
| `file.hash` | SHA-256 hash |
| `file.mime` | MIME type |
| `file.path` | Full file path |

## File Upload (Multiple)

Upload multiple files.

```yml
# Schema
attachments:
  type: array
  format: file

# UI Schema
- type: Control
  scope: "#/properties/attachments"
  options:
    accept: "image/*, .pdf"
    recentFiles:
      enabled: true
      maxItems: 50
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `accept` | string | Allowed file types (e.g. `image/*, .pdf`) |
| `recentFiles.enabled` | boolean | Enable recent files history |
| `recentFiles.maxItems` | number | Max recent files to show (default: 10) |
| `recentFiles.namespace` | string | Share history key between fields |
| `recentFiles.historyKey` | string | Explicit storage key |

---

## String Array

Editable list of strings.

```yml
# Schema
tags:
  type: array
  items:
    type: string

# UI Schema
- type: Control
  scope: "#/properties/tags"
  label: Tags

# Data (start with one empty item)
data:
  tags:
    - ""
```

## Object Array

List of items with multiple properties.

```yml
# Schema
variables:
  type: array
  items:
    type: object
    properties:
      name:
        type: string
      value:
        type: string

# UI Schema
- type: Control
  scope: "#/properties/variables"
  label: Variables
  options:
    detail:
      type: HorizontalLayout
      elements:
        - type: Control
          scope: "#/properties/name"
          label: Name
        - type: Control
          scope: "#/properties/value"
          label: Value

# Data
data:
  variables:
    - name: ""
      value: ""
```

The `detail` option defines how each array item is rendered.

## Read-Only Control

Display a value without allowing edits.

```yml
- type: Control
  scope: "#/properties/status"
  options:
    readonly: true
```

## Vuetify Options

All controls support Vuetify component options through the `vuetify` option:

```yml
options:
  vuetify:
    v-text-field:           # Component name
      outlined: true        # Component prop
      dense: true
      hideDetails: true
      persistentHint: true
      hint: "Enter your name"
```

Common Vuetify components:
- `v-text-field` — Text inputs
- `v-textarea` — Multi-line text
- `v-select` — Dropdowns
- `v-autocomplete` — Searchable dropdowns
- `v-radio-group` — Radio button groups
- `v-input` — Checkbox groups
- `v-file-input` — File uploads

See [Vuetify documentation](https://vuetifyjs.com/en/components/all/) for all available props.
