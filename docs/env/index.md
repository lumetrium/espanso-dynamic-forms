---
outline: [2, 4]
---

# Environment Variables

Espanso Dynamic Forms provides the `{{env}}` object to your Liquid templates.
This includes the `template` and `data` sections of your form config YAML file.

This object contains all variables from your system's environment,
as well as any custom environment variables you pass in via the `--env` argument
when launching the EDF executable from your Espanso trigger.

Espanso Dynamic Forms also provides its own set of environment variables prefixed with `EDF_`.
You'll find a full list of these at the bottom of this page.

## Why and Where to Use Environment Variables?

Using environment variables allows you to inject dynamic data into your forms without hardcoding values.

### Data Section

For example, within your form config, you might want to set a default value for a text input based on an environment variable:

```yml
schema:
  type: object
  properties:
    name:
      type: string

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/name"

data:
	name: "{{env.USERNAME}}"  # Default value from environment variable

template: |
  Your name is: {{name}}
```

In this example, the `name` field is pre-populated with the value of the `USERNAME` environment variable from the system,
so when the form is displayed, the user will see their own username as the default input.

### Template Section

Another place to use environment variables is within the `template` section to customize the output based on environment data:

TODO: improve example (make it more relevant)

```yml
schema:
	type: object
	properties:
		project:
			type: string

uischema:
	type: VerticalLayout
	elements:
		- type: Control
			scope: "#/properties/proejct"

data:
	project: "MyProject"

template: |
	Project: {{env.LOCALAPPDATA}}
```

TODO: write an explanation for the above example

### Espanso Trigger

Additionally, you can use environment variables in your Espanso trigger configuration to dynamically set paths or other parameters:

```yml
matches:
  - trigger: ':demo'
    replace: '{{output}}'
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/EspansoDynamicForms/EspansoDynamicForms.exe
            - --form-config
            - \{\{env.EDF_FORMS}}/demo.yml # <-- using EDF_FORMS environment variable
```

In this example, the `EDF_FORMS` environment variable is used to specify the path one of the example form configs bundled with Espanso Dynamic Forms.
It will resolve to the actual path on your system where the form configs are located.

> [!note] Why the backslashes before the curly braces?
> The curly braces are escaped in this example (`\{\{env.EDF_FORMS}}`) 
> so that Espanso correctly interprets them as part of the command line arguments passed to Espanso Dynamic Forms.
> Without escaping, Espanso would try to process them itself using its own variable syntax, which is not what we want here.
> Alternatively, you can use `inject_vars: false` in your Espanso trigger.
> See [Espanso's documentation](https://espanso.org/docs/matches/variables/#disabling-variable-injection) for more details.

## Passing Environment Variables from Espanso Triggers

You can pass custom environment variables to Espanso Dynamic Forms directly from your Espanso trigger using the `--env` argument.

```yml
matches:
  - trigger: ':demo'
    replace: '{{output}}'
    force_mode: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - C:/Program Files/Espanso Dynamic Forms/EDF.exe
            - --form-config
            - C:/path/to/your/form-config.yml
            - --env
            - FOO=Bar
						- --env
						- BAZ=Qux
```

In this example, the custom environment variable `FOO` with the value `Bar` is passed to Espanso Dynamic Forms.
You can then access this variable in your form config using <code v-pre>{{env.FOO}}</code>.

To pass multiple environment variables you must repeat the `--env` argument for each variable you want to set.

## Viewing Current Environment Variables
While the form is open, press `Ctrl+Shift+I` to open the Developer Tools.
Then, go to the **Console** tab and you'll see all available environment variables and their current values.

IMAGE

## List of Environment Variables

Here are the built-in environment variables provided by Espanso Dynamic Forms:


| Variable name                    | Description                                                                                                                                 | Example value                                                                 |
|----------------------------------| ------------------------------------------------------------------------------------------------------------------------------------------- |-------------------------------------------------------------------------------|
| All content from system env vars | TODO                                                                                                                                        | ???                                                                           |
| `EDF_EXECUTABLE`                 | Path to the executable file of the Espanso Dynamic Forms                                                                                    | C:/Program Files/Espanso Dynamic Forms/EDF.exe                                |
| `EDF_INSTALLATION_DIR`           | Path to the installation directory of the Espanso Dynamic Forms                                                                             | C:/Program Files/Espanso Dynamic Forms                                        |
| `EDF_RESOURCES`                  | Path to                                                                                                                                     | C:/Program Files/Espanso Dynamic Forms/resources/app.asar/dist                |
| `EDF_FORMS`                      | Path to the directory containing example form configs that come bundled with Espanso Dynamic Forms                                          | C:/Program Files/Espanso Dynamic Forms/resources/app.asar/dist/forms          |
| `EDF_FORM_CONFIG_PATH`           |                                                                                                                                             | <span v-pre>{{env.EDF_FORMS}}</span>/demo.yml                                 |
| `EDF_FORM_CONFIG_PATH_RENDERED`  | Rendered form config path. It will be different from `EDF_FORM_CONFIG_PATH` only if you use Liquid syntax in there                          | C:/Program Files/Espanso Dynamic Forms/resources/app.asar/dist/forms/demo.yml |
| `EDF_FORM_CONFIG_PATH_REAL`      | Resolved form config path. It will differ from `EDF_FORM_CONFIG_PATH` and `EDF_FORM_CONFIG_PATH_RENDERED` if you're using symlinks in there |                                                                               |
