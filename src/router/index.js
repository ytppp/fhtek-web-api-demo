import { createWebHashHistory, createRouter } from 'vue-router'

import login from '../pages/login/index.vue'
import home from '../pages/home/index.vue'
import internet from '../pages/internet/index.vue'
import wifi from '../pages/wifi/index.vue'
import status from '../pages/more/status/index.vue'
import lan from '../pages/more/network/lan.vue'
import portMapping from '../pages/more/app/port-mapping.vue'
import dmz from '../pages/more/app/dmz.vue'
import firewall from '../pages/more/safety/firewall.vue'
import upgrade from '../pages/more/management/upgrade.vue'

export const router = createRouter({
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
      path: '/internet',
      name: 'internet',
      component: internet,
    },
    {
      path: '/wifi',
      name: 'wifi',
      component: wifi,
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
      path: '/more/app/port-mapping',
      name: 'port-mapping',
      component: portMapping,
    },
    {
      path: '/more/app/dmz',
      name: 'dmz',
      component: dmz,
    },
    {
      path: '/more/safety/firewall',
      name: 'firewall',
      component: firewall,
    },
    {
      path: '/more/management/upgrade',
      name: 'upgrade',
      component: upgrade,
    },
  ],
})

// router.beforeEach(async (to, from, next) => {
//   // todo
// })

function registerRouter(app) {
  app.use(router)
}

export default registerRouter
