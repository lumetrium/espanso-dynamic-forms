---
outline: [1, 4]
---

# template
The `template` top-level key of the [form config](./index) defines a [Liquid template](../liquid/) that generates the final output when the form is submitted.
This output is then returned to Espanso for insertion at the cursor position.

This template can include static text, dynamic expressions, and references to form field values.
All properties defined in the form's [`schema`](./schema.md) section become available as variables in the template context.

> [!warning] Required Section
> This section is **mandatory**. Every form config must include a valid `template` definition.

## Basic Structure

```yml
template: |
  Subject: {{subject}}
  Priority: {{priority | upcase}}
	
  Hi {{contact_name | capitalize}},
	
  Just following up on our conversation about {{subject}}.
```



## Best Practices

| Practice | Rationale | Example |
|----------|-----------|---------|
| Check for `blank` before rendering | Prevents empty sections in output | `{% if code != blank %}` |
| Use `size > 0` for arrays | Ensures array has content | `{% if array.size > 0 %}` |
| Filter empty strings from arrays | Creates clean lists | `where_exp: "item", "item != ''"` |
| Assign complex expressions | Improves readability | `{% assign filtered = arr \| where_exp: ... %}` |
| Use case for multiple branches | Cleaner than multiple if/elsif | `{% case taskType %}` |
| Handle first-item logic in loops | Controls delimiters properly | `{% assign firstParam = true %}` |





