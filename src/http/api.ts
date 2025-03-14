import { http } from './index'
import type { ApiResponse } from './type'


const createData = (data: any) => ({ data })

export const login = (params): Promise<ApiResponse<any>> => {
  return http.post('login', createData(params), { hasToken: false })
}

export const logout = (): Promise<ApiResponse<any>> => {
  return http.post('logout')
}

export const getLan = (): Promise<ApiResponse<any>> => {
  return http.get('GetLanIp')
}

export const setLan = (params): Promise<ApiResponse<any>> => {
  return http.get('SetLanIp', createData(params))
}

export const upload = (params): Promise<ApiResponse<any>> => {
  return http.post('uploadTest', createData(params))
}
