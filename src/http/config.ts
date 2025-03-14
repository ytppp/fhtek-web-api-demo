import type { TAxiosRequestConfig } from './type'

export enum ResultEnum {
  SUCCESS = 100,
  ERROR = 500,
  OVERDUE = 401,
  TIMEOUT = 10000,
  NoAuth = 10001,
  TYPE = 'success',
}

const defaultUrl = '/action'

export const defaultConfig: TAxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL || '/action',
  timeout: 10000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  loading: true, // show loading
  cancel: true, // cancel duplicate requests
  withCredentials: true, // 是否携带cookie
  hasToken: false, // 是否携带token
}
