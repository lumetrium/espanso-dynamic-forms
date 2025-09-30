# Contributing to Espanso Dynamic Forms
Thank you for considering contributing to Espanso Dynamic Forms!

## Ways to contribute

1. **Report bugs and suggest enhancements**: If you encounter a bug or have an idea for an improvement, 
		please [create a new issue](https://github.com/lumetrium/espanso-dynamic-forms/issues/new). Provide as much detail as possible,
		including steps to reproduce the issue, screenshots, and your environment details.

2. **Share a form config**: If you have created a useful form configuration that you think others might benefit from,
		please share it by creating a new issue or submitting a pull request with your form configuration file.

3. **Submit pull requests**: If you would like to contribute code,
	 please fork this repository, create a new branch, make your changes,
	 and submit a pull request. Be sure to include a clear and concise description
	 of your changes.

## Contribute code

To get started with contributing the code, follow these steps:

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch for your changes: `git checkout -b feature/your-feature-name`.
4. Make your changes and commit them with a descriptive commit message.
5. Push your changes to your fork on GitHub: `git push origin feature/your-feature-name`.
6. Open a pull request to the main repository. Please include a clear title and description of your changes.

## Development

Install the dependencies with `yarn install`

### Option 1: Run directly with a command
```
yarn dev
```

### Option 2: Run through Espanso
Add a trigger to let Espanso run the app in development mode:
```yml
matches:
  - trigger: ":dev"
    replace: "{{output}}"
    backend: clipboard
    vars:
      - name: output
        type: script
        params:
          args:
            - "C:/Projects/espanso-dynamic-forms/run-dev.bat" # Change the path accordingly
            - "%CONFIG%/forms/dev.yml" # Make sure the form exists
```

### Option 3: Build and run main.js with electron
```
yarn build
```


```yml
matches:
  - trigger: ":test"
    replace: "{{output}}"
    backend: clipboard
    vars:
      - name: output
        type: script
        params:
        args:
          - "C:/Program Files/nodejs/node_modules/electron/dist/electron.exe"
          - -e
          - "C:/Projects/espanso-dynamic-forms/dist-electron/main.js" # Change the path accordingly
          - --form-config
          - "%CONFIG%/forms/dev.yml" # Make sure the form exists
```

## Building

```bash
yarn build
```


## Releasing
```
git tag -a 1.0.1 -m "1.0.1"
git push origin 1.0.1
```
