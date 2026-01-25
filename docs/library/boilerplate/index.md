---
outline: [1, 4]
---

# Boilerplate Snippets

Copy-paste building blocks for creating your own forms. These snippets are extracted from the [Ready-Made Forms](../ready-made/) and cover common patterns.

## Field Types

### Required Text Input

A basic required text field:

```yml
schema:
  type: object
  properties:
    name:
      type: string
  required:
    - name

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/name"
      label: Your Name
```

### Multi-line Textarea

For longer text input:

```yml
schema:
  properties:
    description:
      type: string

uischema:
  elements:
    - type: Control
      scope: "#/properties/description"
      label: Description
      options:
        multi: true
        vuetify:
          v-textarea:
            rows: 5
```

### Dropdown Select

Selection from predefined options:

```yml
schema:
  properties:
    priority:
      type: string
      enum:
        - High
        - Medium
        - Low

uischema:
  elements:
    - type: Control
      scope: "#/properties/priority"
      label: Priority
```

### Dropdown with Autocomplete

Searchable dropdown for longer lists:

```yml
uischema:
  elements:
    - type: Control
      scope: "#/properties/language"
      options:
        format: select
        vuetify:
          v-autocomplete:
            hideDetails: true
```

### Radio Buttons (Inline)

Horizontal radio button group:

```yml
schema:
  properties:
    type:
      type: string
      enum:
        - message
        - email
        - post

uischema:
  elements:
    - type: Control
      scope: "#/properties/type"
      label: Content Type
      options:
        format: radio
        vuetify:
          v-radio-group:
            inline: true
            hideDetails: true
```

### Checkbox (Single Boolean)

A single true/false checkbox:

```yml
schema:
  properties:
    acceptTerms:
      type: boolean
      default: false

uischema:
  elements:
    - type: Control
      scope: "#/properties/acceptTerms"
      label: I accept the terms and conditions
```

### Checkbox Group (Multi-select)

Select multiple items from a list:

```yml
schema:
  properties:
    selections:
      type: array
      items:
        type: string
        enum:
          - Option A
          - Option B
          - Option C
      uniqueItems: true

uischema:
  elements:
    - type: Control
      scope: "#/properties/selections"
      label: Select Options
      options:
        format: checkbox
        vuetify:
          v-input:
            class: vertical
```

### Date Picker

Date selection with formatting:

```yml
schema:
  properties:
    dueDate:
      type: string
      format: date

uischema:
  elements:
    - type: Control
      scope: "#/properties/dueDate"
      label: Due Date
      options:
        dateFormat: DD.MM.YYYY
        dateSaveFormat: YYYY-MM-DD

data:
  dueDate: "{{ 'now' | date: '%Y-%m-%d' }}"
```

### Number with Range

Integer input with min/max:

```yml
schema:
  properties:
    quantity:
      type: integer
      minimum: 1
      maximum: 100
      default: 1

uischema:
  elements:
    - type: Control
      scope: "#/properties/quantity"
      label: Quantity
```

### Slider

Number input as a slider:

```yml
schema:
  properties:
    rating:
      type: integer
      minimum: 1
      maximum: 10
      default: 5

uischema:
  elements:
    - type: Control
      scope: "#/properties/rating"
      label: Rating
      options:
        slider: true
```

## File Handling

### Single File Upload

```yml
schema:
  properties:
    file:
      type: object
      format: file

uischema:
  elements:
    - type: Control
      scope: "#/properties/file"
      options:
        accept: "*"

template: |
  File: {{file.fullName}}
  Content:
  {{file.text}}
```

### Multiple File Upload

```yml
schema:
  properties:
    files:
      type: array
      format: file

uischema:
  elements:
    - type: Control
      scope: "#/properties/files"
      options:
        accept: "image/*, .pdf, .docx"

template: |
  {% for f in files %}
  - {{f.fullName}} ({{f.size}} bytes)
  {% endfor %}
```

### File Upload with Recent Files

```yml
uischema:
  elements:
    - type: Control
      scope: "#/properties/files"
      options:
        accept: "*"
        recentFiles:
          enabled: true
          maxItems: 50
          namespace: "my-shared-history"
```

## Layouts

### Vertical Layout

Stack elements top to bottom:

```yml
uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/field1"
    - type: Control
      scope: "#/properties/field2"
```

### Horizontal Layout

Arrange elements side by side:

```yml
uischema:
  type: HorizontalLayout
  elements:
    - type: Control
      scope: "#/properties/firstName"
    - type: Control
      scope: "#/properties/lastName"
```

### Tabs (Categorization)

Multi-tab interface:

```yml
uischema:
  type: Categorization
  elements:
    - type: Category
      label: Basic Info
      elements:
        - type: VerticalLayout
          elements:
            - type: Control
              scope: "#/properties/name"
    - type: Category
      label: Details
      elements:
        - type: VerticalLayout
          elements:
            - type: Control
              scope: "#/properties/description"
```

### Nested Horizontal in Vertical

Common pattern for form rows:

```yml
uischema:
  type: VerticalLayout
  elements:
    - type: HorizontalLayout
      elements:
        - type: Control
          scope: "#/properties/firstName"
        - type: Control
          scope: "#/properties/lastName"
    - type: Control
      scope: "#/properties/email"
```

## Dynamic Arrays

### Simple String Array

Editable list of strings:

```yml
schema:
  properties:
    items:
      type: array
      items:
        type: string

data:
  items:
    - ""
```

### Array with Object Items

Each item has multiple properties:

```yml
schema:
  properties:
    variables:
      type: array
      items:
        type: object
        properties:
          name:
            type: string
          value:
            type: string

uischema:
  elements:
    - type: Control
      scope: "#/properties/variables"
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

data:
  variables:
    - name: ""
      value: ""
```

## Conditional Visibility

### Show Field Based on Selection

```yml
uischema:
  elements:
    - type: Control
      scope: "#/properties/hasDetails"  # boolean checkbox
    - type: Control
      scope: "#/properties/details"
      rule:
        effect: SHOW
        condition:
          scope: "#/properties/hasDetails"
          schema:
            const: true
```

### Show Based on Enum Value

```yml
uischema:
  elements:
    - type: Control
      scope: "#/properties/contactMethod"  # enum: email, phone
    - type: Control
      scope: "#/properties/email"
      rule:
        effect: SHOW
        condition:
          scope: "#/properties/contactMethod"
          schema:
            const: email
    - type: Control
      scope: "#/properties/phone"
      rule:
        effect: SHOW
        condition:
          scope: "#/properties/contactMethod"
          schema:
            const: phone
```

### Show Based on Multiple Values

```yml
rule:
  effect: SHOW
  condition:
    scope: "#/properties/layout"
    schema:
      enum:
        - multi-tab
        - stepper
```

## Default Values

### Static Default

```yml
data:
  priority: Medium
  count: 1
  enabled: true
```

### Clipboard Pre-fill

```yml
data:
  content: "{{clipboard}}"
```

### Current Date

```yml
data:
  date: "{{ 'now' | date: '%Y-%m-%d' }}"
```

### Environment Variable

```yml
data:
  author: "{{env.USERNAME}}"
```

## Template Patterns

### Basic Output

```yml
template: |
  Name: {{name}}
  Email: {{email}}
```

### With Filters

```yml
template: |
  Name: {{name | capitalize}}
  Status: {{status | upcase}}
  Count: {{items | size}}
```

### Conditional Sections

```yml
template: |
  {{name}}
  
  {% if description != blank %}
  Description: {{description}}
  {% endif %}
```

### Array Output

```yml
template: |
  Items:
  {% for item in items %}
  - {{item}}
  {% endfor %}
```

### Filtered Array

```yml
template: |
  {% assign filtered = items | where_exp: "item", "item != ''" %}
  {% if filtered.size > 0 %}
  - {{ filtered | join: "\n- " }}
  {% endif %}
```

## i18n (Translations)

### Basic Translation Setup

```yml
schema:
  properties:
    file:
      type: object
      format: file
      i18n: fileInput

i18n:
  en:
    fileInput:
      label: Please upload a file
      selectedFile: Selected file
      remove: Remove
  de:
    fileInput:
      label: Bitte laden Sie eine Datei hoch
      selectedFile: Ausgewählte Datei
      remove: Entfernen
```

## Window Properties

### Custom Window Size and Position

```yml
meta:
  title: My Custom Form
  width: 600
  height: 400
  x: 100
  y: 100
  opacity: 0.9
```

## Complete Minimal Form

A starting template for new forms:

```yml
schema:
  type: object
  properties:
    field1:
      type: string
  required:
    - field1

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/field1"
      label: Field Label

data:
  field1: ""

template: |
  {{field1}}
```
