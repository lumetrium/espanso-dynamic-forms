<template>
	<v-app theme="dark">
		<v-main class="form-not-found-page">
			<v-container class="main-container">
				<!-- Header Section -->
				<div class="header-section">
					<div class="logo-wrapper">
						<v-icon icon="mdi-file-alert-outline" size="72" class="error-icon" />
					</div>
					<h1 class="app-title">Form Configuration Not Found</h1>
					<p class="subtitle">
						The specified form configuration file does not exist.
					</p>
				</div>

				<!-- Error Details Card -->
				<v-card class="error-card">
					<v-card-text>
						<div class="error-content">
							<v-icon
								icon="mdi-file-question-outline"
								size="24"
								class="error-detail-icon"
							/>
							<div>
								<p class="error-label">Attempted path:</p>
								<code class="error-path">{{ formConfigPath || 'Not specified' }}</code>
							</div>
						</div>
					</v-card-text>
				</v-card>

				<!-- Quick Fix Section -->
				<div class="section">
					<h2 class="section-title">
						<v-icon icon="mdi-wrench" class="section-icon" />
						Quick Fix
					</h2>

					<!-- Option 1: Create the file -->
					<v-card class="action-card">
						<v-card-text>
							<div class="action-header">
								<div class="action-title-row">
									<v-icon icon="mdi-file-plus-outline" class="action-icon create-icon" />
									<div>
										<p class="action-title">Create this file</p>
										<p class="action-description">
											Create a demo form at the expected path
										</p>
									</div>
								</div>
								<v-btn
									color="primary"
									variant="elevated"
									:prepend-icon="createStatus === 'success' ? 'mdi-check' : 'mdi-plus'"
									:loading="createStatus === 'loading'"
									:disabled="createStatus === 'success'"
									@click="createMissingFile"
								>
									{{ createStatus === 'success' ? 'Created!' : 'Create File' }}
								</v-btn>
							</div>
						</v-card-text>
					</v-card>

					<!-- Option 2: Open folder -->
					<v-card class="action-card">
						<v-card-text>
							<div class="action-header">
								<div class="action-title-row">
									<v-icon icon="mdi-folder-open-outline" class="action-icon folder-icon" />
									<div>
										<p class="action-title">Open containing folder</p>
										<p class="action-description">
											Navigate to the folder manually
										</p>
									</div>
								</div>
								<v-btn
									color="secondary"
									variant="tonal"
									prepend-icon="mdi-open-in-new"
									@click="openFolder"
								>
									Open Folder
								</v-btn>
							</div>
						</v-card-text>
					</v-card>
				</div>

				<!-- Troubleshooting Section -->
				<div class="section">
					<h2 class="section-title">
						<v-icon icon="mdi-help-circle-outline" class="section-icon" />
						Common Causes
					</h2>

					<v-card class="tips-card">
						<v-card-text>
							<ul class="tips-list">
								<li>
									<v-icon icon="mdi-checkbox-blank-circle" size="8" class="bullet" />
									<span>The file path contains a typo</span>
								</li>
								<li>
									<v-icon icon="mdi-checkbox-blank-circle" size="8" class="bullet" />
									<span>The file was moved or deleted</span>
								</li>
								<li>
									<v-icon icon="mdi-checkbox-blank-circle" size="8" class="bullet" />
									<span>The path uses wrong slashes for your OS</span>
								</li>
							</ul>
						</v-card-text>
					</v-card>
				</div>

				<!-- Collapsible Demo Form Config -->
				<div class="section">
					<v-expansion-panels>
						<v-expansion-panel>
							<v-expansion-panel-title>
								<div class="panel-title-content">
									<v-icon icon="mdi-code-json" class="panel-icon" />
									<span>View example form configuration</span>
								</div>
							</v-expansion-panel-title>
							<v-expansion-panel-text>
								<div class="code-header">
									<span class="code-label">demo.yml</span>
									<v-btn
										variant="text"
										size="small"
										:prepend-icon="copiedItem === 'formConfig' ? 'mdi-check' : 'mdi-content-copy'"
										:color="copiedItem === 'formConfig' ? 'success' : 'default'"
										@click="copyToClipboard(demoFormConfig, 'formConfig')"
									>
										{{ copiedItem === 'formConfig' ? 'Copied!' : 'Copy' }}
									</v-btn>
								</div>
								<pre class="code-block"><code>{{ demoFormConfig }}</code></pre>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>

				<!-- Resources Section -->
				<div class="section">
					<h2 class="section-title">
						<v-icon icon="mdi-book-open-variant" class="section-icon" />
						Resources
					</h2>

					<div class="links-grid">
						<v-card
							class="link-card"
							@click="openExternalUrl('https://lumetrium.com/espanso-dynamic-forms/docs/')"
						>
							<v-card-text class="link-card-content">
								<v-icon
									icon="mdi-file-document-outline"
									size="28"
									class="link-icon docs-icon"
								/>
								<div>
									<p class="link-title">Documentation</p>
									<p class="link-description">Learn about form configs</p>
								</div>
								<v-icon icon="mdi-open-in-new" size="16" class="external-icon" />
							</v-card-text>
						</v-card>

						<v-card
							class="link-card"
							@click="openExternalUrl('https://github.com/lumetrium/espanso-dynamic-forms/issues/new?template=bug_report.md')"
						>
							<v-card-text class="link-card-content">
								<v-icon
									icon="mdi-bug-outline"
									size="28"
									class="link-icon bug-icon"
								/>
								<div>
									<p class="link-title">Report Issue</p>
									<p class="link-description">Something wrong? Let us know</p>
								</div>
								<v-icon icon="mdi-open-in-new" size="16" class="external-icon" />
							</v-card-text>
						</v-card>
					</div>
				</div>
			</v-container>
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEnvStore } from '../stores/useEnvStore.ts'

const { env } = storeToRefs(useEnvStore())

const copiedItem = ref<string | null>(null)
const createStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

const formConfigPath = computed(() => env.value.EDF_FORM_CONFIG_PATH_RENDERED || env.value.EDF_FORM_CONFIG_PATH || '')

const demoFormConfig = `schema:
  type: object
  properties:
    name:
      type: string
      title: Your Name
    message:
      type: string
      title: Message
    priority:
      type: string
      enum:
        - High
        - Medium
        - Low
  required:
    - name
    - message

uischema:
  type: VerticalLayout
  elements:
    - type: Control
      scope: "#/properties/name"
    - type: Control
      scope: "#/properties/message"
      options:
        multi: true
    - type: Control
      scope: "#/properties/priority"

data:
  priority: Medium

template: |
  From: {{name}}
  Priority: {{priority | upcase}}

  {{message}}`

async function createMissingFile() {
	if (!formConfigPath.value || !window.electronAPI) return

	createStatus.value = 'loading'
	try {
		await window.electronAPI.createDemoConfig(formConfigPath.value, demoFormConfig)
		createStatus.value = 'success'
	} catch (err) {
		console.error('Failed to create file:', err)
		createStatus.value = 'error'
	}
}

async function openFolder() {
	if (!formConfigPath.value || !window.electronAPI) return

	try {
		// Try to show parent folder
		const parentPath = formConfigPath.value.replace(/[/\\][^/\\]*$/, '')
		await window.electronAPI.shellOpenPath(parentPath)
	} catch (err) {
		console.error('Failed to open folder:', err)
	}
}

async function copyToClipboard(text: string, itemType: string) {
	try {
		await navigator.clipboard.writeText(text)
		copiedItem.value = itemType
		setTimeout(() => {
			copiedItem.value = null
		}, 2000)
	} catch (err) {
		console.error('Failed to copy:', err)
	}
}

async function openExternalUrl(url: string) {
	if (window.electronAPI) {
		try {
			await window.electronAPI.shellOpenExternal(url)
		} catch (err) {
			console.error('Failed to open URL:', err)
			// Fallback to window.open
			window.open(url, '_blank')
		}
	} else {
		window.open(url, '_blank')
	}
}
</script>

<style scoped>
.form-not-found-page {
	background: linear-gradient(135deg, #2d1a1a 0%, #1a1a2e 50%, #16213e 100%);
	min-height: 100vh;
}

.main-container {
	max-width: 680px !important;
	padding: 32px 24px !important;
}

.header-section {
	text-align: center;
	margin-bottom: 28px;
}

.logo-wrapper {
	margin-bottom: 16px;
}

.error-icon {
	color: #ff6b6b;
}

.app-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: #ff8a8a;
	margin-bottom: 8px;
}

.subtitle {
	color: rgba(255, 255, 255, 0.7);
	font-size: 1rem;
}

.error-card {
	background: rgba(255, 107, 107, 0.1) !important;
	border: 1px solid rgba(255, 107, 107, 0.3) !important;
	border-radius: 12px !important;
	margin-bottom: 28px;
}

.error-content {
	display: flex;
	gap: 16px;
	align-items: flex-start;
}

.error-detail-icon {
	color: #ff6b6b;
	flex-shrink: 0;
	margin-top: 2px;
}

.error-label {
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.85rem;
	margin-bottom: 6px;
}

.error-path {
	display: block;
	background: rgba(0, 0, 0, 0.3);
	padding: 10px 14px;
	border-radius: 6px;
	font-family: 'Fira Code', 'Consolas', monospace;
	font-size: 0.85rem;
	color: #ffbf09;
	word-break: break-all;
}

.section {
	margin-bottom: 24px;
}

.section-title {
	font-size: 1rem;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 14px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.section-icon {
	color: #31b4dd;
}

.action-card {
	background: rgba(255, 255, 255, 0.05) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 10px !important;
	margin-bottom: 10px;
}

.action-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.action-title-row {
	display: flex;
	align-items: center;
	gap: 14px;
}

.action-icon {
	font-size: 28px;
}

.create-icon {
	color: #71db96;
}

.folder-icon {
	color: #ffbf09;
}

.action-title {
	font-weight: 600;
	color: rgba(255, 255, 255, 0.95);
	margin-bottom: 2px;
}

.action-description {
	font-size: 0.85rem;
	color: rgba(255, 255, 255, 0.5);
}

.tips-card {
	background: rgba(255, 255, 255, 0.05) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 10px !important;
}

.tips-list {
	list-style: none;
	padding: 0;
	margin: 0;
}

.tips-list li {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 8px 0;
	color: rgba(255, 255, 255, 0.8);
	font-size: 0.9rem;
}

.tips-list li:first-child {
	padding-top: 0;
}

.tips-list li:last-child {
	padding-bottom: 0;
}

.bullet {
	color: rgba(255, 255, 255, 0.4);
	margin-top: 6px;
	flex-shrink: 0;
}

.tips-list code {
	background: rgba(0, 0, 0, 0.3);
	padding: 2px 6px;
	border-radius: 4px;
	font-size: 0.85em;
	color: #71db96;
}

.v-expansion-panel {
	background: rgba(0, 0, 0, 0.2) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 10px !important;
}

:deep(.v-expansion-panel-title) {
	padding: 14px 16px;
	min-height: auto;
}

:deep(.v-expansion-panel-text__wrapper) {
	padding: 0;
}

.panel-title-content {
	display: flex;
	align-items: center;
	gap: 10px;
	color: rgba(255, 255, 255, 0.8);
	font-size: 0.9rem;
}

.panel-icon {
	color: #796fdd;
}

.code-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	background: rgba(255, 255, 255, 0.03);
}

.code-label {
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.85rem;
	font-weight: 500;
}

.code-block {
	margin: 0;
	padding: 16px;
	overflow-x: auto;
	font-family: 'Fira Code', 'Consolas', monospace;
	font-size: 0.8rem;
	line-height: 1.6;
	color: #e0e0e0;
	max-height: 350px;
}

.links-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	gap: 10px;
}

.link-card {
	background: rgba(255, 255, 255, 0.05) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 10px !important;
	cursor: pointer;
	transition: all 0.2s ease !important;
	text-decoration: none !important;
}

.link-card:hover {
	background: rgba(255, 255, 255, 0.1) !important;
	border-color: rgba(255, 255, 255, 0.2) !important;
	transform: translateY(-2px);
}

.link-card-content {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px !important;
}

.link-icon {
	flex-shrink: 0;
}

.docs-icon {
	color: #31b4dd;
}

.bug-icon {
	color: #ff6b6b;
}

.link-title {
	font-weight: 600;
	color: rgba(255, 255, 255, 0.95);
	margin-bottom: 2px;
	font-size: 0.9rem;
}

.link-description {
	font-size: 0.8rem;
	color: rgba(255, 255, 255, 0.5);
}

.external-icon {
	color: rgba(255, 255, 255, 0.3);
	margin-left: auto;
}
</style>
