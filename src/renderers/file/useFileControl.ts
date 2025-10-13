import { useJsonFormsControl } from '@jsonforms/vue'
import { useVuetifyControl } from '@jsonforms/vue-vuetify'
import { ControlProps } from '@jsonforms/vue/src/jsonFormsCompositions.ts'
import { watchOnce } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useJsonFormsControlI18n } from '../../i18n/useJsonFormsControlI18n.ts'
import type { FileMetadata } from './types'
import { useFilePathLoader } from './useFilePathLoader'
import { useFilePreviews } from './useFilePreviews.ts'
import { useFileReaders } from './useFileReaders'

export function useFileControl(props: ControlProps, isMultiple: boolean) {
	const control = useJsonFormsControl(props)
	const vuetifyControl = useVuetifyControl(control)
	const { t } = useJsonFormsControlI18n(props)

	const { localPreviews, buildPreviews, revokeObjectUrls } = useFilePreviews()
	const { fileToMetadata } = useFileReaders()
	const { getFilePath, loadFileFromPath } = useFilePathLoader()

	const files = ref<File[] | undefined>()
	const isLoadingDefaults = ref(false)

	const acceptedTypes = computed<string | undefined>(() => {
		const opt = vuetifyControl.control.value.uischema?.options?.accept
		const schemaAccept = (vuetifyControl.control.value.schema as any)?.accept
		const applied = (vuetifyControl.appliedOptions as any)?.accept
		const v = opt ?? schemaAccept ?? applied
		return typeof v === 'string' && v.trim().length ? v : undefined
	})

	const boundArray = computed<FileMetadata[]>(() => {
		const data = vuetifyControl.control.value.data
		return Array.isArray(data) &&
			data.every(
				(d) => d && typeof d === 'object' && 'name' in d && 'size' in d,
			)
			? (data as FileMetadata[])
			: []
	})

	const boundSingle = computed<FileMetadata | undefined>(() => {
		const d = vuetifyControl.control.value.data
		return d && typeof d === 'object' && 'name' in d && 'size' in d
			? (d as FileMetadata)
			: undefined
	})

	async function onFileChange(payload: File | File[] | null | undefined) {
		if (!payload || (Array.isArray(payload) && payload.length === 0)) {
			return clearAll()
		}

		const payloadArray = Array.isArray(payload) ? payload : [payload]
		files.value = isMultiple ? payloadArray : payloadArray.slice(0, 1)
		buildPreviews(files.value)

		const metadata = await Promise.all(
			files.value.map((f) => fileToMetadata(f)),
		)
		vuetifyControl.handleChange(
			vuetifyControl.control.value.path,
			isMultiple ? metadata : metadata[0],
		)
	}

	function clearAll() {
		files.value = []
		localPreviews.value = []
		revokeObjectUrls()
		vuetifyControl.handleChange(
			vuetifyControl.control.value.path,
			isMultiple ? [] : undefined,
		)
	}

	async function removeSelectedAt(idx: number) {
		const nextMetadata = boundArray.value.filter((_, i) => i !== idx)
		files.value = files.value?.filter((_, i) => i !== idx)
		if (files.value) buildPreviews(files.value)

		vuetifyControl.handleChange(
			vuetifyControl.control.value.path,
			nextMetadata.length ? nextMetadata : undefined,
		)
	}

	watchOnce(
		() => vuetifyControl.control.value.data,
		async (initialData) => {
			if (initialData === undefined) return

			isLoadingDefaults.value = true

			// Handle single file path
			const singleFilePath = getFilePath(initialData)
			if (!isMultiple && singleFilePath) {
				try {
					const metadata = await loadFileFromPath(singleFilePath)
					vuetifyControl.handleChange(
						vuetifyControl.control.value.path,
						metadata,
					)
				} catch (error) {
					console.error('Failed to load default file:', error)
				}
				isLoadingDefaults.value = false
				return
			}

			// Handle multiple file paths
			if (isMultiple && Array.isArray(initialData)) {
				const paths = initialData.map(getFilePath).filter(Boolean) as string[]
				if (paths.length > 0) {
					try {
						const metadataArray = await Promise.allSettled(
							paths.map((path) => loadFileFromPath(path)),
						)
						vuetifyControl.handleChange(
							vuetifyControl.control.value.path,
							metadataArray.reduce<FileMetadata[]>((acc, res) => {
								if (res.status === 'fulfilled') acc.push(res.value)
								return acc
							}, []),
						)
					} catch (error) {
						console.error('Failed to load default files:', error)
					}
				}
			}

			isLoadingDefaults.value = false
		},
	)

	return {
		...vuetifyControl,
		t,
		acceptedTypes,
		boundArray,
		boundSingle,
		isLoadingDefaults,
		localPreviews,
		onFileChange,
		clearAll,
		removeSelectedAt,
		files,
	}
}
