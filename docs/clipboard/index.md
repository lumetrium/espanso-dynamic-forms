---
outline: [1, 4]
---

# Clipboard

Espanso Dynamic Forms reads your system clipboard when a form opens and makes its contents available via `{{clipboard}}`. This lets you pre-fill fields or include copied text in your output.

> [!NOTE] The clipboard is read once
> The clipboard is captured when the form first opens. If you copy new text while the form is open, `{{clipboard}}` still contains the original value.

## Using Clipboard in Forms

You can use `{{clipboard}}` in both `data` and `template` sections of your form config.

### Pre-filling Form Fields

```yml
schema:
  type: object
  properties:
    myAwesomeFormField:
      type: string

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/myAwesomeFormField"

data:
  myAwesomeFormField: "My clipboard contents: {{clipboard}}"  # default value

template: |
  Output from form field: {{myAwesomeFormField}}
  Or use clipboard in template directly: {{clipboard}}
  
```

In this example, `myAwesomeFormField` is pre-populated 
with the current system clipboard contents.

When the form is displayed, you will see whatever text was in your 
clipboard as default input.

In the `template` section, the clipboard contents are also inserted
directly into the output.

### Using Clipboard in Espanso Triggers

You can also reference `{{clipboard}}` in your Espanso trigger
when launching Espanso Dynamic Forms inside `--form-config`, like so:

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
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - \{\{clipboard}}
```

This example assumes your clipboard contains the path to your form config file.
In the real world, you'd likely want to check for certain 
keywords in the clipboard using [Liquid conditionals](../liquid/#tags),
and then build the form config path based on that, for example:

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
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - |-
              {%- if clipboard contains "@" and clipboard contains "." -%}
              C:/forms/email-composer.yml
              {%- elsif clipboard contains "https://" or clipboard contains "http://" -%}
              C:/forms/url-shortener.yml
              {%- elsif clipboard contains "TODO" or clipboard contains "FIXME" -%}
              C:/forms/task-creator.yml
              {%- else -%}
              C:/forms/universal-form.yml
              {%- endif -%}
```

## Conclusion
`{{clipboard}}` in Espanso Dynamic Forms lets you easily
access and use the system clipboard contents in forms and templates,
enabling dynamic and context-aware form generation based on clipboard data.

Remember that the clipboard is only read on launch, so if you change the clipboard contents
while the form is open, those changes will NOT be reflected in your templates.

