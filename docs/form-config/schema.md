---
outline: [1, 4]
---

# schema

The `schema` top-level key of the [form config](./index) defines the form fields, their types, and validation rules.

It's processed by the [JSON Forms](../json-forms/) core library and [AJV validator](https://ajv.js.org) to generate form controls and enforce validation rules.
All form definitions begin with a root object that contains properties defining each form field.

> [!warning] Required Section
> This section is **mandatory**. Every form config must include a valid `schema` definition.

## Root Schema Structure
Every form schema must define a root object with properties:
```yml
schema:
  type: object
  properties:
    # field definitions here
  required:
    # optional array of required field names
```

Each property in the `properties` object defines a form field that will be 
used in [`uischema`](./uischema), [`data`](./data), and [`template`](./template) sections of the form config.

## Example Schema

Here is an example schema defining a simple form with three fields: `name`, `age`, and `gender`,
where `name` is a required field with length validation, `age` is a number with value constraints,
and `gender` is a string with predefined options:

```yml
schema:
  type: object # The schema is an object
  properties: # Here we define the form fields
    name: # Field name
      type: string # Field type
      minLength: 2 # Minimum length validation
      maxLength: 50 # Maximum length validation
    age:
      type: number
      minimum: 0 # Minimum value validation
      maximum: 120 # Maximum value validation
    gender:
      type: string
      enum: # Allowed values
        - Male
        - Female
  required: # List of required fields
    - name
```

## Field Types

The schema supports standard JSON Schema primitive types. 

Using the correct type is important - it determines how the field is rendered in the form,
what kind of data it accepts, how it's validated, and what you eventually get in the [`template`](./template) section.

|Type|Description|Example Usage|
|---|---|---|
|`string`|Text input, textarea, or selection|Subject line, error message, code snippet|
|`number`|Numeric input with decimal values|Price, rating, percentage|
|`integer`|Whole number input|Count, index, ID|
|`boolean`|Checkbox for true/false values|Enable feature, accept terms|
|`array`|Collection of items (checkboxes, multi-select, or dynamic lists)|Selected options, file uploads, variable definitions|
|`object`|Nested structure for complex data|Address, configuration block|

> [!note] Avj JSON Schema Data Types
> For all allowed types and their configurations, refer to the [Avj JSON schema data types](https://ajv.js.org/json-schema.html#json-data-type).

### String Fields

String fields are the most common type and can be rendered as single-line text inputs, multi-line textareas, or selection controls.

```yml
properties:
  subject:
    type: string
  description:
    type: string
```

### Array Fields

Arrays support two patterns: collections of primitives (for multi-select controls) and collections of objects (for dynamic lists):

#### Array of Strings with Enum
```yml
properties:
	selections:
		type: array
		items:
			type: string
			enum:
				- First choice
				- Second choice
				- Third choice
		uniqueItems: true
```

#### Array of Objects
```yml
properties:
	variables:
		type: array
		items:
			type: object
			properties:
				type:
					type: string
				name:
					type: string
```


## Enum-Based Selection Controls

Enums define the options for selection controls. 
The presentation (dropdown, radio buttons, or checkboxes) is controlled 
by the [UI schema](./uischema), but the allowed values are defined in the schema:

### String Enum (Single Selection)
This creates a set of mutually exclusive options. 
The UI schema determines whether they render as a dropdown (`format: select`) or radio buttons (`format: radio`):

```yml
properties:
  taskType:
    type: string
    enum:
      - discuss
      - explain
      - fix
      - improve
```



### Array Enum (Multiple Selection)
This enables multi-select controls (typically checkboxes). The `uniqueItems: true` constraint prevents duplicate selections:

```yml
properties:
  requirements:
    type: array
    items:
      type: string
      enum:
        - No regressions to existing behavior
        - Match existing code style in the file
        - Keep functions small and focused
    uniqueItems: true
```

## Nested Objects in Arrays

For dynamic lists where users can add/remove entries with multiple fields:

```yml
properties:
  variables:
    type: array
    items:
      type: object
      properties:
        type:
          type: string
        name:
          type: string
```


### Formats
The format keyword provides semantic meaning to field types, enabling specialized UI controls and validation:

|Format|Description|Rendered Control|Example|
|---|---|---|---|
|`date`|Date value (ISO 8601)|Date picker|`format: date`|
|`time`|Time value|Time picker|`format: time`|
|`date-time`|Combined date and time|Date-time picker|`format: date-time`|
|`email`|Email address|Email input with validation|`format: email`|
|`file`|File upload (custom EDF extension)|File upload control|`type: array, format: file`|

#### Date Format
This renders an input field with a calendar icon, which opens a date picker when clicked:
```yml
properties:
	mydate:
		type: string
		format: date
```

> [!note] Date Format Options
> See [this example form](https://github.com/lumetrium/espanso-dynamic-forms/blob/c4a22630/public/forms/date.yml#L1-L7) for date formatting options.

#### File Format
The `file` format is a custom extension in Espanso Dynamic Forms that allows users to upload files.
It can be used with both `object` and `array` types to handle single or multiple file uploads, respectively.

```yml
properties:
	myFiles:
		type: array
		format: file
```

## Common Patterns

### Multi-Line Text Fields

String properties without special formatting become text inputs. The UI schema controls whether they render as single-line or multi-line:

```yml
schema:
  properties:
    issue:
      type: string

uischema:
  elements:
    - type: Control
      scope: '#/properties/issue'
      options:
        multi: true  # renders as textarea
```


### Optional String Arrays for Custom Input

Pattern for allowing users to add custom options beyond predefined enums:

```yml
properties:
  requirements:
    type: array
    items:
      type: string
      enum: [...]
  customRequirements:
    type: array
    items:
      type: string
```

This creates two controls: checkboxes for predefined options and a text input array for custom additions. The `template` can merge them using Liquid: 
```liquid
{% assign allRequirements = requirements | concat: customRequirements %}
```




---

Combining these types with additional keywords changes their look and behavior in the rendered form.
For example, an `array` of `string` type will render as a list of text inputs, 

Espanso Dynamic Forms also defines custom renderer for the `object` and `array` field types when they are combined with `format: file`.
This form config renders a file picker and outputs text content of the selected file on submit:

```yml
schema:
  type: object
  properties:
    myFileFormField:
      type: object
      format: file
      accept: '.txt,.md' # Optional - restrict file types
      
uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/myFileFormField"
  
template: {{ myFileFormField.text }}
```

## Validation

Validation is handled by [Ajv JSON schema validator](https://ajv.js.org), which supports a wide range of validation keywords. 

Some commonly used validation keywords include:

- `required` - to make a field mandatory
- `minLength` and `maxLength` - for string length constraints
- `minimum` and `maximum` - for numeric value constraints
- `pattern` - for regex pattern matching
- `enum` - to restrict values to a predefined list
- `anyOf`, `oneOf`, `allOf` - for complex validation scenarios
- `format` - for specific data formats like email, date, uri, etc.

Refer to the [JSON Schema Validation](https://ajv.js.org/json-schema.html) documentation for a comprehensive list of validation keywords and their usage.
