<template>
	<v-menu
		v-model="menuOpen"
		:close-on-content-click="false"
		location="top start"
		offset="8"
		:transition="menuTransition"
	>
		<template #activator="{ props: menuProps }">
			<v-btn
				v-bind="menuProps"
				size="small"
				variant="text"
				color="primary"
				:disabled="disabled"
			>
				<v-icon
					icon="mdi-bookmark-outline"
					size="small"
					:class="{ 'mr-1': !compact }"
				/>
				<span v-if="!compact">{{ t('presets', 'Presets') }}</span>
				<v-tooltip
					v-if="compact"
					activator="parent"
					location="top"
				>
					{{ t('presets', 'Presets') }}
				</v-tooltip>
			</v-btn>
		</template>

		<v-card
			class="presets-menu-card"
			min-width="280"
			max-width="320"
		>
			<v-card-title class="text-body-1 py-2 px-3 d-flex align-center">
				<v-icon
					icon="mdi-bookmark-multiple-outline"
					size="small"
					class="mr-2"
				/>
				{{ t('managePresets', 'Manage presets') }}
			</v-card-title>

			<v-divider />

			<div class="px-3 pt-3 pb-2">
				<!-- Save as preset -->
				<div
					v-if="!isCreating"
					class="d-flex gap-2"
				>
					<v-btn
						block
						size="small"
						variant="tonal"
						color="primary"
						:disabled="entriesCount === 0"
						@click="startCreating"
					>
						<v-icon
							icon="mdi-plus"
							size="small"
							class="mr-1"
						/>
						{{ t('saveAsPreset', 'Save current as preset') }}
					</v-btn>
				</div>

				<!-- Create preset input -->
				<div
					v-else
					class="d-flex gap-2 align-center"
				>
					<v-text-field
						v-model="newPresetName"
						:placeholder="t('presetName', 'Preset name...')"
						variant="outlined"
						density="compact"
						hide-details
						autofocus
						class="flex-grow-1"
						@keyup.enter="confirmCreate"
						@keyup.escape="cancelCreate"
					/>
					<v-btn
						icon
						size="small"
						variant="text"
						color="success"
						:disabled="!newPresetName.trim()"
						@click="confirmCreate"
					>
						<v-icon
							icon="mdi-check"
							size="small"
						/>
					</v-btn>
					<v-btn
						icon
						size="small"
						variant="text"
						color="error"
						@click="cancelCreate"
					>
						<v-icon
							icon="mdi-close"
							size="small"
						/>
					</v-btn>
				</div>
			</div>

			<v-divider class="my-2" />

			<!-- Search presets -->
			<div
				v-if="presets.length > 0"
				class="px-3 pb-2"
			>
				<v-text-field
					v-model="searchQuery"
					:placeholder="t('searchPresets', 'Search presets...')"
					prepend-inner-icon="mdi-magnify"
					variant="outlined"
					density="compact"
					clearable
					hide-details
				/>
			</div>

			<!-- Presets list -->
			<v-list
				v-if="filteredPresets.length > 0"
				density="compact"
				class="presets-list pa-0"
			>
				<v-list-item
					v-for="preset in filteredPresets"
					:key="preset.id"
					class="px-3"
					@click="onLoadPreset(preset.id)"
				>
					<template #prepend>
						<v-icon
							icon="mdi-bookmark"
							size="small"
							color="primary"
						/>
					</template>

					<v-list-item-title class="text-body-2">
						{{ preset.name }}
					</v-list-item-title>

					<v-list-item-subtitle class="text-caption">
						{{
							t('filesCount', '{count} files', { count: preset.entries.length })
						}}
					</v-list-item-subtitle>

					<template #append>
						<v-btn
							icon
							size="x-small"
							variant="text"
							color="error"
							:title="t('deletePreset', 'Delete preset')"
							@click.stop="onDeletePreset(preset.id)"
						>
							<v-icon
								icon="mdi-delete-outline"
								size="small"
							/>
						</v-btn>
					</template>
				</v-list-item>
			</v-list>

			<!-- Empty state -->
			<div
				v-else-if="presets.length === 0"
				class="px-3 py-4 text-center text-medium-emphasis"
			>
				<v-icon
					icon="mdi-bookmark-off-outline"
					size="large"
					class="mb-2"
				/>
				<div class="text-body-2">
					{{ t('noPresets', 'No presets saved yet') }}
				</div>
			</div>

			<!-- No search results -->
			<div
				v-else-if="searchQuery && filteredPresets.length === 0"
				class="px-3 py-4 text-center text-medium-emphasis"
			>
				<div class="text-body-2">
					{{ t('noMatchingPresets', 'No matching presets') }}
				</div>
			</div>

			<!-- Restore stash option -->
			<template v-if="hasStash">
				<v-divider class="my-2" />
				<div class="px-3 pb-3">
					<v-btn
						block
						size="small"
						variant="outlined"
						color="warning"
						@click="onRestoreStash"
					>
						<v-icon
							icon="mdi-undo"
							size="small"
							class="mr-1"
						/>
						{{ t('restorePrevious', 'Restore previous history') }}
					</v-btn>
				</div>
			</template>
		</v-card>
	</v-menu>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
	VBtn,
	VCard,
	VCardTitle,
	VDivider,
	VIcon,
	VTooltip,
	VList,
	VListItem,
	VListItemSubtitle,
	VListItemTitle,
	VMenu,
	VTextField,
} from 'vuetify/components'
import type { RecentFilePreset, PresetsStash } from './types'

const props = defineProps<{
	presets: RecentFilePreset[]
	stash: PresetsStash | null
	entriesCount: number
	disabled?: boolean
	compact?: boolean
	t: (key: string, defaultText: string, vars?: Record<string, any>) => string
}>()

const emit = defineEmits<{
	(e: 'save-preset', name: string): void
	(e: 'load-preset', presetId: string): void
	(e: 'delete-preset', presetId: string): void
	(e: 'restore-stash'): void
}>()

const menuOpen = ref(false)
const searchQuery = ref('')
const isCreating = ref(false)
const newPresetName = ref('')
const useInstantClose = ref(false)

const hasStash = computed(() => props.stash !== null)

// Use no transition when closing instantly
const menuTransition = computed(() => {
	if (useInstantClose.value) {
		return false
	}
	return 'scale-transition'
})

const filteredPresets = computed(() => {
	if (!searchQuery.value.trim()) return props.presets
	const query = searchQuery.value.toLowerCase()
	return props.presets.filter((preset) =>
		preset.name.toLowerCase().includes(query),
	)
})

function closeMenuInstantly(): void {
	useInstantClose.value = true
	menuOpen.value = false
	// Reset the flag after menu closes
	setTimeout(() => {
		useInstantClose.value = false
	}, 50)
}

function startCreating(): void {
	isCreating.value = true
	newPresetName.value = ''
}

function cancelCreate(): void {
	isCreating.value = false
	newPresetName.value = ''
}

function confirmCreate(): void {
	if (!newPresetName.value.trim()) return
	emit('save-preset', newPresetName.value.trim())
	isCreating.value = false
	newPresetName.value = ''
}

function onLoadPreset(presetId: string): void {
	emit('load-preset', presetId)
	closeMenuInstantly()
}

function onDeletePreset(presetId: string): void {
	emit('delete-preset', presetId)
}

function onRestoreStash(): void {
	emit('restore-stash')
	closeMenuInstantly()
}
</script>

<style scoped>
.presets-menu-card {
	border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.presets-list {
	max-height: 200px;
	overflow-y: auto;
}

.presets-list :deep(.v-list-item) {
	border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}

.presets-list :deep(.v-list-item:last-child) {
	border-bottom: none;
}

.presets-list:deep(.v-list-item__spacer) {
	width: 12px;
}
</style>
