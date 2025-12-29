import { createPinia } from 'pinia'
import type { App } from 'vue'

function registerPinia(app: App) {
  const pinia = createPinia()
  app.use(pinia)
}

export default registerPinia
