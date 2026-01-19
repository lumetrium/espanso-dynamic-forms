import { computed } from 'vue'
import type { FileMetadata, RecentFileEntry, RecentFilesConfig } from './types'
import { useRecentFilesStore } from './useRecentFilesStore.ts'

const DEFAULT_MAX_ITEMS = 10

export interface RecentFilesHistoryOptions {
	config: RecentFilesConfig
	fieldPath: string
	formPath?: string
}

function generateStorageKey(
	config: RecentFilesConfig,
	fieldPath: string,
	formPath?: string,
): string {
	if (config.historyKey) {
		return config.historyKey
	}
	if (config.namespace) {
		return `ns:${config.namespace}`
	}
	// Fallback: scoped to form file and field path
	// If formPath is not available (e.g. new file), use a generic fallback or just field path
	const formScope = formPath ? `form:${formPath}|` : ''
	return `${formScope}field:${fieldPath}`
}

function createEntryFromMetadata(
	metadata: FileMetadata,
	path: string,
): RecentFileEntry {
	return {
		id: metadata.hash || `${metadata.fullName}-${metadata.size}-${Date.now()}`,
		fullName: metadata.fullName,
		name: metadata.name,
		extension: metadata.extension,
		size: metadata.size,
		mime: metadata.mime,
		path,
		hash: metadata.hash,
		lastAccessed: Date.now(),
	}
}

export function useRecentFilesHistory(options: RecentFilesHistoryOptions) {
	const { config, fieldPath, formPath } = options
	const store = useRecentFilesStore()

	const storageKey = generateStorageKey(config, fieldPath, formPath)
	const maxItems = config.maxItems ?? DEFAULT_MAX_ITEMS

	const entries = computed(() =>
		[...store.getEntries(storageKey)].sort(
			(a, b) => b.lastAccessed - a.lastAccessed,
		),
	)

	function addEntry(metadata: FileMetadata, path?: string): void {
		if (!path) return
		const entry = createEntryFromMetadata(metadata, path)
		store.addEntry(storageKey, entry, maxItems)
	}

	function removeEntry(id: string): void {
		store.removeEntry(storageKey, id)
	}

	function clearHistory(): void {
		store.clearEntries(storageKey)
	}

	function getEntry(id: string): RecentFileEntry | undefined {
		return store.getEntry(storageKey, id)
	}

	return {
		entries,
		addEntry,
		removeEntry,
		clearHistory,
		getEntry,
	}
}
