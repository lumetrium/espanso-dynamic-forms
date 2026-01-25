---
outline: [1, 4]
---

# Code Questions Form

A multi-question form designed for extended AI coding sessions. Ask up to 10 questions with code snippets, add optional details like error messages and stack traces, and specify requirements—all in one prompt.

**Source:** [`code2.yml`](https://github.com/lumetrium/espanso-dynamic-forms/blob/master/public/forms/code2.yml)


@[youtube](Q66VfBL6Uwg)

## What It Does

This form facilitates complex, multi-step coding conversations with AI assistants. Instead of submitting one question at a time, you can structure an entire discussion with multiple questions and corresponding code blocks. It demonstrates:

- Four-tab categorization layout
- Multiple question/code textarea pairs
- Conditional visibility with enable toggles
- Dropdown selects for language and framework
- Checkbox arrays for standard requirements
- Dynamic arrays for custom requirements
- File uploads for context
- Complex Liquid template with conditionals

## Use Case

When you have multiple related questions about code (perhaps spanning different files or aspects of the same problem) this form lets you structure everything in a single, coherent prompt. 
Copy your primary code to the clipboard, trigger the form, and build out your full request.

**Example output:**
`````
Why is this TypeScript component not updating when the data changes?

````
export default defineComponent({
  // ... your code here
});
````

I've also tried using computed properties instead:

````
const filteredList = computed(() => {
  return items.value.filter(x => x.active);
});
````

## Details

**Language:** typescript
**Framework:** vue3

### Expected Behavior
The list should update automatically when items change.

## Requirements
- No regressions to existing behavior
- Match existing code style in the file
- Keep functions small and focused
`````

## Form Structure

The form is organized into four tabs:

| Tab | Purpose |
|-----|---------|
| **Questions & Code** | Up to 10 question/code pairs for extended discussions |
| **Optional Details** | Language, framework, error messages, stack traces, expected behavior |
| **Requirements** | Standard coding requirements + custom additions |
| **Files** | Upload context files to include in the prompt |


## Form Configuration (Summary)

Here are the key sections:

### Schema Highlights

```yml
schema:
  type: object
  properties:
    question1:
      type: string
    code1:
      type: string
    # ... up to question10/code10
    enableOptionalDetails:
      type: boolean
    language:
      type: string
      enum: [typescript, javascript, html, css, scss, yaml, json, postgresql, sql, other]
    framework:
      type: string
      enum: [none, vue3, nestjs, nodejs, other]
    errorMessage:
      type: string
    stackTrace:
      type: string
    expectedBehavior:
      type: string
    additionalContext:
      type: string
    enableRequirements:
      type: boolean
    standardRequirements:
      type: array
      items:
        type: string
        enum:
          - No regressions to existing behavior
          - Match existing code style in the file
          - Keep functions small and focused
          # ...
      uniqueItems: true
    customRequirements:
      type: array
      items:
        type: string
    contextFiles:
      type: array
      format: file
```

### UI Schema Structure

```yml
uischema:
  type: Categorization
  elements:
    - type: Category
      label: Questions & Code
      # 10 question/code textarea pairs
    - type: Category
      label: Optional Details
      # Toggle-enabled language, framework, error, stack trace, expected behavior
    - type: Category
      label: Requirements
      # Toggle-enabled standard and custom requirements
    - type: Category
      label: Files
      # File upload control
```

### Template Logic

The template renders only non-empty fields:

`````yml
{% if question1 != blank %}
{{ question1 }}

{% endif %}
{% if code1 != blank %}
````
{{ code1 }}
````

{% endif %}
`````

## Key Features

### Conditional Sections

Optional details and requirements are hidden by default and enabled via toggles:

```yml
- type: Control
  scope: "#/properties/enableOptionalDetails"
  label: Enable optional details section
- type: HorizontalLayout
  rule:
    effect: ENABLE
    condition:
      scope: "#/properties/enableOptionalDetails"
      schema:
        const: true
```

### Clipboard Integration

The first code field auto-populates with clipboard contents:

```yml
data:
  code1: "{{clipboard}}"
```

### Multi-Row Textareas

Questions use compact 3-row textareas, while code blocks use larger 10-row fixed-height areas:

```yml
options:
  multi: true
  vuetify:
    v-textarea:
      rows: 10
      autoGrow: false
```

## Espanso Trigger

```yml
matches:
  - trigger: ':code2'
    replace: '{{output}}'
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/code2.yml
```

## Customization Ideas

- Reduce the number of question/code pairs if you typically need fewer
- Add more languages or frameworks to the enum lists
- Customize the default requirements for your team's coding standards
- Pre-populate language and framework based on your most common stack
- Add custom sections like "related documentation" or "previous attempts"
