
/**
 * Parses environment variable assignments from command-line parameters
 * @param args - Array of arguments
 * @param mixin - Optional object to include
 * @returns Object containing all env vars
 */
export function parseEnvParams(
	args: string[],
	mixin: Record<string, string | undefined> = {},
): Record<string, any> {
	const envVars: Record<string, string | undefined> = {}

	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--env' && i + 1 < args.length) {
			const envValue = args[i + 1]
			const [key, value] = parseEnvAssignment(envValue)

			if (key && value !== undefined) {
				envVars[key] = `${value}`
			}

			i++
		}
	}

	return { ...mixin, ...envVars }
}

/**
 * Parses a single environment variable assignment
 * @param assignment - String like "KEY=value"
 * @returns Tuple of [key, value]
 */
function parseEnvAssignment(
	assignment: string,
): [string | null, string | null] {
	const equalIndex = assignment.indexOf('=')

	if (equalIndex === -1) {
		return [null, null]
	}

	const key = assignment.substring(0, equalIndex).trim()
	const value = assignment.substring(equalIndex + 1).trim()

	return [key, value]
}
