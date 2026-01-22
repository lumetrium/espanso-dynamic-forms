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

## Official Resources
- [Liquid documentation](https://shopify.github.io/liquid/) – Official documentation for Liquid templating language
- [LiquidJS](https://liquidjs.com/tutorials/intro-to-liquid.html) – JavaScript implementation of Liquid that's used in Espanso Dynamic Forms


