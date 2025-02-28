import { createApp } from 'vue'
import registerComponents from './register-components'
import registerI18n from './i18n/index'
import registerRouter from './router'
import App from './App.vue'
import './assets/style/main.css'

const app = createApp(App)

registerComponents(app)
registerI18n(app)
registerRouter(app)

app.mount('#app')
