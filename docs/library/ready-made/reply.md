---
outline: [1, 4]
---

# Reply Form

A form for crafting thoughtful replies to messages, emails, posts, or comments with AI assistance.

**Source:** [`reply.yml`](https://github.com/lumetrium/espanso-dynamic-forms/blob/master/public/forms/reply.yml)

![reply.avif](https://media.lumetrium.com/edf/library/reply.avif)

## What It Does

This form helps you compose replies by capturing the original content, your draft response, and style preferences. It's designed to work with AI assistants by formatting a structured prompt. It demonstrates:

- Tabbed interface (Categorization)
- Inline radio buttons
- Array fields for style guidelines
- Conditional output sections

## Use Case

Copy a message, email, or comment to your clipboard, trigger the form, and get a structured prompt you can paste into an AI assistant like ChatGPT, Claude, or Gemini to help craft your reply.

**Example output:**
`````
Help me reply to this email:
```
Hi, I wanted to follow up on our proposal...
```

My draft response:
```
Thanks for reaching out...
```

Style guidelines:
- Use a conversational, slightly informal style with simple language
- Use contractions like "you're" and "don't"
- Prioritize clarity with simple sentence structure
`````

## Form Configuration

`````yml
schema:
  type: object
  properties:
    type:
      type: string
      enum:
        - message
        - email
        - post
        - comment
        - review
    content:
      type: string
      default: "{{clipboard}}"
    draft:
      type: string
    style:
      type: array
      items:
        type: string
    context:
      type: string
  required:
    - type
    - content

uischema:
  type: Categorization
  elements:
    - type: Category
      label: Content
      elements:
        - type: VerticalLayout
          elements:
            - type: Control
              scope: "#/properties/type"
              label: Help me reply to this
              options:
                format: radio
                vuetify:
                  v-radio-group:
                    inline: true
                    hideDetails: true
            - type: Control
              scope: "#/properties/content"
              options:
                multi: true
            - type: Control
              scope: "#/properties/draft"
              label: My draft response
              options:
                multi: true
                vuetify:
                  v-textarea:
                    rows: 10
            - type: Control
              scope: "#/properties/context"
              label: Additional context
              options:
                multi: true
    - type: Category
      label: Style
      elements:
        - type: Control
          scope: "#/properties/style"
          label: Style guidelines

data:
  type: message
  content: "{{clipboard}}"
  style:
    - Use a conversational, slightly informal style with simple language
    - Use contractions like "you're" and "don't"
    - Prioritize clarity with simple sentence structure

template: |
  Help me reply to this {{type}}:
  ```
  {{content}}
  ```
  {% if draft %}
  My draft response:
  ```
  {{draft}}
  ```
  {% endif %}
  {% if style.size > 0 %}
  Style guidelines:
  - {{style | join: '\n- '}}
  {% endif %}
  {% if context %}
  Additional context:
  ```
  {{context}}
  ```
  {% endif %}
`````

## Key Features

### Tabbed Interface
The form uses `Categorization` to organize fields into two tabs:

```yml
uischema:
  type: Categorization
  elements:
    - type: Category
      label: Content
      # ... content fields
    - type: Category
      label: Style
      # ... style fields
```

### Editable Style Guidelines
The style field is an array that users can modify. Default guidelines are provided but can be changed:

```yml
data:
  style:
    - Use a conversational, slightly informal style
    - Use contractions like "you're" and "don't"
    - Prioritize clarity with simple sentence structure
```

### Conditional Template Sections
The template only includes sections that have content:

```yml
{% if draft %}
My draft response:
{{draft}}
{% endif %}
```

## Espanso Trigger

```yml
matches:
  - trigger: ':reply'
    replace: '{{output}}'
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/reply.yml
```

## Customization Ideas

- Add more content types (tweet, slack message, forum post)
- Add a "tone" dropdown (professional, friendly, assertive)
- Include a maximum length preference
- Add a language selector for replies in different languages
- Store your preferred style guidelines as defaults
