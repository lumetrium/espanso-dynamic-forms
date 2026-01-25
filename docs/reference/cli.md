---
outline: [1, 4]
---

# Command Line Interface (CLI)

Espanso Dynamic Forms is typically launched by a script, but it accepts command-line arguments that control its behavior. Understanding these arguments is useful for debugging and advanced configuration.

## Arguments

### `--form-config`

**Description:** Specifies the path to the form configuration file (YAML or JSON) to load.

**Usage:**
```bash
"C:/Program Files/Espanso Dynamic Forms/EDF.exe" --form-config "path/to/form.yml"
```

**Behavior:**
- Supports absolute paths
- Supports environment variables (e.g., `{{env.EDF_FORMS}}/demo.yml`). Expansion happens inside the app via [Liquid](../liquid/).
- If the file doesn't exist, the app loads an error page.

**Fallback:**
If not provided, checks the `FORM_CONFIG` environment variable.

---

### `--show-timing`

**Description:** Controls when the window becomes visible relative to data loading. This helps manage the trade-off between perceived speed and visual polish (avoiding "white flashes" or resizing glitches).

**Usage:**
```bash
EspansoDynamicForms.exe --show-timing <option>
```

**Options:**

| Option | Description | Pros/Cons |
|--------|-------------|-----------|
| `skip-flash` **(Default)** | Waits until the DOM is ready and window content is painted before showing. | ✅ No white flash<br>✅ Fast enough for most uses |
| `immediate` | Shows the window immediately upon process start. | 🚀 Fastest start time<br>⚠️ May show white screen briefly<br>⚠️ May resize visibly |
| `ready` | Waits until all form data is fully loaded and processed. | ✅ Zero resizing glitches<br>🐢 Slowest time-to-interactive |

**Fallback:**
If not provided, checks the `SHOW_TIMING` environment variable. Defaults to `skip-flash`.

## Architecture Flow

Espanso Dynamic Forms works by communicating via standard input/output (stdio).

1. **Trigger:** Espanso detects a trigger (e.g., `:form`).
2. **Execution:** Espanso runs the command defined in the `replace` block (usually a wrapper script or the executable directly).
3. **Form Load:** The application launches, reads `--form-config`, and renders the form.
4. **User Interaction:** You fill out the form and click "Submit".
5. **Output:** The application prints the rendered result to `stdout` (Standard Output).
6. **Capture:** Espanso captures this output.
7. **Replacement:** Espanso pastes the captured text into your active application.

### Debugging with Stdout

Because the app outputs to `stdout`, you can test forms in your terminal without Espanso:

```powershell
& "C:/Program Files/Espanso Dynamic Forms/EDF.exe" --form-config "{{env.EDF_FORMS}}/demo.yml"
```

When you submit the form, the result will print directly to your terminal console.
