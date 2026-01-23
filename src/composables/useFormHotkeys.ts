import { useMagicKeys, whenever } from '@vueuse/core'
import { computed } from 'vue'
import { FormSchema } from '../models/form-schema.ts'

interface UseFormHotkeysOptions {
	fullSchema: { value: FormSchema | undefined }
	onSubmit: () => void
	onReset: () => void
	onClose: () => void
	canSubmit: { value: boolean }
}

export function useFormHotkeys({
	fullSchema,
	onSubmit,
	onReset,
	onClose,
	canSubmit,
}: UseFormHotkeysOptions) {
	const keys = useMagicKeys()

	const submitHotkey = computed(
		() => fullSchema.value?.meta?.hotkeys?.submit || 'ctrl+enter',
	)
	const resetHotkey = computed(() => fullSchema.value?.meta?.hotkeys?.reset)
	const closeHotkey = computed(() => fullSchema.value?.meta?.hotkeys?.close)

	const submitKeys = computed(() => keys[submitHotkey.value]?.value)
	const resetKeys = computed(() =>
		resetHotkey.value ? keys[resetHotkey.value]?.value : false,
	)
	const closeKeys = computed(() =>
		closeHotkey.value ? keys[closeHotkey.value]?.value : false,
	)

	whenever(submitKeys, () => {
		if (canSubmit.value) {
			onSubmit()
		}
	})

	whenever(resetKeys, () => {
		onReset()
	})

	whenever(closeKeys, () => {
		onClose()
	})

	const submitHotkeyDisplay = computed(() => {
		const parts = submitHotkey.value.split('+')
		return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' + ')
	})

	return {
		submitHotkeyDisplay,
	}
}
