import { createI18n } from 'vue-i18n'
import { getLangUsed } from '../util/tool'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

const numberFormat = {
  decimal: {
    style: 'decimal',
  },
} // 数字格式

const registerComponents = (app) => {
  const locale = getLangUsed()
  const i18n = createI18n({
    locale,
    fallbackLocale: 'en-US',
    globalInjection: true,
    silentTranslationWarn: true,
    silentFallbackWarn: true,
    messages: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
  })
  app.use(i18n)
}

export function changeLanguage(lang) {
  if (!VITE_CUSTOMER_CONFIG.languages.includes(lang)) {
    console.log('language not exist!')
  } else {
    localStorage.setItem('lang', lang)
    window.location.reload()
  }
}

// export function translate(key, locale) {
//   return i18n.t(key, locale || i18n.locale)
// }

// export function toLocaleNumber(
//   number,
//   locale = 'en-US',
//   minimumFractionDigits = 1,
//   maximumFractionDigits = 1,
// ) {
//   // 有时候传入是不是数字，是占位符字符串
//   if (typeof number === 'number') {
//     return i18n.n(number, {
//       locale,
//       minimumFractionDigits,
//       maximumFractionDigits,
//     })
//   }
//   return number
// }

export default registerComponents
