import { useJsonFormsControl } from '@jsonforms/vue'
import { useVuetifyControl } from '@jsonforms/vue-vuetify'
import { ControlProps } from '@jsonforms/vue/src/jsonFormsCompositions.ts'
import { watchOnce } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useJsonFormsControlI18n } from '../../i18n/useJsonFormsControlI18n.ts'
import type { FileMetadata, RecentFilesConfig } from './types'
import { useFilePathLoader } from './useFilePathLoader'
import { useFilePreviews } from './useFilePreviews.ts'
import { useFileReaders } from './useFileReaders'
import { useRecentFilesSelection } from './useRecentFilesSelection'

export function useFileControl(props: ControlProps, isMultiple: boolean) {
	const control = useJsonFormsControl(props)
	const vuetifyControl = useVuetifyControl(control)
	const { t } = useJsonFormsControlI18n(props)

	const { localPreviews, buildPreviews, revokeObjectUrls } = useFilePreviews()
	const { fileToMetadata } = useFileReaders()
	const { getFilePath, loadFileFromPath } = useFilePathLoader()

	const files = ref<File[] | undefined>()
	const isLoadingDefaults = ref(false)

	const acceptedTypes = computed(() => {
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

	// Recent files integration
	const recentFilesConfig = vuetifyControl.control.value.uischema?.options
		?.recentFiles as RecentFilesConfig | undefined
	const recentFiles = useRecentFilesSelection({
		config: recentFilesConfig,
		fieldPath: vuetifyControl.control.value.path,
		isMultiple,
		getCurrentData: () => boundArray.value,
		updateData: (data) =>
			vuetifyControl.handleChange(vuetifyControl.control.value.path, data),
	})

	async function onFileChange(payload: File | File[] | null | undefined) {
		if (!payload || (Array.isArray(payload) && payload.length === 0)) return

		const payloadArray = Array.isArray(payload) ? payload : [payload]

		if (isMultiple) {
			const existingFiles = files.value || []
			files.value = [...existingFiles, ...payloadArray]
			buildPreviews(files.value)

			const newMetadata = await Promise.all(
				payloadArray.map((f) => fileToMetadata(f)),
			)
			const mergedMetadata = [...boundArray.value, ...newMetadata]
			vuetifyControl.handleChange(
				vuetifyControl.control.value.path,
				mergedMetadata,
			)

			// Track files with paths
			payloadArray.forEach((file, index) => {
				const filePath = (file as any).path as string | undefined
				if (filePath && newMetadata[index]) {
					recentFiles.trackFile(newMetadata[index], filePath)
				}
			})
		} else {
			files.value = payloadArray.slice(0, 1)
			buildPreviews(files.value)

			const metadata = await fileToMetadata(files.value[0])
			vuetifyControl.handleChange(vuetifyControl.control.value.path, metadata)

			const filePath = (files.value[0] as any).path as string | undefined
			if (filePath) {
				recentFiles.trackFile(metadata, filePath)
			}
		}
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

	async function processDefaultData(initialData: any) {
		if (isLoadingDefaults.value || initialData === undefined) return

		isLoadingDefaults.value = true

		const singleFilePath = getFilePath(initialData)
		if (!isMultiple && singleFilePath) {
			try {
				const metadata = await loadFileFromPath(singleFilePath)
				vuetifyControl.handleChange(vuetifyControl.control.value.path, metadata)
				recentFiles.trackFile(metadata, singleFilePath)
			} catch (error) {
				console.error('Failed to load default file:', error)
			}
			isLoadingDefaults.value = false
			return
		}

		if (isMultiple && Array.isArray(initialData)) {
			const paths = initialData.map(getFilePath).filter(Boolean) as string[]
			if (paths.length > 0) {
				try {
					const results = await Promise.allSettled(
						paths.map((p) => loadFileFromPath(p)),
					)
					const loadedMetadata = results.reduce<FileMetadata[]>(
						(acc, res, index) => {
							if (res.status === 'fulfilled') {
								acc.push(res.value)
								recentFiles.trackFile(res.value, paths[index])
							}
							return acc
						},
						[],
					)
					vuetifyControl.handleChange(
						vuetifyControl.control.value.path,
						loadedMetadata,
					)
				} catch (error) {
					console.error('Failed to load default files:', error)
				}
			}
		}

		isLoadingDefaults.value = false
	}

	onMounted(() => processDefaultData(vuetifyControl.control.value.data))
	watchOnce(
		() => vuetifyControl.control.value.data,
		(initialData) => processDefaultData(initialData),
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
		// Recent files (flat exports for template convenience)
		recentFilesEnabled: recentFiles.isEnabled,
		recentFilesEntries: recentFiles.entries,
		selectedRecentIds: recentFiles.selectedIds,
		loadingRecentEntryId: recentFiles.loadingEntryId,
		selectRecentEntry: recentFiles.selectEntry,
		deselectRecentEntry: recentFiles.deselectEntry,
		addSelectedRecentFiles: recentFiles.addSelectedFiles,
		removeRecentEntry: recentFiles.removeEntry,
		clearRecentHistory: recentFiles.clearHistory,
		selectAllRecent: recentFiles.selectAll,
		deselectAllRecent: recentFiles.deselectAll,
		// Presets (flat exports for template convenience)
		presets: recentFiles.presets,
		presetsStash: recentFiles.stash,
		savePreset: recentFiles.savePreset,
		loadPreset: recentFiles.loadPreset,
		deletePreset: recentFiles.deletePreset,
		restorePresetsStash: recentFiles.restoreStash,
	}
}
