import { createWebHashHistory, createRouter } from 'vue-router'

import lan from '../pages/bussiness/lan.vue'

function registerRouter(app) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [{ path: '/', component: lan }],
  })
  app.use(router)
}

export default registerRouter
