import fs from 'node:fs'
import { FORM_CONFIG } from '../main.ts'

// @ts-ignore
import { load as loadYaml } from 'js-yaml'

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

export function parseFormConfig(args: string[], fallback = '') {
	let formFileContent = 'EMPTY'
	let formFilePath = getFormFilePath(args, FORM_CONFIG)

	if (formFilePath && fs.existsSync(formFilePath)) {
		formFileContent = fs.readFileSync(formFilePath, 'utf-8')
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
		try {
			const doc = loadYaml(formFileContent)
			formFileContent = JSON.stringify(doc, null, 2)
		} catch (e) {
			console.error('Error parsing YAML file:', e)
		}
	}

	return formFileContent
}
