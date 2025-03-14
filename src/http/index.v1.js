import axios from 'axios'

axios.defaults.timeout = 60000
const defaultUrl = '/action'

const createMethod = (action, url = defaultUrl) => `${url}/${action}`

const Methods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  patch: 'patch',
}
const trimObjItemValue = (obj) => {
  let newObj = obj instanceof Array ? [] : {}
  if (typeof obj === 'object') {
    return obj
  } else {
    Object.keys(obj).forEach((key) => {
      if (obj[key] instanceof Array) {
        newObj[key] = trimObjItemValue(obj[key])
      } else if (typeof obj[key] === 'string') {
        newObj[key] = obj[key].trim()
      } else {
        newObj[key] = obj[key]
      }
    })
  }
  return newObj
}
const request = (options) => {
  options.method = options.method || Methods.get
  let key = 'data'
  if (options.method === Methods.get || options.method === Methods.delete) {
    key = 'params'

    // avoid cache in ie.
    if (options.url.includes('?')) {
      options.url += `&t=${Date.now()}`
    } else {
      options.url += `?t=${Date.now()}`
    }
  }

  let params
  if (options.params) {
    params = trimObjItemValue(options.params)
  }
  return axios({
    url: options.url,
    method: options.method,
    [key]: params,
    withCredentials: true,
  })
    .then((response) => {
      // const { code } = response.data
      // if (code !== 100) {
      //   return Promise.reject(new Error('error code'))
      // }
      return Promise.resolve(response.data)
    })
    .catch((error) => {
      const response = error.response
      if (response) {
        // if (response.status === 401) {
        //   window.location.href = '/login'
        //   return
        // }
        if (response.data) {
          // const data = response.data
          // let code = ''
          // if (data.error && data.error.code) {
          //   code = data.error.code
          //   MessageBox.alert(translate(code), {
          //     type: 'error',
          //     confirmButtonText: translate('trans0057'),
          //     showClose: false,
          //   })
          // } else {
          //   Message.error(translate('trans0203'))
          // }
          return Promise.reject(error)
        }
      }
    })
}

// const commonMethods = {
//   login: createMethod('login'),
//   loginout: createMethod('logout'),
//   getLan: createMethod('GetLanIp'),
//   setLan: createMethod('SetLanIp'),
// }

export default {
  login(params) {
    return request({
      url: createMethod('login'),
      params,
      method: Methods.post,
    })
  },
  logout() {
    return request({
      url: createMethod('logout'),
      method: Methods.post,
    })
  },
  getLan() {
    return request({
      url: createMethod('GetLanIp'),
      method: Methods.get,
    })
  },
  setLan(params) {
    return request({
      url: createMethod('SetLanIp'),
      params,
      method: Methods.post,
    })
  },
  upload(params) {
    return request({
      url: createMethod('uploadTest'),
      method: Methods.post,
      params,
    })
  },
}
