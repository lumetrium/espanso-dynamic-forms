---
outline: [1, 4]
---

# Form Elements

Form elements are the building blocks of your forms. They come in two types:

- **Controls** — Input fields that connect to schema properties (text, dropdowns, checkboxes, etc.)
- **Layouts** — Containers that organize how controls are arranged (vertical, horizontal, tabs)

## How Elements Work

Every form has a [`schema`](../form-config/schema) that defines the data structure and a [`uischema`](../form-config/uischema) that defines how to display it.

```yml
schema:
  type: object
  properties:
    name:              # ← Data definition
      type: string

uischema:
  type: VerticalLayout    # ← Layout element
  elements:
    - type: Control       # ← Control element
      scope: "#/properties/name"
```

The schema says "there's a string field called `name`" — the UI schema says "display it as a control inside a vertical layout."

## Element Reference

### [Controls](./controls)

Controls render input fields based on schema types:

| Control | Schema Type | Renders As |
|---------|-------------|------------|
| Text input | `string` | Single-line text field |
| Textarea | `string` + `multi: true` | Multi-line text area |
| Number input | `number` or `integer` | Numeric input |
| Checkbox | `boolean` | Single checkbox |
| Dropdown | `string` + `enum` | Select dropdown |
| Radio buttons | `string` + `enum` + `format: radio` | Radio button group |
| Checkbox group | `array` + `enum` | Multiple checkboxes |
| Date picker | `string` + `format: date` | Calendar picker |
| File upload | `object` or `array` + `format: file` | File selector |
| Slider | `integer` + `slider: true` | Range slider |

See [Controls](./controls) for detailed documentation and examples.

### [Layouts](./layouts)

Layouts organize how controls are arranged:

| Layout | Description |
|--------|-------------|
| `VerticalLayout` | Stack elements top to bottom |
| `HorizontalLayout` | Arrange elements side by side |
| `Categorization` | Tabbed interface |
| `Category` | A single tab within Categorization |

See [Layouts](./layouts) for detailed documentation and nesting examples.

## Common Patterns

### Simple Form

```yml
uischema:
  type: VerticalLayout # Column
  elements: # Column content
    - type: Control
      scope: "#/properties/name"
    - type: Control
      scope: "#/properties/email"
```

### Form with Rows

```yml
uischema:
  type: VerticalLayout # Wrapper
  elements:
    - type: HorizontalLayout # Row
      elements: # Row content
        - type: Control # First column input
          scope: "#/properties/firstName"
        - type: Control # Second column input
          scope: "#/properties/lastName"
    - type: Control # Input below the row
      scope: "#/properties/email"
```

### Tabbed Form

```yml
uischema:
  type: Categorization # Tabs
  elements:
    - type: Category # Tab
      label: Personal
      elements: # Tab content
        - type: Control
          scope: "#/properties/name"
    - type: Category # Tab
      label: Contact
      elements:	# Tab content
        - type: Control
          scope: "#/properties/email"
```

## Learn More

- **[Controls](./controls)** — All control types with options
- **[Layouts](./layouts)** — Layout types and nesting
- **[UI Schema](../form-config/uischema)** — Complete UI schema reference
- **[Boilerplate](../library/boilerplate/)** — Copy-paste snippets
