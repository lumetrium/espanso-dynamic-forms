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


	function preprocess(template: string) {
		return template
	}

	function postprocess(rendered: string) {
		return rendered.replaceAll(/\n\s*\n/g, '\n\n').replaceAll(/\n+$/g, '')
	}

	return {
		render,
	}
}
