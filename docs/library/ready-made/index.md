---
outline: [1, 4]
---

# Ready-Made Forms

These are complete, working form configurations included with Espanso Dynamic Forms. Use them directly, study how they work, or customize them for your own needs.

## Available Forms

### Getting Started
- **[Demo](./demo)** — A simple form to test your installation

### Productivity
- **[Code Assistance](./code)** — Get help with code from AI assistants
- **[Code Questions](./code2)** — Multi-question form for extended AI coding sessions
- **[AI Debug](./ai-debug)** — AI methodology prompts when debugging
- **[AI Code Style](./ai-codestyle)** — AI scope, quality, and communication prompts when coding
- **[Email](./email)** — Draft follow-up emails quickly
- **[Reply](./reply)** — Compose thoughtful message replies

### Data & Files
- **[Date Picker](./date)** — Insert formatted dates
- **[Checkbox](./checkbox)** — Create multi-select checklists
- **[File Upload](./file)** — Process single and multiple files
- **[Files (Advanced)](./files)** — Batch file processing with customizable templates

### Code Generation
- **[Code Generator](./codegen)** — Generate C# EventArgs classes

## How to Use These Forms

Each form can be launched with an Espanso trigger. The basic pattern is:

```yml
matches:
  - trigger: ':formname'
    replace: '{{output}}'
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/formname.yml
```

Replace `formname` with the actual form filename (e.g., `demo`, `code`, `email`).

> [!TIP] Linux users
> Replace the Windows executable path with `/usr/bin/edf`
