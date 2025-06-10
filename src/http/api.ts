import { http } from './index'
import type { ApiResponse } from './type'

const api = 'api'
const createData = (data: any) => ({ data })

export const login = (params): Promise<ApiResponse<any>> => {
  return http.post('login', createData(params))
}

export const logout = (): Promise<ApiResponse<any>> => {
  return http.post('logout')
}

export const getLan = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'dhcp:get',
  })
}

export const setLan = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'dhcp:edit',
      data: params,
    },
    { loading: false },
  )
}

export const upload = (params, onprogressCallback): Promise<ApiResponse<any>> => {
  return http.upload('uploadTest', params, onprogressCallback, { loading: false })
}

export const getUpgradeStatus = (): Promise<ApiResponse<any>> => {
  return http.get('ChkUpgradeStatus', {}, { loading: false, toast: false })
}

export const getWan = (): Promise<ApiResponse<any>> => {
  return http.get(`GetWan`)
}

export const getPortBindInfo = (): Promise<ApiResponse<any>> => {
  return http.get(`GetPortBindInfo`)
}

export const addWan = (params): Promise<ApiResponse<any>> => {
  return http.post(`AddWan`, createData(params))
}

export const editWan = (params): Promise<ApiResponse<any>> => {
  return http.post('SetWan', createData(params))
}

export const deleteWan = (params): Promise<ApiResponse<any>> => {
  return http.post('DeleteWan', createData(params))
}

export const getWifi2g = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b24g.basic:get')
}

export const setWifi2g = (params): Promise<ApiResponse<any>> => {
  // return http.post(api, {
  //   method: 'wifi.b24g.basic:edit',
  //   data: params,
  // })
  return http.post('wifi.b24g.basic:edit', createData(params))
}

export const getWifi2gAdv = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b24g.advanced:get')
}

export const setWifi2gAdv = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b24g.advanced:edit', createData(params))
}

export const getWifi5gAdv = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b5g.advanced:get')
}

export const setWifi5gAdv = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b5g.advanced:edit', createData(params))
}

export const getWps = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.wps:get', createData(params), { loading: false })
}

export const setWps = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.wps:edit', createData(params))
}

export const getWifi5g = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b5g.basic:get')
}

export const setWifi5g = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b5g.basic:edit', createData(params))
}

export const getIpv6Lan = (): Promise<ApiResponse<any>> => {
  return http.get('GetLan6')
}

export const setIpv6Lan = (params): Promise<ApiResponse<any>> => {
  return http.post('SetLan6', createData(params), { loading: false })
}

export const getPortMapping = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.port_mapping:get',
  })
}

export const setPortMapping = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.port_mapping:add',
    data: params,
  })
}

export const editPortMapping = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.port_mapping:edit',
    data: params,
  })
}

export const delPortMapping = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.port_mapping:delete',
    data: params,
  })
}

export const getDmz = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.dmz:get',
  })
}

export const setDmz = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.dmz:edit',
    data: params,
  })
}

export const getWanList = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'wan.info:get',
    data: params,
  })
}

export const setFirewall = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall:edit',
    data: params,
  })
}

export const getFirewall = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall:get',
  })
}

export const getStaticDnsList = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_dns:get',
  })
}

export const addStaticDns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_dns:add',
    data: params,
  })
}

export const editStaticDns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_dns:edit',
    data: params,
  })
}

export const delStaticDns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_dns:delete',
    data: params,
  })
}

export const getStaticRoute = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_route:get',
  })
}

export const addStaticRoute = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_route:add',
    data: params,
  })
}

export const editStaticRoute = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_route:edit',
    data: params,
  })
}

export const delStaticRoute = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_route:delete',
    data: params,
  })
}

export const getOntAuth = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.ont_auth:get',
  })
}

export const editOntAuth = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.ont_auth:edit',
    data: params,
  })
}

export const getPortMirr = (): Promise<ApiResponse<any>> => {
  return http.get('GetPortMirr')
}

export const setPortMirr = (params): Promise<ApiResponse<any>> => {
  return http.post('SetPortMirr', createData(params))
}

export const getTerminal = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.acl_control:get',
  })
}

export const setTerminal = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.acl_control:edit',
    data: params,
  })
}

export const getDefaultRoute = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.default_route:get',
  })
}

export const setDefaultRoute = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.default_route:edit',
    data: params,
  })
}

export const getAccount = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'account:get',
    data: params,
  })
}

export const setAccount = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'account:edit',
    data: params,
  })
}

export const getDdns = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.ddns:get',
  })
}

export const addDdns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.ddns:add',
    data: params,
  })
}

export const editDdns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.ddns:edit',
    data: params,
  })
}

export const delDdns = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.ddns:delete',
    data: params,
  })
}

export const getWifiMacFilterStatus = (): Promise<ApiResponse<any>> => {
  return http.get('security.wifi_mac_filter.status:get')
}

export const setWifiMacFilterStatus = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.status:edit', createData(params))
}

export const getWifiMacFilter = (): Promise<ApiResponse<any>> => {
  return http.get('security.wifi_mac_filter.items:get')
}

export const addWifiMacFilter = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.items:add', createData(params))
}

export const editWifiMacFilter = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.items:edit', createData(params))
}

export const delWifiMacFilter = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.items:delete', createData(params))
}
