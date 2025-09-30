import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
	defaults: {
		global: {
		},
		VTabs: {
			grow: true,
		},
		VTextField: {
			density: 'compact',
			hideDetails: 'auto',
		},
		VTextarea: {
			density: 'compact',
			rows: 1,
			autoGrow: true,
			hideDetails: 'auto',
		},
		VCombobox: {
			density: 'compact',
			autoGrow: true
		}
	}
})
