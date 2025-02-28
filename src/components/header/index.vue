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
        <span class="logo__title" v-show="(isNoAuthPage || !isMobile) && title">{{ title }}</span>
        <fh-icon
          class="logo__drawer-toggle"
          :name="`icon-${drawer ? 'close' : 'menu'}`"
          @click="toggleDrawer"
          v-if="!isNoAuthPage && isMobile && hasChildPage"
        ></fh-icon>
      </div>
      <div class="nav-wrap" v-if="!isNoAuthPage">
        <div class="nav-active-text" v-if="activeMenuText">{{ $t(activeMenuText) }}</div>
        <!-- <fh-menu
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
          is-enlarge-font-size="true"
          @click="handleMenuItemClick"
          ref="headerMenu"
        >
        </fh-menu> -->
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
                v-for="lang in languages"
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
        <div class="exit" @click="exit()" v-if="!isNoAuthPage">
          <span class="exit-text">{{ $t('trans0018') }}</span>
          <fh-icon name="icon-logout" class="exit-mobile"></fh-icon>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

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

const props = defineProps({
  menus: {
    type: Array,
    default: () => [],
  },
})

const languages = LanguagesArr.filter((l) => l.show)
const logoSrc = VITE_CUSTOMER_CONFIG.logo
const menuMode = ref('horizontal')
const showPopup = ref(false)
const current = ref(null)
const navVisible = ref(true)
const activeMenuText = ref('')


</script>
