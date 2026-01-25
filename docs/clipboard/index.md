---
outline: [1, 4]
---

# Clipboard

Espanso Dynamic Forms reads your system clipboard when the form opens and makes its contents available via the `{{clipboard}}` variable. This lets you pre-fill fields or include copied text in your output.

> [!NOTE] Clipboard is read once
> The clipboard is captured when the form first opens. If you copy new text while the form is open, `{{clipboard}}` still contains the original value.

## Using Clipboard in Forms

You can use `{{clipboard}}` in both the `data` and `template` sections of your form config.

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

In this example, the `myAwesomeFormField` field is pre-populated 
with the current contents of the system clipboard.

When the form is displayed, you will see whatever text was in your 
clipboard as the default input.

In the `template` section, the clipboard contents are also inserted
directly into the output.

### Using Clipboard in Espanso Triggers

You can also reference the `{{clipboard}}` variable in your Espanso trigger
when launching Espanso Dynamic Forms inside the `--form-config` argument, like so:

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

The example above assumes your clipboard contains the path to your form config file.
In the real world, you'd likely want to check for certain 
keywords inside the clipboard using [Liquid conditionals](http://localhost:5172/espanso-dynamic-forms/docs/liquid/#tags),
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
The `{{clipboard}}` variable in Espanso Dynamic Forms allows you to easily
access and utilize the contents of the system clipboard in your forms and templates,
enabling dynamic and context-aware form generation based on clipboard data.

Remember that the clipboard is only read on launch, so if you change the clipboard contents
while the form is open, those changes will NOT be reflected in your templates.

