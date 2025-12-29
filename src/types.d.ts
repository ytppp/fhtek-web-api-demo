declare const VITE_CUSTOMER_CONFIG = any

declare module '@kangc/v-md-editor/lib/preview'
declare module '@kangc/v-md-editor/lib/theme/github.js'

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// declare module '@/router/index' {
//   import { type App } from 'vue'
//   import { type Router } from 'vue-router'
//   export const router: Router
//   const registerRouter: (app: App) => void
//   export default registerRouter
// }

declare module './i18n/index' {
  import { type App } from 'vue'
  const registerI18n: (app: App) => void
  export default registerI18n
}
