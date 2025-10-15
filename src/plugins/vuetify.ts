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
	theme: {
		defaultTheme: 'dark',
		themes: {
			dark: {
				colors: {
					primary: '#4cdd9f',
				}
			},
		},
	},
	defaults: {
		global: {
		},
		VCheckbox: {
			hideDetails: true,
		},
		VRadioGroup: {
			hideDetails: true,
		},
		VTabs: {
			grow: true,
		},
		VTabsWindowItem: {
			eager: true,
		},
		VWindowItem: {
			eager: true,
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
