import { createWebHashHistory, createRouter } from 'vue-router'

import login from '../pages/login/index.vue'
import home from '../pages/home/index.vue'
import status from '../pages/more/status/index.vue'
import lan from '../pages/more/network/lan.vue'
import upgrade from '../pages/more/management/upgrade.vue'

function registerRouter(app) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        redirect: '/login',
      },
      {
        path: '/login',
        name: 'login',
        component: login,
      },
      {
        path: '/home',
        name: 'home',
        component: home,
      },
      {
        path: '/more/status',
        name: 'status',
        component: status,
      },
      {
        path: '/more/network/lan',
        name: 'lan',
        component: lan,
      },
      {
        path: '/more/management/upgrade',
        name: 'upgrade',
        component: upgrade,
      },
    ],
  })
  app.use(router)
}

export default registerRouter
