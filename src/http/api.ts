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

export const uploadConfig = (params, onprogressCallback): Promise<ApiResponse<any>> => {
  return http.upload('uploadConfig', params, onprogressCallback, { loading: false })
}

export const getUpgradeStatus = (): Promise<ApiResponse<any>> => {
  return http.get('ChkUpgradeStatus', undefined, { loading: false, toast: false })
}

export const getWan = (): Promise<ApiResponse<any>> => {
  return http.get(`GetWan`)
}

export const getPortBindInfo = (params): Promise<ApiResponse<any>> => {
  return http.post(`GetPortBindInfo`, createData(params))
}

export const addWan = (params): Promise<ApiResponse<any>> => {
  return http.post(`AddWan`, createData(params), { loading: false })
}

export const editWan = (params): Promise<ApiResponse<any>> => {
  return http.post('SetWan', createData(params), { loading: false })
}

export const deleteWan = (params): Promise<ApiResponse<any>> => {
  return http.post('DeleteWan', createData(params), { loading: false })
}

export const getWifi2g = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b24g.basic:get')
}

export const setWifi2g = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b24g.basic:edit', createData(params), { loading: false })
}

export const getWifi2gAdv = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b24g.advanced:get')
}

export const setWifi2gAdv = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b24g.advanced:edit', createData(params), { loading: false })
}

export const getWifi5gAdv = (): Promise<ApiResponse<any>> => {
  return http.get('wifi.b5g.advanced:get')
}

export const setWifi5gAdv = (params): Promise<ApiResponse<any>> => {
  return http.post('wifi.b5g.advanced:edit', createData(params), { loading: false })
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
  return http.post('wifi.b5g.basic:edit', createData(params), { loading: false })
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
  return http.post(
    api,
    {
      method: 'firewall.port_mapping:add',
      data: params,
    },
    { loading: false },
  )
}

export const editPortMapping = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'firewall.port_mapping:edit',
      data: params,
    },
    { loading: false },
  )
}

export const delPortMapping = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'firewall.port_mapping:delete',
      data: params,
    },
    { loading: false },
  )
}

export const getDmz = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'firewall.dmz:get',
  })
}

export const setDmz = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'firewall.dmz:edit',
      data: params,
    },
    { loading: false },
  )
}

export const getWanList = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'wan.info:get',
    data: params,
  })
}

export const setFirewall = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'firewall:edit',
      data: params,
    },
    { loading: false },
  )
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
  return http.post(
    api,
    {
      method: 'network.static_dns:add',
      data: params,
    },
    { loading: false },
  )
}

export const editStaticDns = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'network.static_dns:edit',
      data: params,
    },
    { loading: false },
  )
}

export const delStaticDns = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'network.static_dns:delete',
      data: params,
    },
    { loading: false },
  )
}

export const getStaticRoute = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.static_route:get',
  })
}

export const addStaticRoute = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'network.static_route:add',
      data: params,
    },
    { loading: false },
  )
}

export const editStaticRoute = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'network.static_route:edit',
      data: params,
    },
    { loading: false },
  )
}

export const delStaticRoute = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'network.static_route:delete',
      data: params,
    },
    { loading: false },
  )
}

export const getOntAuth = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.ont_auth:get',
  })
}

export const editOntAuth = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'management.ont_auth:edit',
      data: params,
    },
    { loading: false },
  )
}

export const getPortMirr = (params): Promise<ApiResponse<any>> => {
  return http.post('GetPortMirr', createData(params))
}

export const setPortMirr = (params): Promise<ApiResponse<any>> => {
  return http.post('SetPortMirr', createData(params), { loading: false })
}

export const getTerminal = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'management.acl_control:get',
  })
}

export const setTerminal = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'management.acl_control:edit',
      data: params,
    },
    { loading: false },
  )
}

export const getDefaultRoute = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.default_route:get',
  })
}

export const setDefaultRoute = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'network.default_route:edit',
      data: params,
    },
    { loading: false },
  )
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
  return http.post(
    api,
    {
      method: 'network.ddns:add',
      data: params,
    },
    { loading: false },
  )
}

export const editDdns = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'network.ddns:edit',
      data: params,
    },
    { loading: false },
  )
}

export const delDdns = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'network.ddns:delete',
      data: params,
    },
    { loading: false },
  )
}

export const getWifiMacFilterStatus = (): Promise<ApiResponse<any>> => {
  return http.get('security.wifi_mac_filter.status:get')
}

export const setWifiMacFilterStatus = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.status:edit', createData(params), { loading: false })
}

export const getWifiMacFilter = (): Promise<ApiResponse<any>> => {
  return http.get('security.wifi_mac_filter.items:get')
}

export const addWifiMacFilter = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.items:add', createData(params), { loading: false })
}

export const editWifiMacFilter = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.items:edit', createData(params), { loading: false })
}

export const delWifiMacFilter = (params): Promise<ApiResponse<any>> => {
  return http.post('security.wifi_mac_filter.items:delete', createData(params), { loading: false })
}

export const getUsb = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.usb.status:get',
  })
}

export const usbDownload = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'storage.client.download:add',
      data: params,
    },
    { loading: false },
  )
}

export const getUsbDownloadList = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.client.download:get',
  })
}

export const editUsbServer = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'storage.server:edit',
      data: params,
    },
    { loading: false },
  )
}
export const getUsbServer = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.server:get',
  })
}

export const editSamba = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'storage.samba:edit',
      data: params,
    },
    { loading: false },
  )
}

export const getSamba = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.samba:get',
    data: params,
  })
}

export const editMediaSharing = (params): Promise<ApiResponse<any>> => {
  return http.post(
    api,
    {
      method: 'storage.media_sharing:edit',
      data: params,
    },
    { loading: false },
  )
}

export const getMediaSharing = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'storage.media_sharing:get',
  })
}

export const getMesh = (): Promise<ApiResponse<any>> => {
  return http.get('mesh.settings:get')
}
export const setMesh = (params): Promise<ApiResponse<any>> => {
  return http.post('mesh.settings:edit', createData(params), { loading: false })
}
export const triggerMesh = (params): Promise<ApiResponse<any>> => {
  return http.post('mesh.trigger:edit', createData(params))
}
export const getTopology = (): Promise<ApiResponse<any>> => {
  return http.get('mesh.topology:get', undefined, { loading: false })
}
export const getVpn = (): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.vpn.settings:get',
  })
}
export const setVpn = (params): Promise<ApiResponse<any>> => {
  return http.post(api, {
    method: 'network.vpn.settings:edit',
    data: params,
  })
}

export const startReboot = (): Promise<ApiResponse<any>> => {
  return http.post('reboot')
}

export const rebootStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getRebootStatus', undefined, { loading: false, toast: false })
}

export const startReset = (): Promise<ApiResponse<any>> => {
  return http.post('reset')
}

export const resetStatus = (): Promise<ApiResponse<any>> => {
  return http.get('getResetStatus', undefined, { loading: false, toast: false })
}
export const backup = (): Promise<ApiResponse<any>> => {
  return http.get('getConfig', undefined)
}
