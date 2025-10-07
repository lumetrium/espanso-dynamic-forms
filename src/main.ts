import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './i18n.ts'
import { vuetify } from './plugins/vuetify.ts'
import { useEnvStore } from './stores/useEnvStore.ts'
import { useFormSchemaStore } from './stores/useFormSchemaStore.ts'

const pinia = createPinia()
const app = createApp(App)

app
	.use(pinia)
	.use(vuetify)
	.use(i18n)
	.mount('#app')
	.$nextTick(() => {
		window.electronAPI.on(
			'main-process-message',
			(_event, data: { form: string; env: string }) => {
				// console.log(schema)
				useEnvStore().setEnv(data.env)
				useFormSchemaStore().setFullSchema(data.form)
			},
		)
	})
