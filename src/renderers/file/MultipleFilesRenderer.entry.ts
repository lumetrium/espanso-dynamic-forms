import MultipleFilesRenderer from './MultipleFilesRenderer.vue'
import {
	and,
	JsonFormsRendererRegistryEntry,
	rankWith,
	schemaMatches,
	schemaTypeIs,
	uiTypeIs,
} from '@jsonforms/core'

export const multipleFilesRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: MultipleFilesRenderer,
	tester: rankWith(
		100, // Increased rank to take precedence
		and(
			uiTypeIs('Control'),
			schemaTypeIs('array'),
			schemaMatches(
				(schema: any) =>
					schema.format === 'file' ||
					(schema.items && schema.items.format === 'file'),
			),
		),
	),
}
