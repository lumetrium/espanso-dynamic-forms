import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { FormSchema } from '../models/form-schema.ts'

export const useFormSchemaStore = defineStore('form-schema', () => {
	const fullSchema = ref<FormSchema>()
	const schema = computed(() => fullSchema.value?.schema)
	const uischema = computed(() => fullSchema.value?.uischema)
	const data = computed(() => fullSchema.value?.data)
	const template = computed(() => fullSchema.value?.template)
	const i18n = computed(() => fullSchema.value?.i18n || {})

	const isValid = computed(() => !!schema.value && !!uischema.value)

	function setFullSchema(newSchema: string) {
		try {
			fullSchema.value = JSON.parse(newSchema)
			console.log('Schema updated', fullSchema.value)
		} catch (error) {
			console.error('Invalid JSON schema:', error)
			console.log('Failed schema:', newSchema)
			fullSchema.value = undefined
		}
	}

	return {
		fullSchema,
		schema,
		uischema,
		data,
		i18n,
		template,
		isValid,

		setFullSchema,
	}
})
