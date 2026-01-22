---
outline: [2, 4]
---

# Validation

Validation ensures users enter correct data before submitting the form. Espanso Dynamic Forms uses [JSON Schema](https://json-schema.org/) validation powered by [AJV](https://ajv.js.org/).

---

## How Validation Works

Define validation rules in your [`schema`](../form-config/schema). The form automatically:

1. Validates input as users type
2. Shows error messages for invalid fields
3. Prevents submission until all fields are valid

---

## Required Fields

Mark fields that must be filled:

```yml
schema:
  type: object
  properties:
    name:
      type: string
    email:
      type: string
  required:
    - name
    - email
```

> [!NOTE] Required Array
> The `required` array is at the same level as `properties`, not inside individual field definitions.

---

## String Validation

### Minimum and Maximum Length

```yml
username:
  type: string
  minLength: 3
  maxLength: 20
```

### Pattern (Regular Expression)

```yml
email:
  type: string
  pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
```

### Format

Some common formats are built-in:

```yml
email:
  type: string
  format: email

website:
  type: string
  format: uri

birthdate:
  type: string
  format: date
```

| Format | Validates |
|--------|-----------|
| `email` | Email address |
| `uri` | URL |
| `date` | Date (YYYY-MM-DD) |
| `time` | Time (HH:MM:SS) |
| `date-time` | ISO 8601 datetime |

---

## Number Validation

### Minimum and Maximum

```yml
age:
  type: integer
  minimum: 0
  maximum: 120
```

### Exclusive Bounds

```yml
rating:
  type: number
  exclusiveMinimum: 0    # Must be > 0, not >= 0
  exclusiveMaximum: 10   # Must be < 10, not <= 10
```

### Multiple Of

```yml
quantity:
  type: integer
  multipleOf: 5   # Must be 5, 10, 15, etc.
```

---

## Array Validation

### Minimum and Maximum Items

```yml
tags:
  type: array
  items:
    type: string
  minItems: 1
  maxItems: 10
```

### Unique Items

Prevent duplicate selections:

```yml
selections:
  type: array
  items:
    type: string
    enum:
      - Option A
      - Option B
      - Option C
  uniqueItems: true
```

---

## Enum Validation

Restrict to specific values:

```yml
priority:
  type: string
  enum:
    - High
    - Medium
    - Low
```

---

## Complete Validation Example

```yml
schema:
  type: object
  properties:
    username:
      type: string
      minLength: 3
      maxLength: 20
    email:
      type: string
      format: email
    password:
      type: string
      minLength: 8
    age:
      type: integer
      minimum: 13
      maximum: 120
    website:
      type: string
      format: uri
    interests:
      type: array
      items:
        type: string
        enum:
          - Technology
          - Sports
          - Music
          - Art
          - Science
      minItems: 1
      maxItems: 3
      uniqueItems: true
    agreedToTerms:
      type: boolean
      const: true   # Must be true to submit
  required:
    - username
    - email
    - password
    - agreedToTerms
```

---

## Validation Keywords Reference

### String Keywords

| Keyword | Description | Example |
|---------|-------------|---------|
| `minLength` | Minimum character count | `minLength: 3` |
| `maxLength` | Maximum character count | `maxLength: 100` |
| `pattern` | Regex pattern | `pattern: "^[A-Z]"` |
| `format` | Built-in format | `format: email` |

### Number Keywords

| Keyword | Description | Example |
|---------|-------------|---------|
| `minimum` | Minimum value (inclusive) | `minimum: 0` |
| `maximum` | Maximum value (inclusive) | `maximum: 100` |
| `exclusiveMinimum` | Minimum value (exclusive) | `exclusiveMinimum: 0` |
| `exclusiveMaximum` | Maximum value (exclusive) | `exclusiveMaximum: 100` |
| `multipleOf` | Must be divisible by | `multipleOf: 5` |

### Array Keywords

| Keyword | Description | Example |
|---------|-------------|---------|
| `minItems` | Minimum array length | `minItems: 1` |
| `maxItems` | Maximum array length | `maxItems: 10` |
| `uniqueItems` | No duplicates allowed | `uniqueItems: true` |

### General Keywords

| Keyword | Description | Example |
|---------|-------------|---------|
| `enum` | Allowed values | `enum: [A, B, C]` |
| `const` | Must equal this value | `const: true` |
| `default` | Default value | `default: "Hello"` |

---

## Validation Behavior

### Real-Time Validation

Fields are validated as users type. Error messages appear below invalid fields.

### Submit Validation

The form cannot be submitted while validation errors exist. The Submit button remains active, but clicking it scrolls to the first error.

### Optional Fields

Fields not in the `required` array are optional. They're only validated if the user enters a value.

---

## Tips

1. **Be specific with error messages** — Use descriptive patterns
2. **Set reasonable limits** — Don't require 100-character minimums for names
3. **Use format over pattern** — When a built-in format exists
4. **Test edge cases** — Empty strings, zero values, empty arrays
5. **Consider UX** — Don't over-validate; frustration reduces completion rates

---

## Limitations

- Custom error messages are not directly supported (AJV defaults are shown)
- Cross-field validation (field A depends on field B's value) is limited
- Async validation (e.g., checking if username exists) is not supported
- For complex validation needs, consider validating in your template output
