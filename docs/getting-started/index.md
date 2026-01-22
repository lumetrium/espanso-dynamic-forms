---
outline: [2, 4]
---

# Getting Started

## Prerequisites
Before using Espanso Dynamic Forms, you must have:

1. [Espanso](https://espanso.org/) installed and running on your system ([GitHub](https://github.com/espanso/espanso))
2. [Espanso Dynamic Forms](https://github.com/lumetrium/espanso-dynamic-forms) installed, see [Installation guide](../install/) for details

## Quick Start 

### 1. Create an Espanso Trigger

Add a trigger configuration to your Espanso config file. The file location varies by platform:

- **Windows**: `%APPDATA%\espanso\match\base.yml`
- **Linux**: `~/.config/espanso/match/base.yml`

Example trigger configuration:

```yml
matches:
  - trigger: ":demo"
    replace: "{{output}}"
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/EspansoDynamicForms/EspansoDynamicForms.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/demo.yml
```

> [!note] Linux
> Use the path `/usr/bin/espanso-dynamic-forms` instead of the Windows path to `.exe` shown above

|Configuration Key|Purpose|
|---|---|
|`trigger`|The text pattern to match (e.g., `:demo`)|
|`replace`|Template for output, uses `{{output}}` variable|
|`force_mode: clipboard`|Required for multiline output insertion|
|`type: script`|Tells Espanso to execute an external program|
|`args`|Command-line arguments passed to the executable|


### 2. Test Demo Form

1. Type `:demo` in any text field (e.g., text editor, browser input)
2. The **Espanso Dynamic Forms** window appears
3. Fill out the form fields
4. Click the **Submit** button
5. The formatted output is inserted at your cursor position

### 3. Create a Custom Form Config

The main power of **Espanso Dynamic Forms** is in creating and using your own custom forms.
So let's create a form config and reference it in the Espanso trigger.

Create a YAML file anywhere and specify the path to it in the `--form-config` argument (e.g., `C:/forms/test.yml`). 
Now, update the trigger to point to your new form config file.

```yml
matches:
  - trigger: ":demo"
    replace: "{{output}}"
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/EspansoDynamicForms/EspansoDynamicForms.exe
            - --form-config
            - C:/forms/test.yml # <-- create a .yml file and put the path here
```

Here's how the example `demo.yml` form config looks:

```yml
schema:
  type: object
  properties:
    subject:
      type: string
    priority:
      type: string
      enum:
        - High
        - Medium
        - Low
  required:
    - subject

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/subject"
      label: Subject
    - type: Control
      scope: "#/properties/priority"
      label: Priority

data:
  subject: "{{clipboard}}"
  priority: Medium

template: |
  Subject: {{subject}}
  Priority: {{priority | upcase}}
```

You can copy the above YAML content into your own config file and tweak it as needed.

| Keyword    | Description                                                                                           |
|------------|---------------------------------------------------------------------------------------------------|
| **schema** | Defines two fields (`subject` as string, `priority` as enum), marks `subject` as required         |
| **uischema** | Arranges fields vertically, each as a `Control` pointing to a schema property via `scope`        |
| **data**   | Sets `subject` to clipboard content, `priority` to "Medium"                                        |
| **template** | Formats output using Liquid syntax, applying `upcase` filter to priority                          |



## Next Steps

After successfully running your first form, explore:

- [Form Definition Structure](https://deepwiki.com/lumetrium/espanso-dynamic-forms/3.1-form-definition-structure) - Deep dive into the four-section configuration format
- [Example Forms Gallery](https://deepwiki.com/lumetrium/espanso-dynamic-forms/5.5-example-forms-gallery) - Browse pre-built forms for common use cases
