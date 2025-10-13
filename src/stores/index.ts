import { createPinia } from 'pinia'

function registerPinia(app) {
  const pinia = createPinia()
  app.use(pinia)
}

export default registerPinia
