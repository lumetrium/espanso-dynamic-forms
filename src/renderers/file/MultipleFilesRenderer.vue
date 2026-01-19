<template>
	<div v-if="control.visible">
		<v-file-input
			:id="control.id"
			:label="computedLabel"
			:model-value="files"
			:disabled="!control.enabled"
			:autofocus="appliedOptions.focus"
			:placeholder="appliedOptions.placeholder"
			:error-messages="control.errors"
			:hint="control.description"
			:persistent-hint="persistentHint()"
			:required="control.required"
			:dirty="boundArray?.length > 0"
			show-size
			clearable
			multiple
			persistent-clear
			:accept="acceptedTypes || undefined"
			v-bind="vuetifyProps('v-file-input')"
			:loading="isLoadingDefaults"
			@click:clear="clearAll"
			@update:modelValue="onFileChange"
			@focus="isFocused = true"
			@blur="isFocused = false"
		/>

		<RecentFilesSection
			v-if="recentFilesEnabled"
			:entries="recentFilesEntries"
			:selected-entry-ids="selectedRecentIds"
			:disabled="!control.enabled"
			:loading-entry-id="loadingRecentEntryId"
			:t="t"
			:presets="presets"
			:stash="presetsStash"
			@select="selectRecentEntry"
			@deselect="deselectRecentEntry"
			@add-selected="addSelectedRecentFiles"
			@remove-entry="removeRecentEntry"
			@clear-all="clearRecentHistory"
			@select-all="selectAllRecent"
			@deselect-all="deselectAllRecent"
			@save-preset="savePreset"
			@load-preset="loadPreset"
			@delete-preset="deletePreset"
			@restore-stash="restorePresetsStash"
		/>

		<template v-if="!isLoadingDefaults">
			<div
				v-if="boundArray?.length"
				class="mt-4"
			>
				<p class="text-caption">{{ t('selectedFiles', 'Selected files') }}:</p>

				<div class="d-flex flex-wrap ga-4 mt-2">
					<div
						v-for="(metadata, i) in boundArray"
						:key="`selected-${i}`"
						class="d-flex flex-column align-center"
					>
						<FilePreview
							:src="localPreviews[i] || metadata.dataUrl"
							:t="t"
							:fallback-text="t('fileNumber', 'File {index}', { index: i + 1 })"
							:metadata="metadata"
							:width="220"
							:height="120"
							cover
							:disabled="!control.enabled"
							@remove="removeSelectedAt(i)"
						/>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { type ControlElement } from '@jsonforms/core'
import { rendererProps } from '@jsonforms/vue'
import { VFileInput } from 'vuetify/components'
import FilePreview from './FilePreview.vue'
import RecentFilesSection from './RecentFilesSection.vue'
import { useFileControl } from './useFileControl'

const props = defineProps(rendererProps<ControlElement>())

const {
	control,
	files,
	appliedOptions,
	isFocused,
	computedLabel,
	persistentHint,
	vuetifyProps,
	acceptedTypes,
	boundArray,
	onFileChange,
	removeSelectedAt,
	isLoadingDefaults,
	localPreviews,
	clearAll,
	t,
	recentFilesEnabled,
	recentFilesEntries,
	selectedRecentIds,
	loadingRecentEntryId,
	selectRecentEntry,
	deselectRecentEntry,
	addSelectedRecentFiles,
	removeRecentEntry,
	clearRecentHistory,
	selectAllRecent,
	deselectAllRecent,
	// Presets
	presets,
	presetsStash,
	savePreset,
	loadPreset,
	deletePreset,
	restorePresetsStash,
} = useFileControl(props, true)
</script>
