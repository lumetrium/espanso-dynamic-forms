import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RecentFileEntry } from './types.ts'

export const useRecentFilesStore = defineStore(
	'recent-files',
	function recentFilesStore() {
		// Map of storageKey -> entries array
		const history = ref<Record<string, RecentFileEntry[]>>({})

		function getEntries(storageKey: string): RecentFileEntry[] {
			return history.value[storageKey] ?? []
		}

		function setEntries(storageKey: string, entries: RecentFileEntry[]): void {
			history.value[storageKey] = entries
		}

		function addEntry(
			storageKey: string,
			entry: RecentFileEntry,
			maxItems: number,
		): void {
			const entries = getEntries(storageKey)

			// Remove existing entry with same ID or path
			const filtered = entries.filter(
				(e) => e.id !== entry.id && e.path !== entry.path,
			)

			// Add new entry at beginning
			const updated = [entry, ...filtered].slice(0, maxItems)
			setEntries(storageKey, updated)
		}

		function removeEntry(storageKey: string, id: string): void {
			const entries = getEntries(storageKey)
			setEntries(
				storageKey,
				entries.filter((e) => e.id !== id),
			)
		}

		function clearEntries(storageKey: string): void {
			delete history.value[storageKey]
		}

		function getEntry(
			storageKey: string,
			id: string,
		): RecentFileEntry | undefined {
			return getEntries(storageKey).find((e) => e.id === id)
		}

		return {
			history,
			getEntries,
			setEntries,
			addEntry,
			removeEntry,
			clearEntries,
			getEntry,
		}
	},
	{
		persist: {
			key: 'jsonforms-recent-files',
		},
	},
)
