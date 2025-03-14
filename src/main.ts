import { createApp } from 'vue'
import registerComponents from './register-components'
import registerI18n from './i18n/index'
import registerRouter from './router'
import { setFavicon, getPublicFile, setDocTitle } from './util/tool'
import App from './App.vue'
import '@/assets/style/main.less'

const app = createApp(App)

registerComponents(app)
registerI18n(app)
registerRouter(app)
setFavicon(getPublicFile(`${VITE_CUSTOMER_CONFIG.favicon}`))
setDocTitle(VITE_CUSTOMER_CONFIG.title)

String.prototype.format = function (...args) {
  let _this = this
  args.forEach((val) => {
    _this = _this.replace(/%[abcdefghnostx]/, val)
  })
  return _this
}

app.mount('#app')
