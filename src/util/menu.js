import { RouterMode, Role, customers, MeshRole } from './constant'
const name = VITE_CUSTOMER_CONFIG.name
const role = Role.super // sessionStorage.getItem('role')
const mode = RouterMode.router // sessionStorage.getItem('mode')
const meshRole = MeshRole.controller // sessionStorage.getItem('meshRole')
// menu default config
const config = {
  show: true,
  auth: [Role.admin, Role.super],
  mode: [RouterMode.router, RouterMode.bridge],
  meshRole: [MeshRole.controller, MeshRole.agent],
}
const strategyA = {
  show: true,
  auth: [Role.admin, Role.super],
  mode: [RouterMode.router],
  meshRole: [MeshRole.controller],
}
const strategyB = {
  show: true,
  auth: [Role.admin, Role.super],
  mode: [RouterMode.router, RouterMode.bridge],
  meshRole: [MeshRole.controller],
}
let menus = [
  {
    url: '/status',
    text: 'trans0537',
    icon: 'icon-ellipsis',
    children: [
      {
        url: '/status/device',
        text: 'trans0070',
        config,
      },
      {
        url: '/status/wan',
        text: 'trans0155',
        config,
      },
      {
        url: '/status/wlan',
        text: 'trans0628',
        config,
      },
      {
        url: '/status/lan',
        text: 'trans0715',
        config,
      },
      {
        url: '/status/optical',
        text: 'trans0718',
        config,
      },
      {
        url: '/status/voip',
        text: 'trans0718',
        config,
      },
      {
        url: '/status/cwmp',
        text: 'trans0249',
        config,
      },
      {
        url: '/status/sta',
        text: 'trans0747',
        config,
      },
      {
        url: '/status/usb',
        text: 'trans0748',
        config,
      },
    ],
  },
  {
    url: '/network',
    text: 'trans0014',
    icon: 'icon-earth',
    children: [
      {
        url: '/network/wan',
        text: 'trans0155',
        config,
      },
      {
        url: '/network/wan-binding',
        text: 'trans0751',
        config,
      },
      {
        url: '/network/lan',
        text: 'trans0156',
        config,
      },
      {
        url: '/network/port-setting',
        text: 'trans0757',
        config,
      },
      {
        url: '/network/wlan',
        text: 'trans0017',
        config,
      },
    ],
  },
  {
    url: '/home',
    text: 'trans0006',
    icon: 'icon-home',
    config,
  },
  {
    url: '/more',
    text: 'trans0016',
    icon: 'icon-ellipsis',
    children: [
      // {
      //   url: '/more/status',
      //   text: 'trans0537',
      //   config,
      // },
      {
        url: '/more/app',
        text: 'trans0244',
        children: [
          {
            url: '/more/app/port-mapping',
            text: 'trans0422',
            config,
          },
          {
            url: '/more/app/dmz',
            text: 'trans0254',
            config,
          },
        ],
      },
      {
        url: '/more/safety',
        text: 'trans0031',
        children: [
          {
            url: '/more/safety/firewall',
            text: 'trans0060',
            config,
          },
          {
            url: '/more/safety/url-filter',
            text: 'trans0058',
            config,
          },
        ],
      },
      {
        url: '/more/management',
        text: 'trans0183',
        children: [
          {
            url: '/more/management/upgrade',
            text: 'trans0187',
            config,
          },
        ],
      },
    ],
  },
]
export function getMenu() {
  console.log('Init menus...')
  console.log(`customer is: ${name}`)
  if (!role || !mode || !meshRole) {
    return menus
  }
  console.log(`role is: ${role}`)
  console.log(`mode is: ${mode}`)
  console.log(`meshRole is: ${meshRole}`)
  const generateMenu = (menus, name) => {
    menus.forEach((menu) => {
      if (menu.children) {
        return generateMenu(menu.children, name)
      } else {
        menu.config = menu.config || config
        const customers = menu.customers || {}
        const customerConfig = customers[name] || {}
        menu.config = Object.assign({}, menu.config, customerConfig)
      }
    })
    return menus
  }
  const filterMenu = (menus, role, mode, meshRole) => {
    const parents = []
    menus.forEach((menu) => {
      if (menu.children) {
        const filteredChildren = filterMenu(menu.children, role, mode, meshRole)
        if (filteredChildren.length) {
          parents.push({
            ...menu,
            children: filteredChildren,
          })
        }
      } else {
        if (
          menu.config.show &&
          menu.config.auth.includes(role) &&
          menu.config.mode.includes(mode) &&
          menu.config.meshRole.includes(meshRole)
        ) {
          parents.push(menu)
        }
      }
    })
    return parents
  }
  menus = generateMenu(menus, name)
  menus = filterMenu(menus, role, mode, meshRole)
  return menus
}
