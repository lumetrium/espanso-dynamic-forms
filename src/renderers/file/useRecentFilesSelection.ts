import { ref, type Ref, type ComputedRef, computed } from 'vue'
import type {
	FileMetadata,
	RecentFileEntry,
	RecentFilesConfig,
	RecentFilePreset,
	PresetsStash,
} from './types'
import { useRecentFilesHistory } from './useRecentFilesHistory'
import { useFilePathLoader } from './useFilePathLoader'
import { useRecentFilesPresets } from './useRecentFilesPresets'

// Import useEnvStore
import { useEnvStore } from '../../stores/useEnvStore'

export interface RecentFilesSelectionOptions {
	config: RecentFilesConfig | undefined
	fieldPath: string
	// Removed schemaHash
	isMultiple: boolean
	getCurrentData: () => FileMetadata[]
	updateData: (data: FileMetadata | FileMetadata[] | undefined) => void
}

export interface RecentFilesSelectionReturn {
	isEnabled: boolean
	entries: ComputedRef<RecentFileEntry[]>
	selectedIds: Ref<string[]>
	loadingEntryId: Ref<string | null>
	trackFile: (metadata: FileMetadata, path?: string) => void
	selectEntry: (entry: RecentFileEntry) => void
	deselectEntry: (id: string) => void
	addSelectedFiles: () => Promise<void>
	removeEntry: (id: string) => void
	clearHistory: () => void
	selectAll: (entries: RecentFileEntry[]) => void
	deselectAll: (entries?: RecentFileEntry[]) => void
	// Presets
	presets: ComputedRef<RecentFilePreset[]>
	stash: ComputedRef<PresetsStash | null>
	savePreset: (name: string) => boolean
	loadPreset: (presetId: string) => boolean
	deletePreset: (presetId: string) => void
	restoreStash: () => boolean
}

export function useRecentFilesSelection(
	options: RecentFilesSelectionOptions,
): RecentFilesSelectionReturn {
	const { config, fieldPath, isMultiple, getCurrentData, updateData } = options
	const { loadFileFromPath } = useFilePathLoader()
	const envStore = useEnvStore()

	// Get form path from environment store
	const formPath = computed(() => {
		return (
			envStore.env.EDF_FORM_CONFIG_PATH_REAL ||
			envStore.env.EDF_FORM_CONFIG_PATH ||
			''
		)
	})

	const selectedIds = ref<string[]>([])
	const loadingEntryId = ref<string | null>(null)

	const isEnabled = config?.enabled ?? false

	// Initialize history only if enabled
	const history = isEnabled
		? useRecentFilesHistory({
				config: config!,
				fieldPath,
				formPath: formPath.value,
			})
		: null

	// Initialize presets only if enabled
	const presetsHook = isEnabled
		? useRecentFilesPresets({
				config: config!,
				fieldPath,
				formPath: formPath.value,
			})
		: null

	function trackFile(metadata: FileMetadata, path?: string): void {
		history?.addEntry(metadata, path)
	}

	function selectEntry(entry: RecentFileEntry): void {
		if (!selectedIds.value.includes(entry.id)) {
			selectedIds.value.push(entry.id)
		}
	}

	function deselectEntry(id: string): void {
		const index = selectedIds.value.indexOf(id)
		if (index >= 0) {
			selectedIds.value.splice(index, 1)
		}
	}

	async function addSelectedFiles(): Promise<void> {
		if (!history || selectedIds.value.length === 0) return

		const idsToProcess = [...selectedIds.value]

		for (const id of idsToProcess) {
			const entry = history.getEntry(id)
			if (!entry) continue

			loadingEntryId.value = id
			try {
				const metadata = await loadFileFromPath(entry.path)

				if (isMultiple) {
					const currentData = getCurrentData()
					const alreadySelected = currentData.some(
						(m) => m.hash === metadata.hash,
					)
					if (!alreadySelected) {
						updateData([...currentData, metadata])
					}
				} else {
					updateData(metadata)
				}

				history.addEntry(metadata, entry.path)
			} catch (error) {
				console.error('Failed to load file from history:', entry.path, error)
			}
		}

		loadingEntryId.value = null
		selectedIds.value = []
	}

	function removeEntry(id: string): void {
		history?.removeEntry(id)
		deselectEntry(id)
	}

	function clearHistory(): void {
		history?.clearHistory()
		selectedIds.value = []
	}

	function selectAll(entries: RecentFileEntry[]): void {
		const newIds = entries.map((e) => e.id)
		// Add new IDs to selectedIds without duplicates
		for (const id of newIds) {
			if (!selectedIds.value.includes(id)) {
				selectedIds.value.push(id)
			}
		}
	}

	function deselectAll(entries?: RecentFileEntry[]): void {
		if (!entries) {
			selectedIds.value = []
			return
		}
		const idsToRemove = entries.map((e) => e.id)
		selectedIds.value = selectedIds.value.filter(
			(id) => !idsToRemove.includes(id),
		)
	}

	// Return empty computed if not enabled
	const emptyEntries = { value: [] as RecentFileEntry[] } as ComputedRef<
		RecentFileEntry[]
	>
	const emptyPresets = { value: [] as RecentFilePreset[] } as ComputedRef<
		RecentFilePreset[]
	>
	const emptyStash = { value: null } as ComputedRef<PresetsStash | null>

	return {
		isEnabled,
		entries: history?.entries ?? emptyEntries,
		selectedIds,
		loadingEntryId,
		trackFile,
		selectEntry,
		deselectEntry,
		addSelectedFiles,
		removeEntry,
		clearHistory,
		selectAll,
		deselectAll,
		// Presets
		presets: presetsHook?.presets ?? emptyPresets,
		stash: presetsHook?.stash ?? emptyStash,
		savePreset: presetsHook?.savePreset ?? (() => false),
		loadPreset: presetsHook?.loadPreset ?? (() => false),
		deletePreset: presetsHook?.deletePreset ?? (() => {}),
		restoreStash: presetsHook?.restoreStash ?? (() => false),
	}
}
