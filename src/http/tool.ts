import { ResultEnum } from './config'
import type { TAxiosRequestConfig, TAxiosError } from './type'

// 获取token
export function getToken(): string {
  return sessionStorage.getItem('token') || ''
}

// 添加token到请求头
export function addTokenToHeader(config: TAxiosRequestConfig): void {
  const token = getToken()
  if (token) {
    console.log(config.headers)
    config.headers = config.headers || {}
    config.headers['Cookie'] = `-goahead-session-=${token}`
  }
}

// 显示加载动画
export function showLoading(config: TAxiosRequestConfig): void {
  if (config.loading) {
    console.log('显示全屏加载动画')
    // showFullScreenLoading()
  }
}

// 隐藏加载动画
export function hideLoading(config: TAxiosRequestConfig): void {
  if (config.loading) {
    console.log('隐藏全屏加载动画')
    // hideFullScreenLoading()
  }
}

// 处理HTTP状态码
export function checkStatus(status: number): void {
  let message = '未知错误'
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      // 这里可以处理登出逻辑
      break
    case 403:
      message = '拒绝访问(403)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})!`
  }
  console.log(message)
  // ElMessage.error(message)
}

// 处理错误信息
export function handleNetworkError(error: TAxiosError): void {
  let message = '未知错误'
  if (error.message) {
    if (error.message.includes('timeout')) {
      message = '网络请求超时'
    } else if (error.message.includes('Network Error')) {
      message = '网络连接错误'
    } else {
      message = error.message
    }
  }
  console.log(message)
  // ElMessage.error(message)
}

// 处理业务错误
export function handleBusinessError(data: any): boolean {
  // 如果没有code，说明不是标准响应格式（如二进制流）
  if (!data || !data.code) {
    return false
  }
  let message = '业务错误'
  let flag = true

  // 处理不同的业务状态码
  switch (data.code) {
    case ResultEnum.SUCCESS:
      message = data.msg || '请求成功'
      flag = false
    case ResultEnum.NoAuth:
      message = data.msg || '无权限'
    case ResultEnum.OVERDUE:
      message = data.msg || '登录已过期，请重新登录'
    default:
      message = data.msg || '请求失败'
  }
  console.log(message)
  // ElMessage.error(message)
  return flag
}
