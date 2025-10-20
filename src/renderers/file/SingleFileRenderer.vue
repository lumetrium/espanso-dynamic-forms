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
			:dirty="!!boundSingle"
			show-size
			clearable
			persistent-clear
			:accept="acceptedTypes || undefined"
			v-bind="vuetifyProps('v-file-input')"
			:loading="isLoadingDefaults"
			@click:clear="clearAll"
			@update:modelValue="onFileChange"
			@focus="isFocused = true"
			@blur="isFocused = false"
		/>
		<template v-if="!isLoadingDefaults">
			<div
				v-if="boundSingle"
				class="mt-4"
			>
				<p class="text-caption">{{ t('selectedFile', 'Selected file') }}:</p>

				<div class="mb-2 mt-2">
					<FilePreview
						:src="localPreviews[0] || boundSingle.dataUrl"
						:t="t"
						:fallback-text="t('file', 'File')"
						:metadata="boundSingle"
						:width="220"
						:height="120"
						cover
						@remove="clearAll"
					/>
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
	boundSingle,
	onFileChange,
	isLoadingDefaults,
	localPreviews,
	clearAll,
	t,
} = useFileControl(props, false)
</script>

<style scoped>

</style>
