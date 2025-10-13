<template>
	<v-app theme="dark">
		<v-main>
			<v-container class="pa-0 pb-8">
				<v-card
					width="100%"
					class="mx-auto"
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
					<span v-text="t('submit', 'Submit')" />
				</v-btn>
			</v-container>
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import { extendedVuetifyRenderers } from '@jsonforms/vue-vuetify'
import { storeToRefs } from 'pinia'
import { markRaw, ref, watch } from 'vue'
import { JsonForms } from '@jsonforms/vue'
import { ajv } from './ajv.ts'
import { useJsonFormsI18n } from './i18n/useJsonFormsI18n.ts'
import { multipleFilesRendererEntry } from './renderers/file/MultipleFilesRenderer.entry.ts'
import { singleFileRendererEntry } from './renderers/file/SingleFileRenderer.entry.ts'
import { useEnvStore } from './stores/useEnvStore.ts'
import { useFormSchemaStore } from './stores/useFormSchemaStore.ts'
import { useTemplater } from './templater/useTemplater.ts'

const {
	schema,
	uischema,
	template,
	i18n: i18nSchema,
	data: initialData,
	isValid,
} = storeToRefs(useFormSchemaStore())

const { env } = storeToRefs(useEnvStore())

const renderers = markRaw([
	...extendedVuetifyRenderers,
	multipleFilesRendererEntry,
	singleFileRendererEntry,
])

const { t, jsonFormsI18n, setMessages, setLocale } = useJsonFormsI18n()
const { render, renderDeep } = useTemplater()

const errors = ref([])
const clipboardText = ref('')

async function populateClipboardText() {
	if (clipboardText.value) return
	clipboardText.value = await window.electronAPI.getClipboardText()
}

const data = ref({})

watch(i18nSchema, (i18n) => {
	setMessages(i18n)
	setLocale(env.value.LOCALE || 'en')
})

watch(initialData, async (initial) => {
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
</style>
