import type { TAxiosRequestConfig } from './type'

export enum ResultEnum {
  TYPE = 'success',
  SUCCESS = 100,
  ERROR = 500,
  NOAUTH = 10001,
  OVERDUE = 10002,
  INVALIDSESSION = 10003,
  INVALIDJSON = 10004,
  HASLOGIN = 10005,
  INVALIDFILE = 10006,
}

const defaultUrl = '/action'

export const defaultConfig: TAxiosRequestConfig = {
  baseURL: defaultUrl, // import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  loading: true, // show loading
  cancel: true, // cancel duplicate requests
  hasToken: false, // 是否携带token
  toast: true, // Whether to display error messages toast
}
