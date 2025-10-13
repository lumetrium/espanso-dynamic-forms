<template>
	<div
		class="file-preview"
		:style="style"
	>
		<!-- Images -->
		<v-img
			v-if="isImage"
			:src="src"
			:width="width"
			:height="height"
			:content-class="contentClass"
			:cover="cover"
			alt="File preview"
		/>

		<!-- PDF -->
		<embed
			v-else-if="isPdf"
			:src="src"
			type="application/pdf"
			:width="width || '100%'"
			:height="height || '100%'"
			:class="contentClass"
		/>

		<!-- Video -->
		<video
			v-else-if="isVideo"
			:src="src"
			controls
			:width="width || '100%'"
			:height="height"
			:class="contentClass"
		/>

		<!-- Audio -->
		<audio
			v-else-if="isAudio"
			:src="src"
			controls
			:class="contentClass"
		/>

		<!-- Text/Code -->
		<div
			v-else-if="isText"
			class="w-100 h-100"
		>
			<pre
				v-if="decodedText"
				:class="contentClass"
				v-text="decodedText"
			/>
			<v-icon
				:icon="fileIcon"
				:size="64"
				class="ma-auto"
			/>
		</div>

		<!-- Generic Object (for other types) -->
		<object
			v-else-if="showObject"
			:data="src"
			:type="mime"
			:width="'100%'"
			:height="'100%'"
			:class="contentClass"
			class="d-flex align-center justify-center"
		>
			<div :class="fallbackClass">
				<v-icon
					:icon="fileIcon"
					:size="64"
					class="ma-auto"
				/>
			</div>
		</object>

		<!-- Fallback -->
		<div
			v-else
			:class="fallbackClass"
			class="d-flex align-center justify-center w-100 h-100"
		>
			<div :class="fallbackClass">
				<v-icon
					:icon="fileIcon"
					:size="64"
					class="ma-auto"
				/>
			</div>
		</div>
	</div>

	<div
		class="text-caption text-medium-emphasis text-center mb-1 mt-2"
		:style="{ width: widthPx || '100%' }"
		v-if="metadata"
	>
		{{ metadata.fullName }}<br />({{ formatSize(metadata.size) }})
	</div>

	<div
		class="text-center"
		:style="{ width: widthPx || '100%' }"
	>
		<v-btn
			variant="text"
			size="x-small"
			color="error"
			class="text-center"
			:disabled="disabled"
			@click="emit('remove')"
		>
			<span v-text="t('remove', 'Remove')" />
		</v-btn>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { VBtn, VIcon, VImg } from 'vuetify/components'
import type { FileMetadata } from './types'
import { useFileUtils } from './useFileUtils.ts'
import mimeTypes from 'mime'

const props = defineProps<{
	src: string
	metadata: FileMetadata
	fallbackText?: string
	width?: string | number
	height?: string | number
	contentClass?: string
	fallbackClass?: string
	textClass?: string
	textStyle?: Record<string, any>
	cover?: boolean
	allowDownload?: boolean
	disabled?: boolean
	t: (key: string, defaultText: string, vars?: Record<string, any>) => string
}>()

const emit = defineEmits<{
	(e: 'remove'): void
}>()

const { formatFileSize: formatSize } = useFileUtils()

const mime = computed(
	() => props.metadata?.mime || mimeTypes.getType(props.src) || undefined,
)

const ext = computed(() => props.metadata?.extension || '')

const isImage = computed(() => {
	return mime.value?.startsWith('image/') ?? false
})

const isPdf = computed(() => mime.value === 'application/pdf')

const isVideo = computed(() => mime.value?.startsWith('video/') ?? false)

const isAudio = computed(() => mime.value?.startsWith('audio/') ?? false)

const isText = computed(() => {
	return (
		mime.value?.startsWith('text/') ||
		mime.value === 'application/json' ||
		mime.value === 'application/xml' ||
		ext.value === 'md' ||
		ext.value === 'yml' ||
		ext.value === 'yaml' ||
		ext.value === 'json' ||
		ext.value === 'txt' ||
		ext.value === 'xml' ||
		ext.value === 'csv'
	)
})

const showObject = computed(() => {
	return (
		!isImage.value &&
		!isPdf.value &&
		!isVideo.value &&
		!isAudio.value &&
		!isText.value &&
		mime.value
	)
})

const widthPx = computed(() => {
	if (!props.width) return undefined
	return typeof props.width === 'number' ? `${props.width}px` : props.width
})

const heightPx = computed(() => {
	if (!props.height) return undefined
	return typeof props.height === 'number' ? `${props.height}px` : props.height
})

const style = computed(() => ({
	width: widthPx.value || '100%',
	height: heightPx.value || '100%',
	minWidth: '64px',
	minHeight: '64px',
	border: '1px solid rgba(var(--v-theme-on-surface), 0.12)',
	borderRadius: '4px',
	background: 'rgba(var(--v-theme-surface), 1)',
}))

// Decode base64 text for display
const decodedText = computed(() => {
	if (!isText.value || !props.metadata) return ''
	try {
		return atob(props.metadata.base64)
	} catch (error) {
		return 'Error decoding text'
	}
})

// Dynamic icon based on file type
const fileIcon = computed(() => {
	if (isPdf.value) return 'mdi-file-pdf-box'
	if (isVideo.value) return 'mdi-video'
	if (isAudio.value) return 'mdi-music'
	if (isText.value) return 'mdi-file-code'
	return 'mdi-file-document-outline'
})
</script>

<style scoped>
.file-preview {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

pre {
	height: 100%;
	white-space: pre-wrap;
	word-break: break-word;
	font-family: inherit;
	margin: 0;
	max-height: 250px;
	overflow: auto;
	background: rgba(var(--v-theme-background), 1);
	padding: 8px 12px;
}
</style>
