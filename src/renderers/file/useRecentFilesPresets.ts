import { computed, type ComputedRef } from 'vue'
import type {
    RecentFilePreset,
    RecentFilesConfig,
    PresetsStash,
} from './types'
import { usePresetsStore } from './usePresetsStore'
import { useRecentFilesStore } from './useRecentFilesStore'

export interface RecentFilesPresetsOptions {
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
    const formScope = formPath ? `form:${formPath}|` : ''
    return `${formScope}field:${fieldPath}`
}

function generatePresetId(): string {
    return `preset-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export interface RecentFilesPresetsReturn {
    presets: ComputedRef<RecentFilePreset[]>
    stash: ComputedRef<PresetsStash | null>
    savePreset: (name: string) => boolean
    loadPreset: (presetId: string) => boolean
    deletePreset: (presetId: string) => void
    restoreStash: () => boolean
}

export function useRecentFilesPresets(
    options: RecentFilesPresetsOptions,
): RecentFilesPresetsReturn {
    const { config, fieldPath, formPath } = options
    const presetsStore = usePresetsStore()
    const recentFilesStore = useRecentFilesStore()

    const storageKey = generateStorageKey(config, fieldPath, formPath)

    const presets = computed(() => presetsStore.getPresets(storageKey))

    const stash = computed(() => presetsStore.getStash(storageKey))

    function savePreset(name: string): boolean {
        if (!name.trim()) return false

        const currentEntries = recentFilesStore.getEntries(storageKey)
        if (currentEntries.length === 0) return false

        const preset: RecentFilePreset = {
            id: generatePresetId(),
            name: name.trim(),
            entries: [...currentEntries],
            createdAt: Date.now(),
        }

        presetsStore.addPreset(storageKey, preset)
        return true
    }

    function loadPreset(presetId: string): boolean {
        const preset = presets.value.find((p) => p.id === presetId)
        if (!preset) return false

        // Stash current history before loading preset
        const currentEntries = recentFilesStore.getEntries(storageKey)
        if (currentEntries.length > 0) {
            presetsStore.setStash(storageKey, {
                entries: [...currentEntries],
                stashedAt: Date.now(),
            })
        }

        // Load preset entries into history
        recentFilesStore.setEntries(storageKey, [...preset.entries])
        return true
    }

    function deletePreset(presetId: string): void {
        presetsStore.deletePreset(storageKey, presetId)
    }

    function restoreStash(): boolean {
        const currentStash = presetsStore.getStash(storageKey)
        if (!currentStash) return false

        recentFilesStore.setEntries(storageKey, [...currentStash.entries])
        presetsStore.clearStash(storageKey)
        return true
    }

    return {
        presets,
        stash,
        savePreset,
        loadPreset,
        deletePreset,
        restoreStash,
    }
}
