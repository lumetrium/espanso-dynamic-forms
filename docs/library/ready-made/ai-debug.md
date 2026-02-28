---
outline: [1, 4]
---

# AI Debug

A form for picking AI methodology prompts when debugging. Use when investigating bugs, tracing execution, or hunting root causes.

**Source:** [`ai-debug.yml`](https://github.com/lumetrium/espanso-dynamic-forms/blob/master/public/forms/ai-debug.yml)

## What It Does

This form lets you quickly select problem-solving methodology instructions to paste into an AI chat. It includes:

- Multi-select checkboxes for methodology options (first option preselected)
- Optional custom prompt field for your own guidelines
- Output as a clean bullet list

## Use Case

When you're debugging and want the AI to follow a systematic approach—e.g., reflect on possible causes before jumping to a fix, or add logs to validate hypotheses before implementing.

**Example output:**
```
- Reflect on 5-7 different possible sources of the problem, distill those down to 1-2 most likely sources, and then add logs to validate your assumptions before we move onto implementing the actual code fix
- Walk through the code execution step by step: what each part does, expected vs actual. Report any place where your explanation becomes unclear—that may be the bug location
```

## Methodology Options

All options assume you run the app and share results—the AI suggests diagnostic steps, you execute them.

| Option | Purpose |
|--------|---------|
| Reflect on 5-7 sources... | Consider multiple hypotheses, narrow to 1-2 likely, suggest logs to validate before fixing |
| Generate hypotheses + suggest steps | Propose causes, suggest what you can run (logs, tests); no fix until you report evidence |
| Hypothesis + logs I run | AI states hypothesis and where to log; you run and share output; no fix without that evidence |
| Binary search (I test) | AI suggests bisection points (code to disable, inputs to try); you test and report which half fails |
| Explain step by step | Walk through code mentally; unclear spots often reveal bug location (no runtime) |
| 5 Whys | Ask Why until root cause; fix that, not symptoms (no runtime) |
| Reason backwards | Start from error, infer causes, examine recent changes (no runtime) |

## Espanso Trigger

```yml
matches:
  - trigger: ':aidebug'
    replace: '{{output}}'
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/ai-debug.yml
```

> [!TIP] Linux users: Replace the Windows path with `/usr/bin/edf`
