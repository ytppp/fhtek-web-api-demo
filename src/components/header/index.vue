<template>
  <header
    class="header"
    :class="{
      'is-login-header': isNoAuthPage,
    }"
    :style="{ height: `${layoutHeaderHeight}px` }"
  >
    <div class="header__center-wrap">
      <div class="logo">
        <img class="logo__img" v-show="isNoAuthPage || !isMobile" :src="logoSrc" alt="" />
        <!-- <span class="logo__title" v-show="(isNoAuthPage || !isMobile) && title">{{ title }}</span> -->
        <fh-icon
          class="logo__drawer-toggle"
          :name="`icon-${drawer ? 'close' : 'menu'}`"
          @click="toggleDrawer"
          v-if="!isNoAuthPage && isMobile && hasChildPage"
        ></fh-icon>
      </div>
      <div class="nav-wrap" v-if="!isNoAuthPage">
        <div class="nav-active-text" v-if="activeMenuText">{{ $t(activeMenuText) }}</div>
        <fh-menu
          class="nav"
          :menus="menus"
          :active="url"
          mode="horizontal"
          :is-show-child-menu="false"
          active-key-name="url"
          background-color="#474747"
          hover-background-color="#474747"
          text-color="#fff"
          active-text-color="#fff"
          active-background-color="#D6001C"
          :is-enlarge-font-size="true"
          @click="handleMenuItemClick"
          ref="headerMenu"
        >
        </fh-menu>
      </div>
      <div class="right-wrap">
        <!-- lang selector -->
        <div
          class="lang-selector"
          :class="{ open: showPopup }"
          @mouseenter="setLangPopupVisible(true)"
          @mouseleave="setLangPopupVisible(false)"
        >
          <div class="current" @click.stop="setLangPopupVisible(true)">
            <span class="current-text">{{ language.text }}</span>
            <span class="drop-trangle" :class="{ down: !showPopup, up: showPopup }"></span>
            <fh-icon name="icon-translate" class="current-mobile"></fh-icon>
          </div>
          <transition name="popup">
            <ul class="popup" v-show="showPopup">
              <li
                :key="lang.value"
                v-for="lang in Languages"
                :class="{ selected: $i18n.locale === lang.value }"
                @click="selectLang(lang)"
              >
                {{ lang.text }}
                <i v-if="$i18n.locale === lang.value" class="is-checked"></i>
              </li>
            </ul>
          </transition>
        </div>
        <!-- exit -->
        <div class="exit" @click="exit" v-if="!isNoAuthPage">
          <span class="exit-text">{{ $t('trans0018') }}</span>
          <fh-icon name="icon-logout" class="exit-mobile"></fh-icon>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { getPublicFile } from '@/util/tool'
import { changeLanguage } from '@/i18n'
import { logout } from '@/http/api'

const LanguagesArr = [
  {
    text: 'English',
    value: 'en-US',
    show: false,
  },
  {
    text: '简体中文',
    value: 'zh-CN',
    show: false,
  },
  {
    text: 'Deutsch',
    value: 'de-DE',
    show: false,
  },
  {
    text: 'Nederlands',
    value: 'nl-NL',
    show: false,
  },
  {
    text: 'Srpski',
    value: 'sr-RS',
    show: false,
  },
  {
    text: 'Norsk bokmål',
    value: 'nb-NO',
    show: false,
  },
  {
    text: 'Français',
    value: 'fr-FR',
    show: false,
  },
  {
    text: 'Español',
    value: 'es-ES',
    show: false,
  },
]
VITE_CUSTOMER_CONFIG.languages.forEach((sl) => {
  const language = LanguagesArr.filter((l) => l.value === sl)[0]
  if (language) {
    language.show = true
  }
})

export default {
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      menuMode: 'horizontal',
      showPopup: false,
      Languages: LanguagesArr.filter((l) => l.show),
      current: null,
      navVisible: true,
      logoSrc: getPublicFile(VITE_CUSTOMER_CONFIG.logo),
      activeMenuText: '',
    }
  },
  computed: {
    language() {
      return this.getDefaultLanguage()
    },
    title() {
      return this.$parent.title
    },
    url() {
      return this.$parent.url
    },
    layoutHeaderHeight() {
      return this.$parent.layoutHeaderHeight
    },
    isNoAuthPage() {
      return this.$parent.isNoAuthPage
    },
    isMobile() {
      return this.$parent.isMobile
    },
    hasChildPage() {
      return this.$parent.hasChildPage
    },
    drawer() {
      return this.$parent.drawer
    },
  },
  watch: {
    menus() {
      if (this.$refs.headerMenu) {
        this.activeMenuText = this.$refs.headerMenu.activeMenu.text
      }
    },
  },
  methods: {
    toggleDrawer() {
      this.$parent.drawer = true
    },
    handleMenuItemClick(menu) {
      this.$parent.handleMenuItemClick(menu)
    },
    getDefaultLanguage() {
      const language = this.Languages.filter((l) => l.value === this.$i18n.locale)[0]
      if (!language) {
        return this.Languages[0]
      }
      return language
    },
    setLangPopupVisible(visible) {
      this.showPopup = visible
    },
    selectLang(lang) {
      changeLanguage(lang.value)
      this.showPopup = false
    },
    exit() {
      this.$dialog
        .confirm({
          okText: this.$t('trans0019'),
          cancelText: this.$t('trans0020'),
          message: this.$t('trans0021'),
        })
        .then(() => {
          logout()
            .then(() => {
              this.$router.push('/login')
            })
            .catch((error) => {
              console.log('POST 请求失败:', error)
            })
        })
        .catch(() => {
          console.log('222')
        })
    },
    close() {
      this.showPopup = false
    },
  },
  mounted() {
    if (this.$refs.headerMenu?.activeMenu) {
      this.activeMenuText = this.$refs.headerMenu.activeMenu.text
    }
    this.$i18n.locale = this.language.value
    window.addEventListener('click', this.close)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.close)
  },
}
</script>
@/http/v1.index.js
