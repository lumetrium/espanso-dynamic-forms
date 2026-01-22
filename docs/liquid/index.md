---
outline: [1, 4]
---

# Liquid Templating

Espanso Dynamic Forms uses [LiquidJS](https://liquidjs.com/) to process templates. Liquid is a simple yet powerful template language originally created by Shopify.

You'll use Liquid syntax in two places:
- **[`template`](../form-config/template)** — To format the final output
- **[`data`](../form-config/data)** — To set dynamic default values

You can also use Liquid in the `--form-config` path to dynamically select which form to load.

[IMAGE: Code editor showing a template section with Liquid syntax highlighted in different colors: variables in orange {{name}}, filters in blue | upcase, and control tags in green {% if condition %}]

## Example

Let's define simple form with a single text input field called `myAwesomeFormField`.
When you submit the form, the `template` will be rendered,
using the value entered in `myAwesomeFormField`:

```yaml
schema:
  type: object
  properties:
    myAwesomeFormField:
      type: string

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: '#/properties/myAwesomeFormField'

template: |
	You entered: {{ myAwesomeFormField }}
	Characters count: {{ myAwesomeFormField | size }}
	Word count: {{ myAwesomeFormField | split: ' ' | size }}
	It's uppercase: {{ myAwesomeFormField | upcase }}
```

Let's say you entered "Hello world" in the form field, the output would be:

```text
You entered: Hello world
Characters count: 11
Word count: 2
It's uppercase: HELLO WORLD
```

## Template Data Context
The template has access to all properties defined in the form's [`schema`](../form-config/schema) section.
Each property becomes a variable in the template context, accessible by its name.

You can also access additional built-in objects like [`{{env}}`](../env/) for environment variables and [`{{clipboard}}`](../clipboard/) for clipboard content.



## Template Syntax


|Construct|Syntax|Purpose|Example|
|---|---|---|---|
|**Variable Output**|`{{ variable }}`|Insert variable value|`{{subject}}`|
|**Filters**|`{{ variable \| filter }}`|Transform values|`{{name \| capitalize}}`|
|**Conditionals**|`{% if condition %}...{% endif %}`|Conditional rendering|`{% if draft %}...{% endif %}`|
|**Loops**|`{% for item in array %}...{% endfor %}`|Iterate over arrays|`{% for tag in tags %}...{% endfor %}`|



### Tags

Tags control the logic and flow of the template. 
They are enclosed in `{% %}`. For example:

```liquid
{% if myAwesomeFormField == "Hello" %}
  You said hello!
{% else %}
  You didn't say hello.
{% endif %}
```

There are various tags available in Liquid, such as `if`, `for`, `case`, and more.

### Objects
Object represent the output variables and data. They are enclosed in `{{ }}`.
Objects can be simple values or more complex data structures.

For example, we can use the `env` object that's provided to all
templates by Espanso Dynamic Forms:

```liquid
{{ env.EDF_INSTALLATION_DIR }}
```

> [!note] Environment variables
> Learn more about them on the [Environment variables](../env/) page.

### Filters
Filter modify the output of objects. They are applied using the pipe symbol `|`.
For example:

```liquid
{{ myAwesomeFormField | downcase }}
```

You can chain multiple filters together:

```liquid
{{ myAwesomeFormField | strip | upcase }}
```

## Special Variables

In addition to form field values, these utility variables are always available:

| Variable | Description | Example |
|----------|-------------|---------|
| `newline` | A newline character (`\n`) | `&#123;&#123; items \| join: newline &#125;&#125;` |
| `tab` | A tab character (`\t`) | `&#123;&#123; tab &#125;&#125;Item 1` |

These are useful when you need to insert whitespace characters that are difficult to type directly in YAML.

## Custom Filters

Espanso Dynamic Forms provides these additional filters beyond standard Liquid:

| Filter | Description | Example |
|--------|-------------|---------|
| `url_encode` | URL-encode a string | `{{ query \| url_encode }}` |
| `url_decode` | URL-decode a string | `{{ encoded \| url_decode }}` |
| `render_template` | Render a template string with context | `{{ template \| render_template: file }}` |

### The `render_template` Filter

This filter lets you render a Liquid template stored in a variable:

```yml
{% for file in files %}
{{ myTemplate | render_template: file }}
{% endfor %}
```

The context object (`file` in this case) becomes available inside the template. This is useful for dynamic templates like in the [Files form](../library/ready-made/files).

## Official Resources
- [Liquid documentation](https://shopify.github.io/liquid/) – Official documentation for Liquid templating language
- [LiquidJS](https://liquidjs.com/tutorials/intro-to-liquid.html) – JavaScript implementation of Liquid that's used in Espanso Dynamic Forms

## Debugging Templates

When building complex templates, it's helpful to see exactly what data you're working with.

### Inspecting Data

Use the `json` filter to dump an entire object or variable as a JSON string:

```liquid
{{ variable | json }}
```

**Example:**
To see all available form data:
```liquid
<pre>
{{ self | json }}
</pre>
```
*(Note: `self` refers to the root data object in LiquidJS)*

### Common Errors

- **Missing output:** Check if the variable name matches the schema property exactly (case-sensitive).
- **Whitespace issues:** Use `{%-` and `-%}` to strip whitespace from control tags.
- **Unexpected values:** Use `{{ variable | json }}` to check if you're getting a string, number, or array.
