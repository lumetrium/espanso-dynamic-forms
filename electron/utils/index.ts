/**
 * Stringifies an object to a JSON string
 * @param obj
 * @param fallback
 */
export function jsonStringifySafe(
	obj: Record<string, any>,
	fallback = '{}',
): string {
	try {
		return JSON.stringify(obj, null, 2)
	} catch (e) {
		// console.error('Error stringifying envContent:', e)
		if (!fallback) throw e
		return fallback
	}
}
