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
