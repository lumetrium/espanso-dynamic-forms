import { Liquid } from 'liquidjs'

const utilVariables = {
	newline: '\n',
	tab: '\t',
}

export function useTemplater() {
	const engine = new Liquid()

	engine.filters['url_encode'] = (value: string) => encodeURIComponent(value)
	engine.filters['url_decode'] = (value: string) => decodeURIComponent(value)

	function render(
		template: string,
		data?: Record<string, any>,
		throwOnError = false,
	) {
		if (!template) return ''

		try {
			const compiled = engine.parse(preprocess(template))
			const fullData = { ...utilVariables, ...(data ?? {}) }
			const rendered = engine.renderSync(compiled, fullData)
			return postprocess(rendered)
		} catch (e) {
			if (throwOnError) throw e
			console.error(e)
			return ''
		}
	}

	/**
	 * Recursive helper function to render all strings deeply
	 * @param value
	 * @param data
	 * @param throwOnError
	 */
	function renderDeep(
		value: any,
		data: Record<string, any>,
		throwOnError = false,
	): any {
		// Handle strings - render them
		if (typeof value === 'string') {
			return render(value, data, throwOnError)
		}

		// Handle arrays - recursively process each item
		if (Array.isArray(value)) {
			return value.map(item => renderDeep(item, data, throwOnError))
		}

		// Handle objects - recursively process each property
		if (value !== null && typeof value === 'object') {
			return Object.entries(value).reduce((acc, [key, val]) => {
				acc[key] = renderDeep(val, data, throwOnError)
				return acc
			}, {} as Record<string, any>)
		}

		// Return primitives as-is (numbers, booleans, null, etc.)
		return value
	}


	function preprocess(template: string) {
		return template
	}

	function postprocess(rendered: string) {
		return rendered.replaceAll(/\n\s*\n/g, '\n\n').replaceAll(/\n+$/g, '')
	}

	return {
		render,
		renderDeep,
	}
}
