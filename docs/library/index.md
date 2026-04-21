---
outline: [1, 4]
---

# Forms Library

Forms Library is a collection of ready-to-use form configurations bundled with Espanso Dynamic Forms. Use them as-is, customize them, or study them to learn how to build your own forms.

## What's Included

The library is organized into three sections:

| Section | Purpose                                                                                          |
|---------|--------------------------------------------------------------------------------------------------|
| **[Ready-Made Forms](./ready-made/)** | Complete, working forms for common tasks like code assistance, email drafting, and file handling |
| **[Boilerplate Snippets](./boilerplate/)** | Copy-paste building blocks for creating your own forms                                           |
| **[Form Factory](./factory/)** | AI-powered form generator: describe what you need, get a prompt that generates a complete config |

## Using Library Forms

Bundled forms live in `EDF_FORMS`; use `{{env.EDF_FORMS}}` in Espanso triggers to reference that path.

### Quick Start

Add this trigger to your Espanso config to try the demo form:

```yml
matches:
  - trigger: ':demo'
    replace: '{{output}}'
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/demo.yml
```

> [!TIP] Try different forms
> Replace `demo.yml` with any form name from the [Ready-Made Forms](./ready-made/) section (e.g., `code.yml`, `email.yml`, `files.yml`).

## Available Forms

| Form | Best For |
|------|----------|
| [Demo](./ready-made/demo) | Testing your installation |
| [Code Assistance](./ready-made/code) | Getting help with code from AI |
| [Email](./ready-made/email) | Drafting follow-up emails |
| [Reply](./ready-made/reply) | Composing message replies |
| [Date Picker](./ready-made/date) | Inserting formatted dates |
| [Checkbox](./ready-made/checkbox) | Multi-select checklists |
| [File Upload](./ready-made/file) | Processing file contents |
| [Files (Advanced)](./ready-made/files) | Batch file processing with templates |
| [Code Generator](./ready-made/codegen) | Generating C# event code |

## Customizing Forms

You can customize any library form by:

1. **Copying form file** to your own location
2. **Editing YAML** to match your needs
3. **Updating your trigger** to point to your custom copy

```yml
# Point to your customized version
- --form-config
- C:/my-forms/custom-email.yml
```

See [Form Config](../form-config/) for documentation on all available options.
