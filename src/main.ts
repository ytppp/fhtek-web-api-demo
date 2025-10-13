import { createApp } from 'vue'
import registerComponents from './register-components'
import registerI18n from './i18n/index'
import registerRouter from './router'
import registerPinia from './stores'
import { setFavicon, getPublicFile, setDocTitle } from './util/tool'
import App from './App.vue'
import '@/assets/style/main.less'
import(`@/assets/style/customer-conf/${VITE_CUSTOMER_CONFIG.name}/custom.less`)

const app = createApp(App)

registerRouter(app)
registerPinia(app)
registerI18n(app)
registerComponents(app)
if (VITE_CUSTOMER_CONFIG.favicon) setFavicon(getPublicFile(`${VITE_CUSTOMER_CONFIG.favicon}`))
if (VITE_CUSTOMER_CONFIG.title) setDocTitle(VITE_CUSTOMER_CONFIG.title)

String.prototype.format = function (...args) {
  let _this = this
  args.forEach((val) => {
    _this = _this.replace(/%[abcdefghnostx]/, val)
  })
  return _this
}

app.mount('#app')
