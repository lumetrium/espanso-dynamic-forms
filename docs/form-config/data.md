---
outline: [1, 4]
---

# data
The `data` top-level key of the [form config](./index) defines default values for form fields. 
These defaults can be static values or dynamic expressions that are evaluated when the form loads.

> [!note] Optional Section
> If omitted, all fields start with empty or null values based on their schema types.


## Basic Structure

```yml
data:
  fieldName: "static value"
  anotherField: 42
  checkboxes: []
  dynamicField: "{{clipboard}}"
  dateField: "{{ 'now' | date: '%Y-%m-%d' }}"
```


## Static Default Values

Static defaults are literal values assigned to form fields. They match the data types defined in the [`schema`](./schema).

|Data Type|Example Default Value|
|---|---|
|String|`myField: "Hello World"`|
|Number|`quantity: 10`|
|Boolean|`enabled: true`|
|Array (empty)|`selections: []`|
|Array (with values)|`tags: ["tag1", "tag2"]`|
|Object|`config: { key: "value" }`|

**Example:**

```yml
data:
  taskType: discuss
  language: typescript
  requirements:
    - No regressions to existing behavior
    - Match existing code style in the file
```

## Special Token System

Special tokens are dynamic expressions enclosed in double curly braces `{{ }}` that are evaluated at form initialization. 
Espanso Dynamic Forms processes these tokens using the [Liquid template engine](../liquid/) before the form renders.

### Clipboard Token

The `{{clipboard}}` token inserts the current system clipboard text content as the default value for a field:

```yml
data:
  code: "{{clipboard}}"
  content: "{{clipboard}}"
  message: "{{clipboard}}"
```

### Environment Variable Tokens
The <code v-pre>{{env.VARIABLE_NAME}}</code> token accesses environment variables passed to the application via CLI arguments or system environment:

```yml
data:
  username: "{{env.USER}}"
  locale: "{{env.LOCALE}}"
  projectPath: "{{env.PROJECT_DIR}}"
```

### Date and Time Tokens

Date tokens use Liquid's `date` filter to format timestamps. 
The special value `'now'` represents the current date/time.

#### Current Date/Time

```yml
data:
  mydate: "{{ 'now' | date: '%Y-%m-%d' }}"
  timestamp: "{{ 'now' | date: '%Y-%m-%d %H:%M:%S' }}"
  today: "{{ 'now' | date: '%A, %B %d, %Y' }}"
```

#### Date Format Patterns

Common format patterns follow [Shopify Liquid date filter syntax](https://shopify.github.io/liquid/filters/date/):

|Pattern|Description|Example Output|
|---|---|---|
|`%Y`|Year (4 digits)|2024|
|`%m`|Month (01-12)|03|
|`%d`|Day (01-31)|15|
|`%A`|Weekday name|Monday|
|`%B`|Month name|March|
|`%H`|Hour (00-23)|14|
|`%M`|Minute (00-59)|30|
|`%S`|Second (00-59)|45|

Example from `date.yml`:

```yml
data:
  mydate: "{{ 'now' | date: '%Y-%m-%d' }}"

template: |
  My special date is {{ mydate | date: "%A – %Y • %b • %d" }}
```

This sets the default to today's date in ISO format (e.g., "2024-03-15"), which can then be reformatted in the template.

## Advanced Token Patterns

### Combining Tokens with Static Text

```yml
data:
  greeting: "Hello {{env.USER}}, your clipboard contains: {{clipboard}}"
  filename: "{{env.PROJECT_NAME}}_{{ 'now' | date: '%Y%m%d' }}.txt"
```

### Conditional Defaults

```yml
data:
  code: "{{clipboard}}"
  language: "{% if clipboard contains 'function' %}javascript{% else %}typescript{% endif %}"
```

### Nested Field References

```yml
data:
  firstName: "John"
  lastName: "Doe"
  fullName: "{{firstName}} {{lastName}}"
```

## Complete Example

Here is a comprehensive example showing all token types:

```yml
schema:
  type: object
  properties:
    username:
      type: string
    clipboardContent:
      type: string
    currentDate:
      type: string
    projectInfo:
      type: string

data:
  # Environment variable token
  username: "{{env.USER}}"
  
  # Clipboard token
  clipboardContent: "{{clipboard}}"
  
  # Date token with filter
  currentDate: "{{ 'now' | date: '%Y-%m-%d' }}"
  
  # Combined tokens with static text
  projectInfo: "User {{env.USER}} working on {{env.PROJECT_NAME}} at {{ 'now' | date: '%H:%M' }}"
```

Processing Result (example):

```yml
username: "john_doe",
clipboardContent: "some copied text",
currentDate: "2024-03-15",
projectInfo: "User john_doe working on MyProject at 14:30"
```

### Missing Environment Variables

If an environment variable doesn't exist, Liquid renders the token as an empty string:

```yml
data:
  value: "{{env.NONEXISTENT}}"  # Results in ""
  combined: "User: {{env.MISSING_VAR}}"  # Results in "User: "
```

