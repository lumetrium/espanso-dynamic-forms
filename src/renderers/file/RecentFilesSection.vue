<template>
	<v-expansion-panels
		v-if="entries.length > 0 || presets.length > 0"
		ref="containerRef"
		v-model="expanded"
		class="recent-files-section mt-3"
	>
		<v-expansion-panel elevation="0">
			<v-expansion-panel-title class="py-2 px-3">
				<v-icon
					icon="mdi-history"
					size="small"
					class="mr-2"
				/>
				<span class="text-body-2">
					{{ t('recentFiles', 'Recent files') }}
				</span>
				<v-chip
					size="x-small"
					class="ml-2"
					variant="tonal"
				>
					{{ entries.length }}
				</v-chip>
			</v-expansion-panel-title>

			<v-expansion-panel-text>
				<v-text-field
					v-model="searchQuery"
					:placeholder="t('searchRecentFiles', 'Search recent files...')"
					variant="outlined"
					density="compact"
					clearable
					hide-details
					class="mb-3"
				>
					<template #prepend-inner>
						<v-icon
							:icon="selectAllIcon"
							:color="
								areAllSelected || isIndeterminate
									? 'primary'
									: 'medium-emphasis'
							"
							size="small"
							class="mr-1 cursor-pointer"
							:disabled="disabled || filteredEntries.length === 0"
							@click.stop="onToggleSelectAll"
						>
							<v-tooltip
								activator="parent"
								location="top"
							>
								{{
									areAllSelected
										? t('deselectAll', 'Deselect all')
										: t('selectAll', 'Select all')
								}}
							</v-tooltip>
						</v-icon>
					</template>
				</v-text-field>

				<v-list
					density="compact"
					class="pa-0 recent-files-list"
				>
					<v-list-item
						v-for="entry in filteredEntries"
						:key="entry.id"
						class="px-1 recent-file-item"
						:value="entry.id"
						@click="onToggleSelection(entry, !isSelected(entry))"
					>
						<template #prepend>
							<div class="d-flex align-center mr-4">
								<v-checkbox-btn
									:model-value="isSelected(entry)"
									:disabled="disabled || loadingEntryId === entry.id"
									density="compact"
									:class="{ 'mr-2': showListIcons }"
									@click.stop
									@update:model-value="(val) => onToggleSelection(entry, val)"
								/>
								<v-icon
									v-if="showListIcons"
									:icon="getFileIcon(entry.fullName, entry.mime)"
									size="default"
									color="primary"
								/>
							</div>
						</template>

						<v-list-item-title class="text-body-2 d-flex align-center">
							<span class="text-truncate font-weight-medium">{{
								entry.fullName
							}}</span>
							<v-chip
								v-if="showListIcons"
								size="x-small"
								variant="tonal"
								color="secondary"
								class="ml-2 flex-shrink-0"
								style="height: 20px"
							>
								{{ formatSize(entry.size) }}
							</v-chip>
							<v-progress-circular
								v-if="loadingEntryId === entry.id"
								indeterminate
								size="14"
								width="2"
								class="ml-2 flex-shrink-0"
							/>
						</v-list-item-title>

						<v-list-item-subtitle class="text-caption text-truncate mt-1">
							<span
								v-if="entry.path"
								class="text-medium-emphasis"
								:title="entry.path"
							>
								{{ truncatePath(entry.path) }}
							</span>
						</v-list-item-subtitle>

						<template #append>
							<v-btn
								icon="mdi-close"
								size="x-small"
								variant="text"
								:disabled="disabled"
								:title="t('removeFromHistory', 'Remove from history')"
								@click.stop="onRemoveEntry(entry.id)"
							/>
						</template>
					</v-list-item>

					<v-list-item
						v-if="filteredEntries.length === 0 && searchQuery"
						class="text-center text-medium-emphasis"
					>
						<v-list-item-title class="text-body-2">
							{{ t('noMatchingFiles', 'No matching files found') }}
						</v-list-item-title>
					</v-list-item>
				</v-list>

				<div
					class="d-flex justify-space-between align-center mt-3 pt-2 actions-footer"
				>
					<v-btn
						v-if="selectedCount > 0"
						size="small"
						variant="tonal"
						color="primary"
						:disabled="disabled"
						@click="onAddSelected"
					>
						<v-icon
							icon="mdi-plus"
							size="small"
							:class="{ 'mr-1': showAddSelectedLabel }"
						/>
						<span v-if="showAddSelectedLabel">{{
							t('addSelected', 'Add selected')
						}}</span>
						<span class="ml-1">({{ selectedCount }})</span>
						<v-tooltip
							v-if="!showAddSelectedLabel"
							activator="parent"
							location="top"
						>
							{{ t('addSelected', 'Add selected') }}
						</v-tooltip>
					</v-btn>
					<v-spacer />
					<PresetsMenu
						:presets="presets"
						:stash="stash"
						:entries-count="entries.length"
						:disabled="disabled"
						:t="t"
						:compact="!showFooterLabels"
						@save-preset="onSavePreset"
						@load-preset="onLoadPreset"
						@delete-preset="onDeletePreset"
						@restore-stash="onRestoreStash"
					/>
					<v-menu
						v-model="showClearMenu"
						:close-on-content-click="false"
						location="top end"
						offset="8"
					>
						<template #activator="{ props: menuProps }">
							<v-btn
								v-bind="menuProps"
								size="small"
								variant="text"
								color="error"
								:disabled="disabled || entries.length === 0"
							>
								<v-icon
									:icon="showFooterLabels ? 'mdi-delete-outline' : 'mdi-delete'"
									size="small"
									:class="{ 'mr-1': showFooterLabels }"
								/>
								<span v-if="showFooterLabels">{{
									t('clearHistory', 'Clear history')
								}}</span>
								<v-tooltip
									v-if="!showFooterLabels"
									activator="parent"
									location="top"
								>
									{{ t('clearHistory', 'Clear history') }}
								</v-tooltip>
							</v-btn>
						</template>
						<v-card min-width="200">
							<v-card-text class="pa-2 text-center">
								<div class="text-caption mb-2">
									{{ t('confirmClearMessage', 'Clear all history?') }}
								</div>
								<v-btn
									block
									color="error"
									variant="flat"
									size="small"
									@click="confirmClearAll"
								>
									{{ t('confirm', 'Confirm') }}
								</v-btn>
							</v-card-text>
						</v-card>
					</v-menu>
				</div>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { VMenu } from 'vuetify/components'
import {
	VBtn,
	VCard,
	VCardText,
	VCheckboxBtn,
	VChip,
	VExpansionPanel,
	VExpansionPanels,
	VExpansionPanelText,
	VExpansionPanelTitle,
	VIcon,
	VList,
	VListItem,
	VListItemSubtitle,
	VListItemTitle,
	VProgressCircular,
	VSpacer,
	VTextField,
	VTooltip,
} from 'vuetify/components'
import type { RecentFileEntry, RecentFilePreset, PresetsStash } from './types'
import { useFileUtils } from './useFileUtils'
import PresetsMenu from './PresetsMenu.vue'

const props = defineProps<{
	entries: RecentFileEntry[]
	selectedEntryIds: string[]
	disabled?: boolean
	loadingEntryId?: string | null
	t: (key: string, defaultText: string, vars?: Record<string, any>) => string
	// Presets
	presets: RecentFilePreset[]
	stash: PresetsStash | null
}>()

const emit = defineEmits<{
	(e: 'select', entry: RecentFileEntry): void
	(e: 'deselect', id: string): void
	(e: 'add-selected'): void
	(e: 'remove-entry', id: string): void
	(e: 'clear-all'): void
	(e: 'select-all', entries: RecentFileEntry[]): void
	(e: 'deselect-all', entries: RecentFileEntry[]): void
	(e: 'save-preset', name: string): void
	(e: 'load-preset', presetId: string): void
	(e: 'delete-preset', presetId: string): void
	(e: 'restore-stash'): void
}>()

const { formatFileSize: formatSize, getFileIcon } = useFileUtils()

const expanded = ref<number | undefined>(undefined)
const searchQuery = ref('')
const showClearMenu = ref(false)

const containerRef = ref<HTMLElement | null>(null)
const { width: containerWidth } = useElementSize(containerRef)

const showFooterLabels = computed(() => containerWidth.value > 450)
const showAddSelectedLabel = computed(() => containerWidth.value > 350)
const showListIcons = computed(() => containerWidth.value > 300)

const filteredEntries = computed(() => {
	if (!searchQuery.value.trim()) return props.entries
	const query = searchQuery.value.toLowerCase()
	return props.entries.filter(
		(entry) =>
			entry.fullName.toLowerCase().includes(query) ||
			entry.mime.toLowerCase().includes(query) ||
			entry.path.toLowerCase().includes(query),
	)
})

const selectedCount = computed(() => props.selectedEntryIds.length)

const areAllSelected = computed(() => {
	if (filteredEntries.value.length === 0) return false
	return filteredEntries.value.every((entry) =>
		props.selectedEntryIds.includes(entry.id),
	)
})

const isIndeterminate = computed(() => {
	if (filteredEntries.value.length === 0) return false
	const selectedInView = filteredEntries.value.filter((entry) =>
		props.selectedEntryIds.includes(entry.id),
	).length
	return selectedInView > 0 && selectedInView < filteredEntries.value.length
})

const selectAllIcon = computed(() => {
	if (areAllSelected.value) return 'mdi-checkbox-marked'
	if (isIndeterminate.value) return 'mdi-minus-box'
	return 'mdi-checkbox-blank-outline'
})

function onToggleSelectAll(_val?: any): void {
	if (areAllSelected.value) {
		// Deselect currently filtered entries
		const entriesToDeselect = filteredEntries.value.filter((e) =>
			props.selectedEntryIds.includes(e.id),
		)
		emit('deselect-all', entriesToDeselect)
	} else {
		// Select all currently filtered entries
		emit('select-all', filteredEntries.value)
	}
}

function isSelected(entry: RecentFileEntry): boolean {
	return props.selectedEntryIds.includes(entry.id)
}

function onToggleSelection(
	entry: RecentFileEntry,
	selected: boolean | null,
): void {
	if (selected) {
		emit('select', entry)
	} else {
		emit('deselect', entry.id)
	}
}

function onRemoveEntry(id: string): void {
	emit('remove-entry', id)
}

function confirmClearAll(): void {
	showClearMenu.value = false
	emit('clear-all')
}

function onAddSelected(): void {
	emit('add-selected')
}

function onSavePreset(name: string): void {
	emit('save-preset', name)
}

function onLoadPreset(presetId: string): void {
	emit('load-preset', presetId)
}

function onDeletePreset(presetId: string): void {
	emit('delete-preset', presetId)
}

function onRestoreStash(): void {
	emit('restore-stash')
}

function truncatePath(path: string, maxLength: number = 50): string {
	if (path.length <= maxLength) return path
	const separator = path.includes('\\') ? '\\' : '/'
	const parts = path.split(separator)
	const fileName = parts.pop() || ''
	if (fileName.length >= maxLength - 3) {
		return '...' + fileName.slice(-(maxLength - 3))
	}
	const remaining = maxLength - fileName.length - 4
	const pathStart = parts.join(separator).slice(0, remaining)
	return pathStart + '...' + separator + fileName
}
</script>

<style scoped>
.recent-files-section {
	border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
	border-radius: 4px;
}

.recent-files-section :deep(.v-expansion-panel-title) {
	min-height: 44px;
}

.recent-files-section :deep(.v-expansion-panel-text__wrapper) {
	padding: 12px;
}

.recent-files-list {
	max-height: 280px;
	overflow-y: auto;
	border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
	border-radius: 4px;
}

.recent-file-item {
	border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}

.recent-file-item:last-child {
	border-bottom: none;
}

.actions-footer {
	border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.cursor-pointer {
	cursor: pointer;
}
</style>
