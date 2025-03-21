import { IP } from './constant.js'
const domainReg = /^(https?:\/\/)?([\w-]+\.)*([\w-]+\.[a-zA-Z]{2,})(\/\S*)?$/i
const ipReg =
  /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/
const ipv6Reg =
  /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i
const IPAReg =
  /^10\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])$/
const IPBReg =
  /^172\.(1[6789]|2[0-9]|3[01])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])$/
const IPCReg =
  /^192\.168\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])$/

export function getLangUsed() {
  var lang = VITE_CUSTOMER_CONFIG.defaultLanguage
  if (localStorage && localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang')
  }
  return lang
}

export function scrollTo(el, x = 0, y = 0) {
  if (el.scrollTo) {
    el.scrollTo(x, y)
  } else {
    el.scrollLeft = x
    el.scrollTop = y
  }
}

export function getIpBefore(ip) {
  const pattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\./
  return pattern.exec(ip)[0]
}
export function getIpAfter(ip) {
  const pattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\./
  return ip.replace(pattern, '')
}

export function mergeOptions(opt1, opt2) {
  return {
    ...opt1,
    ...opt2,
  }
}

// 对象数组中是否存在某个值
export function isObjArrHasVal(arr, val, childNodeName = 'children', keyName = 'url') {
  return arr.some((item) => {
    if (item[childNodeName]) {
      return isObjArrHasVal(item[childNodeName], val, childNodeName, keyName)
    } else {
      return item[keyName] === val
    }
  })
}

export function isMobileDevice(width = 768) {
  // let isMobileUserAgent = false;
  // const userAgent = navigator.userAgent;
  // const mobileKeywords = [
  //   "Android",
  //   "webOS",
  //   "iPhone",
  //   "iPad",
  //   "iPod",
  //   "BlackBerry",
  //   "Windows Phone"
  // ];
  // const isTouchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  // const isMobileScreen = document.body.clientWidth <= width;
  // for (const keyword of mobileKeywords) {
  //   if (userAgent.includes(keyword)) {
  //     isMobileUserAgent = true;
  //     break;
  //   }
  // }

  // return isMobileUserAgent || isTouchSupported || isMobileScreen;
  return document.body.clientWidth <= width
}

export function setFavicon(favicon) {
  const link = document.createElement('link')
  link.rel = 'icon'
  link.href = favicon
  const head = document.getElementsByTagName('head')[0]
  const existingLink = head.querySelector("link[rel*='icon']")
  if (existingLink) {
    head.removeChild(existingLink)
  }
  head.appendChild(link)
}
export function setDocTitle(title) {
  document.title = title
}
export function getPublicFile(url) {
  return new URL(url, import.meta.url).href
}
export function isValidLength(value, min = 8, max = 24) {
  if (!value) {
    return false
  }
  if (value.length < min || value.length > max) {
    return false
  }
  return true
}

export const specialChar = '!#$*+-.=?@_~'
export function isValidSymbol(value, ruleReg = /^[a-zA-Z0-9!#$\*\+\-.=\?@_~]+$/) {
  if (!value) {
    return false
  }
  return ruleReg.test(value)
}

export function getStringByte(str) {
  let total = 0
  /**
   * js默认使用utf-16进行编码，同时codePointAt也会返回的utf-16的码点值
   * 但是存储是路由器，使用的是utf-8的编码方式，所以需要计算为utf-8的字节数
   * 转换的具体方式，通过取每个字符的codePointAt(0)得到该字符的unicode码点(code point)
   * 然后按照utf-8的转换方式去计算utf-8的字节数
   * */

  for (const ch of str) {
    const charCode = ch.codePointAt(0)
    if (charCode <= 0x007f) {
      total += 1
    } else if (charCode <= 0x07ff) {
      total += 2
    } else if (charCode <= 0xffff) {
      total += 3
    } else {
      total += 4
    }
  }

  return total
}

export function getFileExtendName(file) {
  if (file) {
    const r = file.name.split('.')
    if (r.length) {
      return r[r.length - 1]
    }
  }
  return ''
}

export function isIP(ip, type = IP.IPv4) {
  let reg = null
  switch (type) {
    case IP.IPv4:
      reg = ipReg
      break
    case IP.IPv6:
      reg = ipv6Reg
      break
    default:
      reg = ipReg
  }
  return ip && reg.test(ip)
}

export function ip2int(ip) {
  return ip.split('.').reduce((total, next) => (total << 8) + Number(next), 0) >>> 0
}
// 组播地址
export function isMulticast(ip) {
  const i = ip2int(ip)
  if (i >= ip2int('224.0.0.0') && i <= ip2int('239.255.255.255')) {
    return true
  }
  return false
}
// 环回地址
export function isLoopback(ip) {
  const i = ip2int(ip)
  if (i >= ip2int('127.0.0.0') && i <= ip2int('127.255.255.255')) {
    return true
  }
  return false
}
function ipRule(ip, mask) {
  if (!mask || !ip) {
    return true
  }
  if (!isIP(ip) || !isIP(mask)) {
    return false
  }

  if (ip && mask) {
    if (isMulticast(ip) || isLoopback(ip)) {
      return false
    }
    const i = ip2int(ip)
    const m = ~ip2int(mask)
    const reslut = i & m
    if (reslut >= 1 && reslut < m) {
      return true
    }
    return false
  }
  return true
}
// 是否为私有地址
function isPrivateIP(ip) {
  return IPAReg.test(ip) || IPBReg.test(ip) || isIPC(ip)
}
// 是否为网络地址
// eg:
//  ip: 192.168.110.0 mask: 255.255.255.0 true
//  ip: 192.168.0.0 mask: 255.255.0.0 true
export function isNetworkIP(ip, mask) {
  const bip = ip2int(ip)
  const bmask = ip2int(mask)
  const r = (bip & bmask) >>> 0 // >>>0去掉符号位
  return r === bip
}
// 是否是广播地址
export function isBoardcastIP(ip, mask) {
  const bip = ip2int(ip)
  const bmask = ~ip2int(mask)
  const r = (bip | bmask) >>> 0 // >>>0去掉符号位
  return r === bip
}
// 是否是有效的网关地址
export const isValidGatewayIP = (ip, mask) => {
  const AIPMask = ipRule(ip, mask)
  const BIPMask = ipRule(ip, mask)
  const CIPMask = ipRule(ip, mask)
  return AIPMask || BIPMask || CIPMask
}

export function getSubNetwork(hostIP, mask) {
  return ip2int(hostIP) & ip2int(mask)
}
