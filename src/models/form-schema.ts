import { JsonSchema4, JsonSchema7, UISchemaElement } from '@jsonforms/core'
import { FormMeta } from './form-meta.ts'

export type FormSchemaI18n = { [locale: string]: Record<string, string> }

export interface FormSchema {
	/** JSON Schema for data structure and validation */
	schema?: JsonSchema7 | JsonSchema4
	/** UI schema for layout and control options */
	uischema?: UISchemaElement
	/** Default values */
	data?: Record<string, any>
	/** Internationalization strings */
	i18n?: FormSchemaI18n
	/** Output template for rendering result with Liquid */
	template?: string | string[]
	/** Metadata about the form */
	meta?: FormMeta
}
