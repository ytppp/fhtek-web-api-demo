import { createApp } from 'vue'
import registerComponents from './register-components'
import registerI18n from './i18n/index'
import registerRouter from './router'
import { setFavicon, getPublicFile, setDocTitle } from './util/tool'
import App from './App.vue'
import { logout } from '@/http/api'
import '@/assets/style/main.less'

const app = createApp(App)

registerI18n(app)
registerRouter(app)
registerComponents(app)
setFavicon(getPublicFile(`${VITE_CUSTOMER_CONFIG.favicon}`))
setDocTitle(VITE_CUSTOMER_CONFIG.title)

String.prototype.format = function (...args) {
  let _this = this
  args.forEach((val) => {
    _this = _this.replace(/%[abcdefghnostx]/, val)
  })
  return _this
}

window.addEventListener('beforeunload', function () {
  if (navigator.sendBeacon) {
    const data = JSON.stringify({ event: 'window_closed' })
    navigator.sendBeacon('/action/logout', data)
  } else {
    logout()
  }
})

app.mount('#app')
