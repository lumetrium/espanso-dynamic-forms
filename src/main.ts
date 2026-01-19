import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import index from './i18n'
import { vuetify } from './plugins/vuetify.ts'
import { useEnvStore } from './stores/useEnvStore.ts'
import { useFormSchemaStore } from './stores/useFormSchemaStore.ts'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const pinia = createPinia().use(piniaPluginPersistedState)
const app = createApp(App).use(pinia).use(vuetify).use(index)

if (window.electronAPI) {
	window.electronAPI.on(
		'main-process-message',
		(_event, data: { form: string; env: string }) => {
			useEnvStore().setEnv(data.env)
			useFormSchemaStore().setFullSchema(data.form)
		},
	)
}

function mountApp() {
	app.mount('#app')
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mountApp)
} else {
	mountApp()
}
