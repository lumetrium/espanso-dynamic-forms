---
outline: [2, 4]
---

# Use Cases

This page showcases common scenarios where Espanso Dynamic Forms excels. Each use case links to relevant forms from the [Library](../library/) and explains how to adapt them.

---

## AI Prompt Engineering

Create structured prompts that get better results from AI assistants like ChatGPT, Claude, or Gemini.

### Code Assistance

Get help with code—debugging, explaining, refactoring, or writing new code.

**Recommended form:** [Code Assistance](../library/ready-made/code)

**Why it works:**
- Structured format helps AI understand the context
- Task type selection generates appropriate prompts
- File uploads provide complete code context
- Requirements checkboxes set expectations

**Trigger example:**
```yml
- trigger: ':code'
  replace: '{{output}}'
  force_mode: clipboard
  vars:
    - name: output
      type: script
      params:
        args:
          - C:/Program Files/Espanso Dynamic Forms/EspansoDynamicForms.exe
          - --form-config
          - \{\{env.EDF_FORMS}}/code.yml
```

---

### Writing Replies

Compose thoughtful replies to messages, emails, or comments.

**Recommended form:** [Reply](../library/ready-made/reply)

**Why it works:**
- Clipboard pre-fill captures the message you're replying to
- Style guidelines ensure consistent tone
- Draft field lets you refine before AI polish

---

### Creating Forms with AI

Use the Form Factory to describe what you need and have AI generate the configuration.

**Recommended form:** [Form Factory](../library/factory/)

**Workflow:**
1. Trigger the Form Factory
2. Describe your form requirements
3. Paste the output into an AI assistant
4. Save the generated config to a `.yml` file
5. Create a trigger for your new form

---

## Email and Communication

### Follow-up Emails

Quickly draft follow-up emails after meetings or calls.

**Recommended form:** [Email](../library/ready-made/email)

**Customization ideas:**
- Add your signature using `{{env.USERNAME}}`
- Add a tone selector (formal, casual, friendly)
- Include a template for specific email types

### Message Templates

Create reusable message templates for common communications:
- Meeting invitations
- Status updates
- Thank you notes
- Announcements

**Starting point:** [Demo](../library/ready-made/demo)

---

## File Processing

### Code Context for AI

Provide AI assistants with file contents for code review or analysis.

**Recommended form:** [Files (Advanced)](../library/ready-made/files)

**Why it works:**
- Select multiple files at once
- Recent files feature for quick access
- Multiple output templates for different formats
- Description field adds context

---

### File Content Extraction

Extract text from files to include in documents or prompts.

**Recommended form:** [File Upload](../library/ready-made/file)

**Use cases:**
- Include config file contents in documentation
- Extract text from uploaded documents
- Read file metadata (size, hash, type)

---

## Code Generation

### Boilerplate Code

Generate repetitive code structures from templates.

**Recommended form:** [Code Generator](../library/ready-made/codegen)

**The pattern:**
1. Dynamic array for variable definitions
2. Complex Liquid template with loops
3. Output is ready-to-use code

**Adaptation ideas:**
- TypeScript interfaces
- Python dataclasses
- SQL table definitions
- React components
- API endpoint handlers

---

### Configuration Files

Generate configuration files from user input:
- Docker Compose files
- Nginx configs
- Environment files
- CI/CD pipelines

**Approach:**
1. Define fields for each config option
2. Use conditionals to include optional sections
3. Output in the appropriate format (YAML, JSON, INI)

---

## Data Entry

### Structured Notes

Capture meeting notes, decisions, or observations with consistent structure.

**Form features to use:**
- Required fields for essential info
- Dropdown for categories
- Date picker for timestamps
- Checkbox arrays for action items

---

### Bug Reports

Collect structured bug reports with all necessary information.

**Suggested fields:**
- Title (required, string)
- Severity (enum: Critical, High, Medium, Low)
- Steps to reproduce (array of strings)
- Expected behavior (textarea)
- Actual behavior (textarea)
- Screenshots (file array)
- Environment (nested object)

---

### Feature Requests

Capture feature ideas with context and priority.

**Suggested fields:**
- Feature title
- Problem statement
- Proposed solution
- User story format ("As a... I want... So that...")
- Priority (enum)
- Related features (array)

---

## Quick Insert

### Date Stamps

Insert formatted dates for logs, journals, or documents.

**Recommended form:** [Date Picker](../library/ready-made/date)

**Template variations:**
```yml
# ISO format
template: "{{ mydate }}"
# Full format
template: "{{ mydate | date: '%A, %B %d, %Y' }}"
# With time
template: "{{ 'now' | date: '%Y-%m-%d %H:%M' }}"
```

---

### Checklists

Create quick multi-select checklists.

**Recommended form:** [Checkbox](../library/ready-made/checkbox)

**Use cases:**
- Daily standup status
- Pre-flight checklists
- Review criteria
- Approval workflows

---

## Building Your Own

### Start from Boilerplate

Browse [Boilerplate Snippets](../library/boilerplate/) for copy-paste starting points.

### Modify Existing Forms

1. Find a similar form in the [Ready-Made Forms](../library/ready-made/)
2. Copy the YAML to your own file
3. Modify fields, layout, and template
4. Create a trigger pointing to your file

### Use the Form Factory

For complex forms, describe your requirements in the [Form Factory](../library/factory/) and let AI generate the initial config.

---

## Tips for All Use Cases

1. **Pre-fill from clipboard** — Use `{{clipboard}}` in data section
2. **Use environment variables** — `{{env.USERNAME}}` for personalization
3. **Add validation** — Required fields prevent incomplete submissions
4. **Organize with tabs** — Use Categorization for complex forms
5. **Test your templates** — Verify output formatting before daily use
