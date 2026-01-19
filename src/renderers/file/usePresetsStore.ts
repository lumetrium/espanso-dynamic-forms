import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RecentFilePreset, PresetsStash } from './types'

export const usePresetsStore = defineStore(
    'file-presets',
    function presetsStore() {
        // Map of storageKey -> presets array
        const presets = ref<Record<string, RecentFilePreset[]>>({})
        // Map of storageKey -> stash
        const stash = ref<Record<string, PresetsStash>>({})

        function getPresets(storageKey: string): RecentFilePreset[] {
            return presets.value[storageKey] ?? []
        }

        function addPreset(storageKey: string, preset: RecentFilePreset): void {
            const existing = getPresets(storageKey)
            // Remove any preset with same name (update behavior)
            const filtered = existing.filter((p) => p.name !== preset.name)
            presets.value[storageKey] = [preset, ...filtered]
        }

        function deletePreset(storageKey: string, presetId: string): void {
            const existing = getPresets(storageKey)
            presets.value[storageKey] = existing.filter((p) => p.id !== presetId)
        }

        function getStash(storageKey: string): PresetsStash | null {
            return stash.value[storageKey] ?? null
        }

        function setStash(storageKey: string, entries: PresetsStash): void {
            stash.value[storageKey] = entries
        }

        function clearStash(storageKey: string): void {
            delete stash.value[storageKey]
        }

        return {
            presets,
            stash,
            getPresets,
            addPreset,
            deletePreset,
            getStash,
            setStash,
            clearStash,
        }
    },
    {
        persist: {
            key: 'jsonforms-file-presets',
        },
    },
)
