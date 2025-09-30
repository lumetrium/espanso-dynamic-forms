import { JsonSchema4, JsonSchema7, UISchemaElement } from '@jsonforms/core'

export interface FormSchema {
	/** JSON Schema for data structure and validation */
	schema?: JsonSchema7 | JsonSchema4
	/** UI schema for layout and control options */
	uischema?: UISchemaElement
	/** Default values */
	data?: Record<string, any>
	/** Output template for rendering result with Liquid */
	template?: string | string[]
}
