---
outline: [1, 4]
---

# Reply Form

A form for crafting thoughtful replies to messages, emails, posts, or comments with AI assistance.

**Source:** [`reply.yml`](https://github.com/lumetrium/espanso-dynamic-forms/blob/master/public/forms/reply.yml)

@[youtube](3x84gbDBK8E)

## What It Does

This form helps you compose replies by capturing the original content, your draft response, and style preferences. It's designed to work with AI assistants by formatting a structured prompt. It demonstrates:

- Tabbed interface with three categories (Content, Style, Convo)
- Inline radio buttons for content type
- Checkbox-based style guidelines with predefined options
- Custom guidelines array for additional preferences
- Conversation context field for threading
- Conditional output sections with merged guidelines

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
- Keep it under 100 words
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
    styleGuidelines:
      type: array
      items:
        type: string
        enum:
          - Use a conversational, slightly informal style with simple language
          - Use contractions like "you're" and "don't"
          - Prioritize clarity with simple sentence structure
          - Use a professional and formal tone
          - Use a friendly and approachable style
          - Use active voice instead of passive
          - Match the original sender's formality level
      uniqueItems: true
    customGuidelines:
      type: array
      items:
        type: string
    context:
      type: string
    convo:
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
        - type: VerticalLayout
          elements:
            - type: Control
              scope: "#/properties/styleGuidelines"
              label: Style guidelines
              options:
                format: checkbox
                vuetify:
                  v-input:
                    class: vertical
            - type: Control
              scope: "#/properties/customGuidelines"
              label: Custom guidelines
    - type: Category
      label: Convo
      elements:
        - type: VerticalLayout
          elements:
            - type: Control
              scope: "#/properties/convo"
              label: Entire conversation (if applicable)
              options:
                multi: true
                vuetify:
                  v-textarea:
                    rows: 15
                    autoGrow: true

data:
  type: message
  content: "{{clipboard}}"
  styleGuidelines:
    - Use a conversational, slightly informal style with simple language
    - Use contractions like "you're" and "don't"
    - Prioritize clarity with simple sentence structure
  customGuidelines:
    - ""

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
  {% assign allGuidelines = styleGuidelines | concat: customGuidelines %}
  {% assign filteredGuidelines = allGuidelines | where_exp: "item", "item != ''" %}
  {% if filteredGuidelines.size > 0 %}
  Style guidelines:
  - {{filteredGuidelines | join: '\n- '}}
  {% endif %}
  {% if convo %}
  Here is the entire conversation for context:
  ```
  {{convo}}
  ```
  {% endif %}
  {% if context %}
  Additional context:
  ```
  {{context}}
  ```
  {% endif %}
`````

## Key Features

### Three-Tab Interface
The form uses `Categorization` to organize fields into three tabs:

```yml
uischema:
  type: Categorization
  elements:
    - type: Category
      label: Content   # Main content and draft
    - type: Category
      label: Style     # Writing style preferences
    - type: Category
      label: Convo     # Full conversation context
```

### Checkbox Style Guidelines
Predefined style options displayed as checkboxes with `uniqueItems` to prevent duplicates:

```yml
styleGuidelines:
  type: array
  items:
    type: string
    enum:
      - Use a conversational, slightly informal style with simple language
      - Use a professional and formal tone
      - Match the original sender's formality level
  uniqueItems: true
```

### Custom Guidelines
Add your own guidelines beyond the predefined options:

```yml
customGuidelines:
  type: array
  items:
    type: string
```

### Merged Guidelines in Template
The template combines both `styleGuidelines` and `customGuidelines`, filtering out empty entries:

```liquid
{% assign allGuidelines = styleGuidelines | concat: customGuidelines %}
{% assign filteredGuidelines = allGuidelines | where_exp: "item", "item != ''" %}
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
- Expand the predefined style guidelines enum with more options
