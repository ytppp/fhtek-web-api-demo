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
      {
        url: '/more/status',
        text: 'trans0537',
        config,
      },
      {
        url: '/more/network',
        text: 'trans0455',
        children: [
          {
            url: '/more/network/lan',
            text: 'trans0456',
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
