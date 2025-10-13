import SingleFileRenderer from './SingleFileRenderer.vue'
import {
	and,
	JsonFormsRendererRegistryEntry,
	rankWith,
	schemaMatches,
	schemaTypeIs,
	uiTypeIs,
} from '@jsonforms/core'


export const singleFileRendererEntry: JsonFormsRendererRegistryEntry = {
	renderer: SingleFileRenderer,
	tester: rankWith(
		100, // Increased rank to take precedence
		and(
			uiTypeIs('Control'),
			schemaTypeIs('object'),
			schemaMatches((schema) => schema.format === 'file'),
		),
	),
}
