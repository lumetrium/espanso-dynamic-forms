---
outline: [1, 4]
---

# Conditional Visibility

Conditional visibility lets you show, hide, enable, or disable form elements based on the values of other fields. This creates dynamic forms that adapt to user input.

## How It Works

Add a `rule` property to any UI schema element (control or layout) to make it conditional:

```yml
- type: Control
  scope: "#/properties/email"
  rule:
    effect: SHOW
    condition:
      scope: "#/properties/contactMethod"
      schema:
        const: email
```

This control only appears when `contactMethod` equals `"email"`.

## Rule Structure

```yml
rule:
  effect: SHOW | HIDE | ENABLE | DISABLE
  condition:
    scope: "#/properties/fieldName"
    schema:
      # JSON Schema to match
```

| Property | Description |
|----------|-------------|
| `effect` | What happens when condition is true |
| `condition.scope` | Field to evaluate |
| `condition.schema` | JSON Schema the field must match |

## Effects

| Effect | When Condition is True | When Condition is False |
|--------|------------------------|-------------------------|
| `SHOW` | Element is visible | Element is hidden |
| `HIDE` | Element is hidden | Element is visible |
| `ENABLE` | Element is editable | Element is disabled |
| `DISABLE` | Element is disabled | Element is editable |

## Condition Schemas

The `condition.schema` property supports standard JSON Schema validation keywords.

### Supported Keywords

| Keyword | Description | Use Case |
|---------|-------------|----------|
| `const` | Matches exact value | Checkboxes, exact enum matches |
| `enum` | Matches one of several values | Multi-option fields |
| `minLength` | Minimum string length | Check if text input has content |
| `minProperties` | Min object properties | Check if file is uploaded |
| `minimum` | Minimum number value | Range checks |
| `maximum` | Maximum number value | Range checks |
| `pattern` | Regex pattern | Complex string matching |
| `type` | Data type check | Check if value is string/number/etc |

### Match Exact Value

Show when field equals a specific value:

```yml
condition:
  scope: "#/properties/type"
  schema:
    const: email
```

### Match Any of Multiple Values

Show when field is one of several values:

```yml
condition:
  scope: "#/properties/layout"
  schema:
    enum:
      - multi-tab
      - stepper
```

### Match Boolean True

Show when checkbox is checked:

```yml
condition:
  scope: "#/properties/showAdvanced"
  schema:
    const: true
```

### Match Non-Empty Object

Show when a file is uploaded:

```yml
condition:
  scope: "#/properties/uploadedFile"
  schema:
    type: object
    minProperties: 1
```

### Match Non-Empty String

Show when text field has content:

```yml
condition:
  scope: "#/properties/comments"
  schema:
    type: string
    minLength: 1
```

## Examples

### Show Field Based on Checkbox

```yml
schema:
  type: object
  properties:
    includeNotes:
      type: boolean
    notes:
      type: string

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/includeNotes"
      label: Include additional notes?
    - type: Control
      scope: "#/properties/notes"
      label: Notes
      options:
        multi: true
      rule:
        effect: SHOW
        condition:
          scope: "#/properties/includeNotes"
          schema:
            const: true
```

### Show Different Fields Based on Selection

```yml
schema:
  type: object
  properties:
    contactMethod:
      type: string
      enum:
        - email
        - phone
        - mail
    email:
      type: string
    phone:
      type: string
    address:
      type: string

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/contactMethod"
      label: Preferred Contact Method
      options:
        format: radio
    
    - type: Control
      scope: "#/properties/email"
      label: Email Address
      rule:
        effect: SHOW
        condition:
          scope: "#/properties/contactMethod"
          schema:
            const: email
    
    - type: Control
      scope: "#/properties/phone"
      label: Phone Number
      rule:
        effect: SHOW
        condition:
          scope: "#/properties/contactMethod"
          schema:
            const: phone
    
    - type: Control
      scope: "#/properties/address"
      label: Mailing Address
      options:
        multi: true
      rule:
        effect: SHOW
        condition:
          scope: "#/properties/contactMethod"
          schema:
            const: mail
```

### Hide When File Uploaded

From the Form Factory, hide text input when file is uploaded:

```yml
- type: Control
  scope: "#/properties/existingConfigText"
  rule:
    effect: HIDE
    condition:
      scope: "#/properties/existingConfigFile"
      schema:
        type: object
        minProperties: 1
```

### Show Tab Limit for Multi-Tab Layouts

```yml
- type: Control
  scope: "#/properties/maxTabs"
  options:
    slider: true
  rule:
    effect: SHOW
    condition:
      scope: "#/properties/layout"
      schema:
        enum:
          - multi-tab
          - stepper
```

### Conditional Layout Section

Apply rules to entire layout sections:

```yml
- type: VerticalLayout
  rule:
    effect: SHOW
    condition:
      scope: "#/properties/showAdvancedOptions"
      schema:
        const: true
  elements:
    - type: Control
      scope: "#/properties/advancedOption1"
    - type: Control
      scope: "#/properties/advancedOption2"
    - type: Control
      scope: "#/properties/advancedOption3"
```

## Real-World Example: i18n Toggle

From the Form Factory, show language selection only when i18n is enabled:

```yml
schema:
  properties:
    includeI18n:
      type: boolean
      default: false
    supportedLanguages:
      type: array
      items:
        type: string

uischema:
  elements:
    - type: Control
      scope: "#/properties/includeI18n"
      label: Include Internationalization (i18n)?
    
    - type: Control
      scope: "#/properties/supportedLanguages"
      label: Supported languages
      rule:
        effect: SHOW
        condition:
          scope: "#/properties/includeI18n"
          schema:
            const: true

data:
  includeI18n: false
  supportedLanguages:
    - en
    - de
    - fr
```

## Tips

1. **Use SHOW for optional sections** — Hide by default, show when relevant
2. **Use HIDE for mutual exclusion** — When only one of several options applies
3. **Use ENABLE/DISABLE for dependent fields** — Keep visible but inactive until prerequisites are met
4. **Apply rules to layouts** — Hide/show entire sections at once
5. **Test both states** — Verify behavior when condition is true AND false

## Limitations

- Rules evaluate immediately as fields change
- You cannot create complex AND/OR logic with a single rule
- Nested conditions are not directly supported
- For complex logic, consider using multiple fields or restructuring the form
