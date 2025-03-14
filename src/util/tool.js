function formatLang(lang) {
  let langFormated = {
    zh: 'zh-CN',
    en: 'en-US',
    nl: 'nl-NL',
    pt: 'pt-PT',
    fr: 'fr-FR',
    es: 'es-MX',
    de: 'de-DE',
  } // 浏览器返回语言可能只含“-”的前半部分，加上后半部分
  return langFormated[lang] ? langFormated[lang] : lang
}
export function getLangUsed() {
  var lang = VITE_CUSTOMER_CONFIG.defaultLanguage
  if (localStorage && localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang')
  } else if (
    navigator &&
    navigator.language &&
    VITE_CUSTOMER_CONFIG.languages.includes(formatLang(navigator.language))
  ) {
    lang = formatLang(navigator.language)
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
