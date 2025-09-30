<h1 align="center">Espanso Dynamic Forms</h1>

<div align="center">

[![](https://img.shields.io/github/v/release/lumetrium/espanso-dynamic-forms?style=for-the-badge)](https://github.com/lumetrium/espanso-dynamic-forms/releases/latest) ![](https://img.shields.io/github/downloads/lumetrium/espanso-dynamic-forms/total?style=for-the-badge) ![GitHub](https://img.shields.io/github/license/lumetrium/espanso-dynamic-forms?style=for-the-badge)

</div>
<br/>

<p align="center">
 Create powerful, interactive forms with JSON Forms and insert the templated output anywhere with Espanso.
</p>
<p align="center">
<img src="https://media.lumetrium.com/definer/other/espanso-dynamic-forms-demo.gif" />
</p>



## About

**Espanso Dynamic Forms** is a helper application that bridges the gap between [Espanso](https://espanso.org/)'s powerful text expansion engine and the sophisticated UI capabilities of [JSON Forms](https://jsonforms.io/).

The workflow:

1. **Trigger**: You type a keyword in any application (e.g., `:email`).
2. **Form Appears**: Espanso runs this application, which displays a rich, interactive form defined by you in either **YAML** or **JSON**.
3. **Fill & Submit**: You fill out the form fields (text inputs, dropdowns, date pickers, etc.) and click "Submit".
4. **Formatted Output**: The app takes your data, formats it using your [Liquid template](https://liquidjs.com), and passes the final text back to Espanso.
5. **Insertion**: Espanso pastes the beautifully formatted text right where you typed your trigger.

This tool allows you to move beyond basic text fields and create dynamic, validated, and user-friendly forms that can generate complex outputs, all within the Espanso ecosystem.

## Feature Highlights
- **Complete JSON Forms Support**: Anything you can do with JSON Forms, you can do here.
- **Advanced Validation**: Required fields, pattern matching (regex), min/max length, and more.
- **Conditional Visibility**: Show or hide form fields based on the values of other fields.
- **Modern UI Components**: Use tabs, date/time pickers, toggles, sliders, and more thanks to the [Vuetify renderer](https://jsonforms.io/docs/renderer-sets#vue-vuetify-renderer-set).
- **Complex Data Structures**: Easily handle arrays and nested objects.
- **Flexible Output**: Use Liquid templating's logic (`if/else`, `case`) and filters to transform your data into any format you need.

## Installation

1. Make sure [Espanso](https://espanso.org/) is installed
2. Download and install **Espanso Dynamic Forms** (this app) from the [releases page](https://github.com/lumetrium/espanso-dynamic-forms/releases)

## Quick Start

### 1. Create an Espanso Trigger

Add this configuration to your Espanso config file (`~/.config/espanso/match/base.yml` on Linux/macOS or `%APPDATA%\espanso\match\base.yml` on Windows):

```yaml
matches:
  - trigger: ":demo"
    replace: "{{output}}"
    backend: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - "C:/Program Files/EspansoDynamicForms/EspansoDynamicForms.exe" # on Linux use "/usr/bin/espanso-dynamic-forms"
            - -- 
            - --form-config
            - "%CONFIG%/forms/demo.yml"
```

### 2. Create a Form Config

Create a form config file at `%CONFIG%/forms/demo.yml`.

It can be named anything and placed anywhere, 
just update the `--form-config` path in the Espanso trigger accordingly.

The config file has four main sections:

- **`schema`** - Defines data structure and validation rules
- **`uischema`** - Defines form layout and UI components
- **`data`** - Sets default values for form fields
- **`template`** - Formats output using [Liquid templating](https://shopify.github.io/liquid/)

<details>
<summary><strong>CLICK HERE TO EXPAND DEMO FORM CONFIG</strong></summary>

````yaml
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
    convo:
      type: string
  required:
    - types
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
  {% if style.length > 0 %}
  Style guidelines:
  - {{style | join: '\n- '}}
  {% endif %}
  {% if context %}
  Additional context:
  ```
  {{context}}
  ```
  {% endif %}
````

</details>

### 3. Try It Out

1. Type `:demo` anywhere in your system
2. Fill out the form that appears
3. Click "Submit" to insert the generated output at your cursor


## Compare
The following examples show a native Espanso form and its equivalent in Espanso Dynamic Forms config.


### Native form example
<details>
<summary><strong>Click here to view a simple native Espanso form</strong></summary>

```yaml
  - trigger: :email
    replace: |
      Subject: {{form1.subject}}
      Priority: {{form1.priority}}
      
      ---
      
      Hi {{form1.contact_name}},

      Just following up on our conversation about {{form1.subject}}.

      Regards,
      Me
    vars:
      - name: "form1"
        type: form
        params:
          layout: |
            Subject: [[subject]]
            Priority: [[priority]]
            Contact name [[contact_name]],
          fields:
            subject:
              type: text
              multiline: false
              default: "{{clipboard}}"
            priority:
              type: choice
              values:
                - High
                - Medium
                - Low
              default: Medium
            contact_name:
              type: text
              multiline: false
              default: ""
```

</details>

### Equivalent with Espanso Dynamic Forms

<details>
<summary><strong>Click here to view Espanso Dynamic Forms version</strong></summary>

```yml
schema:
  type: object
  properties:
    subject:
      type: string
      default: ""
    priority:
      type: string
      enum:
        - High
        - Medium
        - Low
      default: Medium
    contact_name:
      type: string
      default: ""
  required:
    - subject
    - priority
    - contact_name

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/subject"
      label: Subject
      options:
        multi: false
    - type: Control
      scope: "#/properties/priority"
      label: Priority
      options:
        format: radio
    - type: Control
      scope: "#/properties/contact_name"
      label: Contact Name
      options:
        multi: false

data:
  subject: "{{clipboard}}"
  priority: Medium
  contact_name: ""

template: |
  Subject: {{subject}}
  Priority: {{priority | upcase}}
  
  ---
  
  Hi {{contact_name | capitalize}},

  Just following up on our conversation about {{subject}}.

  Regards,
  Me
```

</details>

## Tips and notes
- **Liquid variables**: Any field in your schema becomes available in the template. You can also pass special tokens like `{{clipboard}}` as defaults and then render them.
- **Multiline output**: Use `backend: clipboard` to avoid truncation.

## References
- **Form Syntax**: Learn more about form structure and configuration in the [JSON Forms documentation](https://jsonforms.io/docs)
- **Output Formatting**: Explore [Liquid templating](https://shopify.github.io/liquid/) for dynamic output formatting
- **Trigger Configuration**: Review the [Espanso documentation](https://espanso.org/docs/) for advanced trigger setup
- **UI Components**: Browse [Examples with Vuetify Renderers](https://jsonforms-vuetify-renderers.netlify.app/#/example/main) for component inspiration (note: examples use Vuetify 2, while Espanso Dynamic Forms uses Vuetify 3, but core concepts still apply)
---

**Questions or issues?** Please [open an issue](https://github.com/lumetrium/espanso-dynamic-forms/issues/new) on GitHub.

## Check out my other project

<a href="https://chromewebstore.google.com/detail/definer-popup-dictionary/noagjioaihamoljcbelhdlldnmlgnkon?utm_source=espanso-dynamic-forms&utm_medium=referral&utm_content=readme">
  <img src="./public/logos/definer.png" style="margin-right: 1em" height="40px" align="left"/>
</a>

**[Definer - Popup Translator & Dictionary](https://chromewebstore.google.com/detail/definer-popup-dictionary/noagjioaihamoljcbelhdlldnmlgnkon?utm_source=espanso-dynamic-forms&utm_medium=referral&utm_content=readme)**  
Instant definitions, translations, search, and AI results for words and phrases you select or type.
