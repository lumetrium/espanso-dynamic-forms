import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Translator, JsonFormsI18nState } from '@jsonforms/core'
import { FormSchemaI18n } from '../models/form-schema.ts'

/**
 * A composable that creates a reactive i18n configuration
 * for the JSON Forms component, bridging `vue-i18n` with JSON Forms'
 * translation API.
 *
 * @returns {ComputedRef<JsonFormsI18nState>} A computed property that
 *   provides the `locale` and `translate` function for the `json-forms` component.
 */
export function useJsonFormsI18n() {
	const { t, te, locale, setLocaleMessage } = useI18n()

	function translator(
		key: string,
		defaultMessage: string | undefined,
		params?: Record<string, string>,
	) {
		if (te(key)) return t(key, params ?? {})

		if (defaultMessage === undefined) {
			return undefined
		}

		let message = defaultMessage
		if (params) {
			Object.keys(params).forEach((param) => {
				message = message.replace(`{${param}}`, params[param])
			})
		}

		return message
	}

	const jsonFormsI18n = computed<JsonFormsI18nState>(() => ({
		locale: locale.value,
		translate: translator as Translator,
	}))

	function setMessages(messages: FormSchemaI18n) {
		if (!messages) return
		Object.entries(messages).forEach(([locale, messages]) => {
			setLocaleMessage(locale, messages)
		})
	}

	function setLocale(newLocale: string) {
		locale.value = newLocale
	}

	return {
		t: translator,
		jsonFormsI18n,
		setMessages,
		setLocale,
	}
}
