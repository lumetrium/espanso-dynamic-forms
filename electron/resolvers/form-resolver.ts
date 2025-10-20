import fs from 'node:fs'

// @ts-ignore
import { load as loadYaml } from 'js-yaml'
import { FormSchema } from '../../src/models/form-schema.ts'

export function getFormFilePath<F>(args: string[], fallback: F) {
	let formFileIndex = args.indexOf('--form-config')
	return formFileIndex !== -1 && args.length > formFileIndex + 1
		? args[formFileIndex + 1]
		: fallback
}

export function getFormFilePathReal(formFilePath: string, fallback = '') {
	try {
		return fs.realpathSync(formFilePath)
	} catch (e) {
		return fallback
	}
}

export function parseFormConfig(
	formFilePath: string,
	fallback?: FormSchema,
): FormSchema {
	let formFileContent

	if (formFilePath && fs.existsSync(formFilePath)) {
		formFileContent = fs.readFileSync(formFilePath, 'utf-8') as FormSchema
	}

	if (!formFilePath || !fs.existsSync(formFilePath)) {
		formFilePath = ''
		formFileContent = fallback
	}

	if (
		formFileContent &&
		(!formFilePath ||
			formFilePath?.endsWith('.yaml') ||
			formFilePath?.endsWith('.yml'))
	) {
		formFileContent = loadYaml(formFileContent) as FormSchema
	}

	return formFileContent ?? fallback ?? {}
}
