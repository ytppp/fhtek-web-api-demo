import { createApp } from 'vue'
import registerComponents from './register-components'
import registerI18n from './i18n/index'
import registerRouter from './router'
import { setFavicon } from './util/tool'
import App from './App.vue'
import '@/assets/style/main.less'

const app = createApp(App)

registerComponents(app)
registerI18n(app)
registerRouter(app)

setFavicon(`@/customer-conf/fhtek/assets/images/favicon.ico`)

app.mount('#app')
