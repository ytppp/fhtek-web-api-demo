import { http } from './index'
import type { ApiResponse } from './type'

const createData = (data: any) => ({ data })

export const login = (params): Promise<ApiResponse<any>> => {
  return http.post('login', createData(params))
}

export const logout = (): Promise<ApiResponse<any>> => {
  return http.post('logout')
}

export const getLan = (): Promise<ApiResponse<any>> => {
  return http.get('GetLanIp')
}

export const setLan = (params): Promise<ApiResponse<any>> => {
  return http.post('SetLanIp', createData(params))
}

export const upload = (params, onprogressCallback): Promise<ApiResponse<any>> => {
  return http.upload('uploadTest', params, onprogressCallback, { loading: false })
}

export const getUpgradeStatus = (): Promise<ApiResponse<any>> => {
  return http.get('ChkUpgradeStatus', {}, { loading: false, toast: false })
}

export const getWan = (): Promise<ApiResponse<any>> => {
  return http.get('GetWan')
}

export const setWan = (params): Promise<ApiResponse<any>> => {
  return http.post('SetWan', createData(params))
}

export const getIpv6Wan = (): Promise<ApiResponse<any>> => {
  return http.get('GetWan6')
}

export const setIpv6Wan = (params): Promise<ApiResponse<any>> => {
  return http.post('SetWan6', createData(params))
}

export const getWifi2g = (): Promise<ApiResponse<any>> => {
  return http.get('GetWifi2g')
}

export const setWifi2g = (params): Promise<ApiResponse<any>> => {
  return http.post('SetWifi2g', createData(params))
}

export const getWifi5g = (): Promise<ApiResponse<any>> => {
  return http.get('GetWifi5g')
}

export const setWifi5g = (params): Promise<ApiResponse<any>> => {
  return http.post('SetWifi5g', createData(params))
}

export const getIpv6Lan = (): Promise<ApiResponse<any>> => {
  return http.get('GetLan6')
}

export const setIpv6Lan = (params): Promise<ApiResponse<any>> => {
  return http.post('SetLan6', createData(params), { loading: false, toast: false })
}
