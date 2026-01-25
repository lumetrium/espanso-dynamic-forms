---
outline: [1, 4]
---

# File Upload Form

A form demonstrating single and multiple file uploads with i18n support.

**Source:** [`file.yml`](https://github.com/lumetrium/espanso-dynamic-forms/blob/master/public/forms/file.yml)

## What It Does

This form shows how to handle file uploads in Espanso Dynamic Forms. It demonstrates:

- Single file upload (`type: object, format: file`)
- Multiple file upload (`type: array, format: file`)
- File accept patterns
- Accessing file properties (text, name, size, hash)
- i18n translations for file input labels
- Default file paths using environment variables

## Use Case

Extract content from files, process multiple files, or include file contents in your output. Useful for code review, file listings, or any file-based workflow.

**Example output:**
`````
File contents:
````
# This is the content of date.yml
schema:
  type: object
  ...
````

Multiple files:
````
reply.yml (2205 bytes)
abc123...
````
````
lumetrium.png (15234 bytes)
def456...
````
`````

## Form Configuration

`````yml
schema:
  type: object
  required:
    - singleFile
    - multipleFiles
  properties:
    singleFile:
      type: object
      format: file
      i18n: file
    multipleFiles:
      type: array
      format: file
      i18n: file

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/singleFile"
      options:
        accept: "*"
    - type: Control
      scope: "#/properties/multipleFiles"
      options:
        accept: "image/*, .md"

data:
  singleFile:
    path: "{{env.EDF_FORMS}}/date.yml"
  multipleFiles:
    - path: "{{env.EDF_FORMS}}/reply.yml"
    - path: "{{env.EDF_RESOURCES}}/logos/lumetrium.png"
    - path: "{{env.EDF_RESOURCES}}/logos/definer.png"

i18n:
  en:
    file:
      description: Please upload
      selectedFile: Selected file
      selectedFiles: Selected files
      remove: Remove

template: |
  File contents:
  ````
  {{ singleFile.text }}
  ````

  Multiple files:
  {% for f in multipleFiles %}
  ````
  {{ f.name }} ({{ f.size }} bytes)
  {{ f.hash }}
  ````
  {% endfor %}
`````

## Key Features

### Single File Upload
Use `type: object` with `format: file`:

```yml
singleFile:
  type: object
  format: file
```

### Multiple File Upload
Use `type: array` with `format: file`:

```yml
multipleFiles:
  type: array
  format: file
```

### File Accept Patterns
Control which files can be selected:

```yml
options:
  accept: "*"              # All files
  accept: "image/*"        # All images
  accept: ".md, .txt"      # Specific extensions
  accept: "image/*, .md"   # Combined patterns
```

### File Properties
Access these properties for each file:

| Property | Description |
|----------|-------------|
| `file.text` | Full text content of the file |
| `file.name` | Filename without extension |
| `file.fullName` | Filename with extension |
| `file.extension` | File extension (without dot) |
| `file.size` | File size in bytes |
| `file.hash` | SHA-256 hash of file contents |
| `file.mime` | MIME type |
| `file.path` | Full file path |
| `file.base64` | Binary contents as base64 string |
| `file.dataUrl` | Data URL of the file |

### Pre-loading Files
Set default files using paths:

```yml
data:
  singleFile:
    path: "{{env.EDF_FORMS}}/date.yml"
```

### i18n for File Inputs
Translate file input labels:

```yml
i18n:
  en:
    file:
      description: Please upload
      selectedFile: Selected file
      remove: Remove
```

## Espanso Trigger

```yml
matches:
  - trigger: ':file'
    replace: '{{output}}'
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/file.yml
```

## Customization Ideas

- Accept only specific file types for your workflow
- Add file size validation
- Create a code review form that accepts source files
- Build a file comparison tool with two file inputs
- Output file contents with syntax highlighting hints
