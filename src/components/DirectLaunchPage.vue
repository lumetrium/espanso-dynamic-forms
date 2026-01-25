<template>
	<v-app theme="dark">
		<v-main class="direct-launch-page">
			<v-container class="main-container">
				<!-- Header Section -->
				<div class="header-section">
					<div class="logo-wrapper">
						<img
							src="/logos/edf-bg-rounded.png"
							alt="EDF Logo"
							class="app-logo"
						/>
					</div>
					<h1 class="app-title">Espanso Dynamic Forms</h1>
					<p class="subtitle">
						This application is designed to be launched by
						<a
							href="#"
							class="highlight-link"
							@click.prevent="openExternalUrl('https://espanso.org')"
							>Espanso</a
						>, not directly.
					</p>
				</div>

				<!-- Info Card -->
				<v-card class="info-card">
					<v-card-text>
						<div class="info-content">
							<v-icon
								icon="mdi-information-outline"
								size="24"
								class="info-icon"
							/>
							<div>
								<p class="info-text">
									<strong>Espanso Dynamic Forms (EDF)</strong> extends Espanso's
									capabilities by providing interactive forms for collecting
									user input before text expansion.
								</p>
								<p class="info-text-secondary">
									Configure EDF in your Espanso match files and trigger it using
									your defined keywords.
								</p>
							</div>
						</div>
					</v-card-text>
				</v-card>

				<!-- Quick Start Section -->
				<div class="section">
					<h2 class="section-title">
						<v-icon
							icon="mdi-rocket-launch"
							class="section-icon"
						/>
						Quick Start
					</h2>

					<!-- Step 1: Espanso Config Path -->
					<div class="step">
						<div class="step-header">
							<span class="step-number">1</span>
							<span class="step-label">Open your Espanso match file</span>
						</div>
						<v-card class="path-card">
							<v-card-text>
								<div class="path-row-with-actions">
									<div class="path-content">
										<p class="path-label">Match file location:</p>
										<code class="path-value">{{ espansoMatchPath }}</code>
									</div>
									<div class="path-actions">
										<v-btn
											variant="text"
											size="small"
											:icon="
												copiedItem === 'match'
													? 'mdi-check'
													: 'mdi-content-copy'
											"
											:color="copiedItem === 'match' ? 'success' : 'default'"
											@click="copyToClipboard(espansoMatchPath, 'match')"
										/>
										<v-btn
											v-if="hasElectronAPI"
											variant="tonal"
											size="small"
											prepend-icon="mdi-open-in-new"
											@click="openMatchFile"
										>
											Open
										</v-btn>
									</div>
								</div>
							</v-card-text>
						</v-card>
					</div>

					<!-- Step 2: Demo Match (Two Options) -->
					<div class="step">
						<div class="step-header">
							<span class="step-number">2</span>
							<span class="step-label">Add a trigger to your match file</span>
						</div>

						<v-tabs
							v-model="selectedOption"
							class="option-tabs"
							color="primary"
						>
							<v-tab value="quick">
								<v-icon
									icon="mdi-lightning-bolt"
									class="tab-icon"
								/>
								Quick Demo
							</v-tab>
							<v-tab value="custom">
								<v-icon
									icon="mdi-pencil"
									class="tab-icon"
								/>
								Custom Form
							</v-tab>
						</v-tabs>

						<v-window v-model="selectedOption">
							<!-- Quick Demo Option -->
							<v-window-item value="quick">
								<v-card class="code-card">
									<v-card-text class="code-card-content">
										<div class="code-header">
											<div class="code-info">
												<span class="code-label">Espanso Match</span>
												<v-chip
													size="x-small"
													color="success"
													variant="tonal"
												>
													Recommended
												</v-chip>
											</div>
											<v-btn
												variant="text"
												size="small"
												:prepend-icon="
													copiedItem === 'quickMatch'
														? 'mdi-check'
														: 'mdi-content-copy'
												"
												:color="
													copiedItem === 'quickMatch' ? 'success' : 'default'
												"
												@click="copyToClipboard(quickDemoMatch, 'quickMatch')"
											>
												{{ copiedItem === 'quickMatch' ? 'Copied!' : 'Copy' }}
											</v-btn>
										</div>
										<pre
											class="code-block"
										><code>{{ quickDemoMatch }}</code></pre>
										<div class="code-note">
											<v-icon
												icon="mdi-check-circle"
												size="14"
												class="note-icon"
											/>
											Uses the built-in demo form — no additional files needed!
										</div>
									</v-card-text>
								</v-card>
							</v-window-item>

							<!-- Custom Form Option -->
							<v-window-item value="custom">
								<v-card class="code-card">
									<v-card-text class="code-card-content">
										<div class="code-header">
											<span class="code-label">Espanso Match (Custom)</span>
											<v-btn
												variant="text"
												size="small"
												:prepend-icon="
													copiedItem === 'customMatch'
														? 'mdi-check'
														: 'mdi-content-copy'
												"
												:color="
													copiedItem === 'customMatch' ? 'success' : 'default'
												"
												@click="copyToClipboard(customDemoMatch, 'customMatch')"
											>
												{{ copiedItem === 'customMatch' ? 'Copied!' : 'Copy' }}
											</v-btn>
										</div>
										<pre
											class="code-block"
										><code>{{ customDemoMatch }}</code></pre>
									</v-card-text>
								</v-card>

								<!-- Create Custom Form -->
								<v-card class="create-form-card">
									<v-card-text>
										<div class="create-form-content">
											<div class="create-form-info">
												<v-icon
													icon="mdi-file-plus-outline"
													size="24"
													class="create-icon"
												/>
												<div>
													<p class="create-title">
														Create the form config file
													</p>
													<p class="create-path">{{ customFormPath }}</p>
												</div>
											</div>
											<v-btn
												v-if="hasElectronAPI"
												color="primary"
												variant="elevated"
												:prepend-icon="
													createStatus === 'success' ? 'mdi-check' : 'mdi-plus'
												"
												:loading="createStatus === 'loading'"
												:disabled="createStatus === 'success'"
												@click="createCustomForm"
											>
												{{
													createStatus === 'success'
														? 'Created!'
														: 'Create & Open'
												}}
											</v-btn>
										</div>
									</v-card-text>
								</v-card>

								<!-- Collapsible form config -->
								<v-expansion-panels class="form-config-panel">
									<v-expansion-panel>
										<v-expansion-panel-title>
											<div class="panel-title-content">
												<v-icon
													icon="mdi-code-json"
													class="panel-icon"
												/>
												<span>View demo.yml contents</span>
											</div>
										</v-expansion-panel-title>
										<v-expansion-panel-text>
											<div class="code-header">
												<span class="code-label">demo.yml</span>
												<v-btn
													variant="text"
													size="small"
													:prepend-icon="
														copiedItem === 'formConfig'
															? 'mdi-check'
															: 'mdi-content-copy'
													"
													:color="
														copiedItem === 'formConfig' ? 'success' : 'default'
													"
													@click="copyToClipboard(demoFormConfig, 'formConfig')"
												>
													{{ copiedItem === 'formConfig' ? 'Copied!' : 'Copy' }}
												</v-btn>
											</div>
											<pre
												class="code-block form-config-code"
											><code>{{ demoFormConfig }}</code></pre>
										</v-expansion-panel-text>
									</v-expansion-panel>
								</v-expansion-panels>
							</v-window-item>
						</v-window>
					</div>

					<!-- Step 3: Test -->
					<div class="step">
						<div class="step-header">
							<span class="step-number">3</span>
							<span class="step-label">Test it!</span>
						</div>

						<!-- Show textarea only if not launched by Espanso -->
						<v-card
							v-if="!launchedByEspanso"
							class="test-card"
						>
							<v-card-text>
								<p class="test-intro">
									Type <code class="inline-code">:demo</code> in the field below
									to test:
								</p>
								<v-textarea
									v-model="testInput"
									placeholder="Type :demo here to trigger the form..."
									variant="outlined"
									rows="3"
									class="test-textarea"
									hide-details
								/>
								<p class="test-note">
									<v-icon
										icon="mdi-information-outline"
										size="14"
									/>
									After you've added the match to your Espanso config, this
									field will trigger the form.
								</p>
							</v-card-text>
						</v-card>

						<!-- Show message if launched by Espanso -->
						<v-card
							v-else
							class="espanso-tip-card"
						>
							<v-card-text>
								<div class="espanso-tip-content">
									<v-icon
										icon="mdi-information-outline"
										size="20"
										class="espanso-tip-icon"
									/>
									<div>
										<p class="espanso-tip-text">
											Type <code class="inline-code">:demo</code> in any text
											field outside this window.
										</p>
										<p class="espanso-tip-note">
											Testing here isn't available because Espanso launched this
											window.
										</p>
									</div>
								</div>
							</v-card-text>
						</v-card>
					</div>
				</div>

				<!-- Resources Section -->
				<div class="section">
					<h2 class="section-title">
						<v-icon
							icon="mdi-book-open-variant"
							class="section-icon"
						/>
						Resources
					</h2>

					<div class="links-grid">
						<v-card
							class="link-card"
							@click="
								openExternalUrl(
									'https://lumetrium.com/espanso-dynamic-forms/docs/',
								)
							"
						>
							<v-card-text class="link-card-content">
								<v-icon
									icon="mdi-file-document-outline"
									size="32"
									class="link-icon docs-icon"
								/>
								<div>
									<p class="link-title">Documentation</p>
									<p class="link-description">
										Learn how to configure and use EDF
									</p>
								</div>
								<v-icon
									icon="mdi-open-in-new"
									size="16"
									class="external-icon"
								/>
							</v-card-text>
						</v-card>

						<v-card
							class="link-card"
							@click="
								openExternalUrl(
									'https://github.com/lumetrium/espanso-dynamic-forms',
								)
							"
						>
							<v-card-text class="link-card-content">
								<v-icon
									icon="mdi-github"
									size="32"
									class="link-icon github-icon"
								/>
								<div>
									<p class="link-title">GitHub Repository</p>
									<p class="link-description">
										Source code, issues, and contributions
									</p>
								</div>
								<v-icon
									icon="mdi-open-in-new"
									size="16"
									class="external-icon"
								/>
							</v-card-text>
						</v-card>
					</div>
				</div>

				<!-- Support Section -->
				<div class="section">
					<h2 class="section-title">
						<v-icon
							icon="mdi-lifebuoy"
							class="section-icon"
						/>
						Need Help?
					</h2>

					<div class="links-grid links-grid-3">
						<v-card
							class="link-card"
							@click="
								openExternalUrl(
									'https://github.com/lumetrium/espanso-dynamic-forms/issues/new?template=bug_report.md',
								)
							"
						>
							<v-card-text class="link-card-content">
								<v-icon
									icon="mdi-bug-outline"
									size="28"
									class="link-icon bug-icon"
								/>
								<div>
									<p class="link-title">Report a Bug</p>
									<p class="link-description">Found an issue?</p>
								</div>
								<v-icon
									icon="mdi-open-in-new"
									size="14"
									class="external-icon"
								/>
							</v-card-text>
						</v-card>

						<v-card
							class="link-card"
							@click="
								openExternalUrl(
									'https://github.com/lumetrium/espanso-dynamic-forms/issues/new?template=feature_request.md',
								)
							"
						>
							<v-card-text class="link-card-content">
								<v-icon
									icon="mdi-lightbulb-outline"
									size="28"
									class="link-icon feature-icon"
								/>
								<div>
									<p class="link-title">Request Feature</p>
									<p class="link-description">Suggest ideas</p>
								</div>
								<v-icon
									icon="mdi-open-in-new"
									size="14"
									class="external-icon"
								/>
							</v-card-text>
						</v-card>

						<v-card
							class="link-card"
							@click="
								openExternalUrl(
									'https://github.com/lumetrium/espanso-dynamic-forms/discussions',
								)
							"
						>
							<v-card-text class="link-card-content">
								<v-icon
									icon="mdi-forum-outline"
									size="28"
									class="link-icon discuss-icon"
								/>
								<div>
									<p class="link-title">Discussions</p>
									<p class="link-description">Ask questions</p>
								</div>
								<v-icon
									icon="mdi-open-in-new"
									size="14"
									class="external-icon"
								/>
							</v-card-text>
						</v-card>
					</div>
				</div>

				<!-- Footer -->
				<div class="footer">
					<p>
						<a
							href="#"
							class="footer-link"
							@click.prevent="openExternalUrl('https://lumetrium.com')"
							>Lumetrium</a
						>
					</p>
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
const selectedOption = ref('quick')
const testInput = ref('')
const createStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

const hasElectronAPI = computed(() => !!window.electronAPI)
const launchedByEspanso = computed(
	() => env.value.EDF_LAUNCHED_BY_ESPANSO === 'true',
)

const isWindows = navigator.platform.toLowerCase().includes('win')
const isMac = navigator.platform.toLowerCase().includes('mac')

const espansoMatchPath = computed(() => {
	// Try to use actual Espanso config path if available
	if (env.value.ESPANSO_CONFIG) {
		return (
			env.value.ESPANSO_CONFIG +
			(isWindows ? '\\match\\base.yml' : '/match/base.yml')
		)
	}
	if (isWindows) {
		return '%APPDATA%\\espanso\\match\\base.yml'
	} else if (isMac) {
		return '~/Library/Application Support/espanso/match/base.yml'
	}
	return '~/.config/espanso/match/base.yml'
})

const customFormPath = computed(() => {
	if (env.value.ESPANSO_CONFIG) {
		return (
			env.value.ESPANSO_CONFIG +
			(isWindows ? '\\forms\\demo.yml' : '/forms/demo.yml')
		)
	}
	if (isWindows) {
		return '%APPDATA%\\espanso\\forms\\demo.yml'
	} else if (isMac) {
		return '~/Library/Application Support/espanso/forms/demo.yml'
	}
	return '~/.config/espanso/forms/demo.yml'
})

const edfExecutable = computed(() => {
	return (
		env.value.EDF_EXECUTABLE ||
		(isWindows
			? 'C:\\Program Files\\Espanso Dynamic Forms\\EDF.exe'
			: '/usr/bin/edf')
	)
})

// Quick demo uses packaged form
const quickDemoMatch = computed(
	() => `matches:
  - trigger: ":demo"
    replace: "{{output}}"
    vars:
      - name: output
        type: script
        params:
          args:
            - "${edfExecutable.value}"
            - --form-config
            - \\{\\{env.EDF_FORMS}}/reply.yml`,
)

// Custom demo uses user-created form
const customDemoMatch = computed(
	() => `matches:
  - trigger: ":demo"
    replace: "{{output}}"
    vars:
      - name: output
        type: script
        params:
          args:
            - "${edfExecutable.value}"
            - --form-config
            - "${customFormPath.value}"`,
)

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

async function openMatchFile() {
	if (!window.electronAPI) return

	try {
		// Resolve environment variables for the path
		let resolvedPath = espansoMatchPath.value
		if (env.value.ESPANSO_CONFIG) {
			resolvedPath =
				env.value.ESPANSO_CONFIG +
				(isWindows ? '\\match\\base.yml' : '/match/base.yml')
		}
		await window.electronAPI.shellOpenPath(resolvedPath)
	} catch (err) {
		console.error('Failed to open match file:', err)
	}
}

async function createCustomForm() {
	if (!window.electronAPI) return

	createStatus.value = 'loading'
	try {
		// Resolve the actual path
		let resolvedPath = customFormPath.value
		if (env.value.ESPANSO_CONFIG) {
			resolvedPath =
				env.value.ESPANSO_CONFIG +
				(isWindows ? '\\forms\\demo.yml' : '/forms/demo.yml')
		}
		await window.electronAPI.createDemoConfig(resolvedPath, demoFormConfig)
		createStatus.value = 'success'
	} catch (err) {
		console.error('Failed to create form:', err)
		createStatus.value = 'error'
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
.direct-launch-page {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
	min-height: 100vh;
}

.main-container {
	max-width: 720px !important;
	padding: 32px 24px !important;
}

.header-section {
	text-align: center;
	margin-bottom: 32px;
}

.logo-wrapper {
	margin-bottom: 16px;
}

.app-logo {
	width: 80px;
	height: 80px;
	border-radius: 16px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.app-title {
	font-size: 1.75rem;
	font-weight: 700;
	background: linear-gradient(135deg, #ffbf09 0%, #71db96 50%, #31b4dd 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin-bottom: 8px;
}

.subtitle {
	color: rgba(255, 255, 255, 0.7);
	font-size: 1rem;
	line-height: 1.5;
}

.highlight-link {
	color: #71db96;
	text-decoration: none;
	font-weight: 600;
	transition: color 0.2s ease;
}

.highlight-link:hover {
	color: #8ae5a8;
}

.info-card {
	background: rgba(255, 191, 9, 0.1) !important;
	border: 1px solid rgba(255, 191, 9, 0.3) !important;
	border-radius: 12px !important;
	margin-bottom: 32px;
}

.info-content {
	display: flex;
	gap: 16px;
	align-items: flex-start;
}

.info-icon {
	color: #ffbf09;
	flex-shrink: 0;
	margin-top: 2px;
}

.info-text {
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 8px;
	line-height: 1.5;
}

.info-text-secondary {
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.9rem;
	line-height: 1.5;
}

.section {
	margin-bottom: 28px;
}

.section-title {
	font-size: 1.1rem;
	font-weight: 600;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.section-icon {
	color: #31b4dd;
}

.step {
	margin-bottom: 20px;
}

.step-header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 10px;
}

.step-number {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: linear-gradient(135deg, #31b4dd, #796fdd);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	font-size: 0.9rem;
}

.step-label {
	color: rgba(255, 255, 255, 0.9);
	font-weight: 500;
}

.path-card {
	background: rgba(255, 255, 255, 0.05) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 10px !important;
}

.path-row-with-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.path-content {
	flex: 1;
	min-width: 0;
}

.path-label {
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.85rem;
	margin-bottom: 6px;
}

.path-value {
	display: block;
	background: rgba(0, 0, 0, 0.3);
	padding: 10px 14px;
	border-radius: 6px;
	font-family: 'Fira Code', 'Consolas', monospace;
	font-size: 0.85rem;
	color: #71db96;
	overflow-x: auto;
	white-space: nowrap;
}

.path-actions {
	display: flex;
	gap: 4px;
	flex-shrink: 0;
	align-self: flex-end;
	align-items: center;
}

.option-tabs {
	margin-bottom: 12px;
}

.option-tabs :deep(.v-tab) {
	text-transform: none;
	font-weight: 500;
}

.tab-icon {
	margin-right: 6px;
}

.code-card {
	background: rgba(0, 0, 0, 0.3) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 10px !important;
}

.code-card-content {
	padding: 0 !important;
}

.code-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	background: rgba(255, 255, 255, 0.03);
}

.code-info {
	display: flex;
	align-items: center;
	gap: 10px;
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
}

.code-note {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 16px;
	background: rgba(113, 219, 150, 0.1);
	border-top: 1px solid rgba(113, 219, 150, 0.2);
	color: #71db96;
	font-size: 0.85rem;
}

.note-icon {
	flex-shrink: 0;
}

.create-form-card {
	background: rgba(255, 255, 255, 0.05) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 10px !important;
	margin-top: 12px;
}

.create-form-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.create-form-info {
	display: flex;
	align-items: center;
	gap: 12px;
}

.create-icon {
	color: #71db96;
}

.create-title {
	font-weight: 600;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 2px;
}

.create-path {
	font-size: 0.8rem;
	color: rgba(255, 255, 255, 0.5);
	font-family: 'Fira Code', 'Consolas', monospace;
}

.form-config-panel {
	margin-top: 12px;
}

.form-config-panel :deep(.v-expansion-panel) {
	background: rgba(0, 0, 0, 0.2) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 10px !important;
}

.form-config-panel :deep(.v-expansion-panel-title) {
	padding: 14px 16px;
	min-height: auto;
}

.form-config-panel :deep(.v-expansion-panel-text__wrapper) {
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

.form-config-code {
	max-height: 400px;
}

.test-card {
	background: rgba(255, 255, 255, 0.05) !important;
	border: 1px solid rgba(255, 255, 255, 0.1) !important;
	border-radius: 10px !important;
}

.test-intro {
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 12px;
}

.test-textarea {
	margin-bottom: 10px;
}

.test-textarea :deep(.v-field) {
	background: rgba(0, 0, 0, 0.2);
}

.test-note {
	display: flex;
	align-items: center;
	gap: 8px;
	color: rgba(255, 255, 255, 0.5);
	font-size: 0.8rem;
}

.espanso-tip-card {
	background: rgba(49, 180, 221, 0.1) !important;
	border: 1px solid rgba(49, 180, 221, 0.3) !important;
	border-radius: 10px !important;
}

.espanso-tip-content {
	display: flex;
	gap: 14px;
	align-items: flex-start;
}

.espanso-tip-icon {
	color: #31b4dd;
	flex-shrink: 0;
	margin-top: 2px;
}

.espanso-tip-text {
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 4px;
}

.espanso-tip-note {
	color: rgba(255, 255, 255, 0.5);
	font-size: 0.85rem;
}

.inline-code {
	background: rgba(0, 0, 0, 0.3);
	padding: 2px 8px;
	border-radius: 4px;
	font-family: 'Fira Code', 'Consolas', monospace;
	color: #ffbf09;
	font-weight: 600;
}

.links-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 12px;
}

.links-grid-3 {
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
	gap: 14px;
	padding: 16px !important;
}

.link-icon {
	flex-shrink: 0;
}

.docs-icon {
	color: #31b4dd;
}

.github-icon {
	color: #ffffff;
}

.bug-icon {
	color: #ff6b6b;
}

.feature-icon {
	color: #ffbf09;
}

.discuss-icon {
	color: #796fdd;
}

.link-title {
	font-weight: 600;
	color: rgba(255, 255, 255, 0.95);
	margin-bottom: 2px;
}

.link-description {
	font-size: 0.85rem;
	color: rgba(255, 255, 255, 0.5);
}

.external-icon {
	color: rgba(255, 255, 255, 0.3);
	margin-left: auto;
}

.footer {
	text-align: center;
	padding-top: 24px;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	margin-top: 16px;
}

.footer p {
	color: rgba(255, 255, 255, 0.5);
	font-size: 0.9rem;
}

.footer-link {
	color: #796fdd;
	text-decoration: none;
	font-weight: 500;
	transition: color 0.2s ease;
}

.footer-link:hover {
	color: #9389e5;
}
</style>
