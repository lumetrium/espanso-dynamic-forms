import { useJsonFormsControl } from '@jsonforms/vue'
import { useTranslator } from '@jsonforms/vue-vuetify'
import { ControlProps } from '@jsonforms/vue/src/jsonFormsCompositions.ts'
import { computed } from 'vue'

export function useJsonFormsControlI18n(props: ControlProps) {
	const { control } = useJsonFormsControl(props)
	const translator = useTranslator()


	const i18nKey = computed(() => {
		return control.value.path || 'file';
	});

	const t = (key: string, defaultMessage?: string, params?: any) => {
		const fullKey = `${i18nKey.value}.${key}`
		return translator.value(fullKey, defaultMessage || key, params)
	}

	return {
		t,
	}
}
