---
outline: [1, 4]
---

# AI Code Style

A form for picking AI style and communication prompts when coding. Use when writing code, refactoring, adding features, or doing reviews.

**Source:** [`ai-codestyle.yml`](https://github.com/lumetrium/espanso-dynamic-forms/blob/master/public/forms/ai-codestyle.yml)

## What It Does

This form lets you quickly select scope, quality, and communication instructions to paste into an AI chat. It includes:

- Scope control options (minimum code, no sweeping changes, etc.)
- Code quality preferences (precise, modular, no regressions, etc.)
- Communication preferences (tell me clearly, ask before destructive changes, etc.)

## Use Case

When you want to constrain how the AI writes or modifies code—e.g., minimal changes only, clear communication about follow-up steps, or matching existing style.

**Example output:**
```
Follow these guidelines:

- Write the absolute minimum code required
- No sweeping changes - focus on just the task
- Don't break existing functionality
- If I need to do anything (add file, setup config), tell me clearly
```

## Prompt Categories

**Scope control:** Minimum code, no sweeping changes, no unrelated edits, one change at a time, small diffs

**Code quality:** Precise/modular/testable, no regressions, match existing style, clear names, backward compatible, avoid new dependencies

**Communication:** Tell me clearly if I need to do anything, ask before destructive changes, brief explanations, before/after when refactoring, be concise, list assumptions

## Espanso Trigger

```yml
matches:
  - trigger: ':aicodestyle'
    replace: '{{output}}'
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/ai-codestyle.yml
```

> [!TIP] Linux users: Replace the Windows path with `/usr/bin/edf`
