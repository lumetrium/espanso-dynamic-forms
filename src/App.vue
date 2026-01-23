<template>
	<DirectLaunchPage v-if="isDirectLaunch" />
	<FormNotFoundPage v-else-if="isFormNotFound" />
	<v-app v-else theme="dark">
		<v-main>
			<v-container class="pa-0 pb-15">
				<v-card
					width="100%"
					class="mx-auto elevation-0"
				>
					<v-card-text class="pa-0">
						<json-forms
							v-if="isValid"
							:data="data"
							:schema="schema"
							:uischema="uischema"
							:renderers="renderers"
							:i18n="jsonFormsI18n"
							:ajv="ajv"
							@change="onChange"
						/>
					</v-card-text>
				</v-card>

				<v-btn
					class="submit-btn"
					color="primary"
					variant="elevated"
					:disabled="!!errors.length"
					@click="submitForm"
				>
					<v-tooltip
						location="top"
						:activator="`parent`"
					>
						{{ submitHotkeyDisplay }}
					</v-tooltip>
					<span v-text="t('submit', 'Submit')" />
				</v-btn>
			</v-container>
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import { extendedVuetifyRenderers } from '@jsonforms/vue-vuetify'
import { storeToRefs } from 'pinia'
import { computed, markRaw, ref, watch } from 'vue'
import { JsonForms } from '@jsonforms/vue'
import { ajv } from './ajv.ts'
import DirectLaunchPage from './components/DirectLaunchPage.vue'
import FormNotFoundPage from './components/FormNotFoundPage.vue'
import { useJsonFormsI18n } from './i18n/useJsonFormsI18n.ts'
import { multipleFilesRendererEntry } from './renderers/file/MultipleFilesRenderer.entry.ts'
import { singleFileRendererEntry } from './renderers/file/SingleFileRenderer.entry.ts'
import { useEnvStore } from './stores/useEnvStore.ts'
import { useFormSchemaStore } from './stores/useFormSchemaStore.ts'
import { useTemplater } from './templater/useTemplater.ts'
import { useFormHotkeys } from './composables/useFormHotkeys.ts'

const {
	schema,
	uischema,
	template,
	i18n: i18nSchema,
	data: initialData,
	isValid,
	fullSchema,
} = storeToRefs(useFormSchemaStore())

const { env } = storeToRefs(useEnvStore())

// Show DirectLaunchPage when app is launched directly (not via espanso)
// This is detected via EDF_DIRECT_LAUNCH env variable set by the main process
const isDirectLaunch = computed(() => env.value.EDF_DIRECT_LAUNCH === 'true')

// Show FormNotFoundPage when a form config path was provided but file doesn't exist
const isFormNotFound = computed(() => env.value.EDF_FORM_NOT_FOUND === 'true')

const renderers = markRaw([
	...extendedVuetifyRenderers,
	multipleFilesRendererEntry,
	singleFileRendererEntry,
])

const { t, jsonFormsI18n, setMessages, setLocale } = useJsonFormsI18n()
const { render, renderDeep } = useTemplater()

const errors = ref([])
const clipboardText = ref('')
const data = ref({})

const resetForm = () => {
	if (initialData.value) {
		data.value = {}
		populateDataFromInitial()
	} else {
		data.value = {}
	}
}

const closeForm = () => {
	window.close()
}

const canSubmit = computed(() => !errors.value.length)

const { submitHotkeyDisplay } = useFormHotkeys({
	fullSchema,
	onSubmit: submitForm,
	onReset: resetForm,
	onClose: closeForm,
	canSubmit,
})

async function populateClipboardText() {
	if (clipboardText.value) return
	clipboardText.value = await window.electronAPI.getClipboardText()
}

async function populateDataFromInitial() {
	const initial = initialData.value
	if (!initial) return

	try {
		await populateClipboardText()
		data.value = renderDeep(initial, {
			env: env.value,
			clipboard: clipboardText.value,
			...initial,
		})
	} catch (error) {
		console.error('Failed to process initial data:', error)
	}
}

watch(i18nSchema, (i18n) => {
	setMessages(i18n)
	setLocale(env.value.LOCALE || 'en')
})

watch(initialData, async () => {
	await populateDataFromInitial()
})

async function submitForm() {
	if (!template.value) {
		window.electronAPI.sendResult(JSON.stringify(data.value))
	} else {
		const templateString = Array.isArray(template.value)
			? template.value.join('\n')
			: template.value
		const result = render(templateString, {
			env: env.value,
			clipboard: clipboardText.value,
			...data.value,
		})
		window.electronAPI.sendResult(result)
	}
}

function onChange(event: any) {
	data.value = event.data
	errors.value = event.errors
}
</script>

<style>
.v-main {
	background: rgb(var(--v-theme-surface));
}

.v-container {
	padding: 0;
	max-width: none !important;
}

.v-col.horizontal-layout-item:first-child {
	padding-left: 0;
	padding-right: 6px;
}

.v-col.horizontal-layout-item:last-child {
	padding-right: 0;
	padding-left: 6px;
}

.vertical-layout-item:has(> .horizontal-layout-item) {
	padding-top: 0;
	padding-bottom: 0;
}

.vertical-layout-item {
	padding-bottom: 0;
}

.v-row > .v-window,
.v-row,
.v-table {
	width: 100%;
}

.array-list-item,
.array-list-item > td:has(.control) {
	width: 100%;
}

.array-list-item td {
	padding: 0 !important;
}

.submit-btn {
	position: fixed;
	bottom: 16px;
	right: 16px;
	z-index: 1000;
}

.v-row {
	margin: auto;
}

.v-input.vertical .v-field__field > .d-flex:has(> .v-input) {
	flex-flow: column;
	width: 100%;
	padding: 16px 12px 8px;
}

.v-input.vertical .v-field__field .v-checkbox-btn {
	--v-input-control-height: 36px;
}

.fixed-cell-small {
	vertical-align: top;
}

.vertical-layout-item:empty,
.v-row:has(> .v-col:empty) {
	display: none;
}
</style>
