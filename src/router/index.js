import { createWebHashHistory, createRouter } from 'vue-router'

import login from '../pages/login/index.vue'
import home from '../pages/home/index.vue'
import device from '../pages/status/device.vue'
import wan from '../pages/status/wan.vue'
import wlan from '../pages/status/wlan.vue'
import lanStatus from '../pages/status/lan.vue'
import optical from '../pages/status/optical.vue'
import voip from '../pages/status/voip.vue'
import cwmp from '../pages/status/cwmp.vue'
import sta from '../pages/status/sta.vue'
import usb from '../pages/status/usb.vue'
import wanNetwork from '../pages/network/wan.vue'
import wanBinding from '../pages/network/wan-binding.vue'
import lan from '../pages/network/lan.vue'
import wlanNetwork from '../pages/network/wlan.vue'
import portSetting from '../pages/network/port-setting.vue'
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
      path: '/status/device',
      name: 'device',
      component: device,
    },
    {
      path: '/status/wan',
      name: 'wan',
      component: wan,
    },
    {
      path: '/status/wlan',
      name: 'wlan',
      component: wlan,
    },
    {
      path: '/status/lan',
      name: 'lanStatus',
      component: lanStatus,
    },
    {
      path: '/status/optical',
      name: 'optical',
      component: optical,
    },
    {
      path: '/status/voip',
      name: 'voip',
      component: voip,
    },
    {
      path: '/status/cwmp',
      name: 'cwmp',
      component: cwmp,
    },
    {
      path: '/status/sta',
      name: 'sta',
      component: sta,
    },
    {
      path: '/status/usb',
      name: 'usb',
      component: usb,
    },
    {
      path: '/network/wan',
      name: 'wanNetwork',
      component: wanNetwork,
    },
    {
      path: '/network/wan-binding',
      name: 'wanBinding',
      component: wanBinding,
    },
    {
      path: '/network/lan',
      name: 'lan',
      component: lan,
    },
    {
      path: '/network/wlan',
      name: 'wlanNetwork',
      component: wlanNetwork,
    },
    {
      path: '/network/port-setting',
      name: 'portSetting',
      component: portSetting,
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
