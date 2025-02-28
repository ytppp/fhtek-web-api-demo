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
