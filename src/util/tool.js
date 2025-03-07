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
