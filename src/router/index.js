import { createWebHashHistory, createRouter } from 'vue-router'

import login from '../pages/login/index.vue'
import home from '../pages/home/index.vue'
import deviceStatus from '../pages/status/device.vue'
import wan from '../pages/status/wan.vue'
import wlan from '../pages/status/wlan.vue'
import lanStatus from '../pages/status/lan.vue'
import optical from '../pages/status/optical.vue'
import voip from '../pages/status/voip.vue'
import cwmpStatus from '../pages/status/cwmp.vue'
import sta from '../pages/status/sta.vue'
import usb from '../pages/status/usb.vue'
import wanNetwork from '../pages/network/wan.vue'
import wanBinding from '../pages/network/wan-binding.vue'
import lan from '../pages/network/lan.vue'
import basicB24g from '../pages/network/wlan-b24g-basic.vue'
import advancedB24g from '../pages/network/wlan-b24g-advanced.vue'
import basicB5g from '../pages/network/wlan-b5g-basic.vue'
import advancedB5g from '../pages/network/wlan-b5g-advanced.vue'
import portSetting from '../pages/network/port-setting.vue'
import staticRoute from '../pages/network/static-route.vue'
import defaultRoute from '../pages/network/default-route.vue'
import wifiMacFilter from '../pages/security/wifi-mac-filter.vue'
import portMapping from '../pages/app/port-mapping.vue'
import dmz from '../pages/app/dmz.vue'
import staticDns from '../pages/app/static-dns.vue'
import staticArp from '../pages/app/static-arp.vue'
import ddns from '../pages/app/ddns.vue'
import upnp from '../pages/app/upnp.vue'
import cwmp from '../pages/app/cwmp.vue'
import time from '../pages/app/time.vue'
import igmpMld from '../pages/app/igmp-mld.vue'
import dhcpStaticIp from '../pages/app/dhcp-static-ip.vue'
import storage from '../pages/app/storage.vue'
import mediaSharing from '../pages/app/media-sharing.vue'
import samba from '../pages/app/samba.vue'
import upgrade from '../pages/management/upgrade.vue'
import user from '../pages/management/user.vue'
import device from '../pages/management/device.vue'
import log from '../pages/management/log.vue'
import terminal from '../pages/management/terminal.vue'
import ontAuth from '../pages/management/ont-auth.vue'
import internetDiagnose from '../pages/management/diagnose-internet.vue'
import remoteDiagnose from '../pages/management/diagnose-remote.vue'

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
      name: 'deviceStatus',
      component: deviceStatus,
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
      name: 'cwmpStatus',
      component: cwmpStatus,
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
      path: '/network/wlan/basic-24g',
      name: 'basicB24g',
      component: basicB24g,
    },
    {
      path: '/network/wlan/advanced-24g',
      name: 'advancedB24g',
      component: advancedB24g,
    },
    {
      path: '/network/wlan/basic-5g',
      name: 'basicB5g',
      component: basicB5g,
    },
    {
      path: '/network/wlan/advanced-5g',
      name: 'advancedB5g',
      component: advancedB5g,
    },
    {
      path: '/network/port-setting',
      name: 'portSetting',
      component: portSetting,
    },
    {
      path: '/network/static-route',
      name: 'staticRoute',
      component: staticRoute,
    },
    {
      path: '/network/default-route',
      name: 'defaultRoute',
      component: defaultRoute,
    },
    {
      path: '/security/wifi-mac-filter',
      name: 'wifiMacFilter',
      component: wifiMacFilter,
    },
    {
      path: '/app/static-dns',
      name: 'static-dns',
      component: staticDns,
    },
    {
      path: '/app/ddns',
      name: 'ddns',
      component: ddns,
    },
    {
      path: '/app/port-mapping',
      name: 'port-mapping',
      component: portMapping,
    },
    {
      path: '/app/dmz',
      name: 'dmz',
      component: dmz,
    },
    {
      path: '/app/upnp',
      name: 'upnp',
      component: upnp,
    },
    {
      path: '/app/cwmp',
      name: 'cwmp',
      component: cwmp,
    },
    {
      path: '/app/time',
      name: 'time',
      component: time,
    },
    {
      path: '/app/igmp-mld',
      name: 'igmp-mld',
      component: igmpMld,
    },
    {
      path: '/app/static-arp',
      name: 'static-arp',
      component: staticArp,
    },
    {
      path: '/app/dhcp-static-ip',
      name: 'dhcp-static-ip',
      component: dhcpStaticIp,
    },
    {
      path: '/app/storage',
      name: 'storage',
      component: storage,
    },
    {
      path: '/app/media-sharing',
      name: 'media-sharing',
      component: mediaSharing,
    },
    {
      path: '/app/samba',
      name: 'samba',
      component: samba,
    },
    {
      path: '/management/upgrade',
      name: 'upgrade',
      component: upgrade,
    },
    {
      path: '/management/user',
      name: 'user',
      component: user,
    },
    {
      path: '/management/device',
      name: 'device',
      component: device,
    },
    {
      path: '/management/log',
      name: 'log',
      component: log,
    },
    {
      path: '/management/terminal',
      name: 'terminal',
      component: terminal,
    },
    {
      path: '/management/ont-auth',
      name: 'ont-auth',
      component: ontAuth,
    },
    {
      path: '/management/diagnose/internet',
      name: 'internet-diagnose',
      component: internetDiagnose,
    },
    {
      path: '/management/diagnose/remote',
      name: 'oremote-diagnose',
      component: remoteDiagnose,
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
