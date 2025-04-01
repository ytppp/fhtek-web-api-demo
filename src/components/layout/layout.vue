<template>
  <div class="layout" ref="layout">
    <fh-header :menus="menus" ref="layoutHeader" />
    <main class="layout__main" :style="!isMobile && { marginTop: `${layoutMainMarginTop}px` }">
      <template v-if="hasChildPage">
        <aside class="layout__aside" ref="layoutAside" :style="{ top: `${layoutAsideTop}px` }">
          <div class="aside" :style="{ backgroundColor: asideBgColor }">
            <fh-menu
              :menus="childMenus"
              :active="url"
              :background-color="asideBgColor"
              child-menu-font-size="16px"
              mode="vertical"
              active-key-name="url"
              text-color="#333"
              hover-text-color="#333"
              hover-background-color="#FFF"
              active-text-color="#FFF"
              active-background-color="#D6001C"
              active-child-menu-text-color="#333"
              active-child-menu-background-color="#FFF"
              @click="handleMenuItemClick"
            >
            </fh-menu>
          </div>
        </aside>
        <slot></slot>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </main>
    <fh-footer v-if="isNoAuthPage" />
    <div class="layout__toolbar-wrap" v-if="!isNoAuthPage">
      <ul class="layout__toolbar toolbar">
        <li
          v-for="(menu, index) in menus"
          :key="index"
          class="toolbar__item"
          :class="isToolbarActive(menu) && 'toolbar-item--active'"
          @click="() => handleMenuItemClick(menu)"
        >
          <fh-icon class="toolbar__icon" :name="menu.icon"></fh-icon>
          <span class="toolbar__text">{{ $t(menu.text) }}</span>
        </li>
      </ul>
    </div>
    <fh-drawer
      :title="$t('trans0016')"
      size="90%"
      v-model:visible="drawer"
      :appendToBody="true"
      v-if="isMobile"
    >
      <div :style="{ height: '100%', backgroundColor: asideBgColor }">
        <fh-menu
          :menus="childMenus"
          :active="url"
          :background-color="asideBgColor"
          child-menu-font-size="16px"
          mode="vertical"
          active-key-name="url"
          text-color="#333"
          hover-text-color="#333"
          hover-background-color="#FFF"
          active-text-color="#FFF"
          active-background-color="#D6001C"
          active-child-menu-text-color="#333"
          active-child-menu-background-color="#FFF"
          @click="handleMenuItemClick"
        >
        </fh-menu>
      </div>
    </fh-drawer>
  </div>
</template>

<script>
import { getMenu } from '@/util/menu'
import { isMobileDevice, isObjArrHasVal } from '@/util/tool'

// 若多维对象数组中存在某个值，返回其顶级对象
const getTopObjFromObjArr = (arr, val, childNodeName = 'children', keyName = 'url') => {
  return arr.find((item) => {
    if (item[childNodeName]) {
      return getTopObjFromObjArr(item[childNodeName], val, childNodeName, keyName)
    } else {
      return item[keyName] === val
    }
  })
}
// 返回多维对象数组不存在children的第一个对象
const getObjFromObjArr = (arr, childNodeName = 'children', keyName = 'url') => {
  let menu = null
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (item[childNodeName]) {
      return getObjFromObjArr(item[childNodeName], childNodeName, keyName)
    } else {
      return (menu = item)
    }
  }
  return menu
}
export default {
  props: {
    title: String,
    isStopRefresh: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      url: location.hash.replace('#', ''),
      layoutMainMarginTop: 30,
      layoutHeaderHeight: 70,
      asideBgColor: '#DDDDDD',
      isMobile: false,
      drawer: false,
    }
  },
  computed: {
    isNoAuthPage() {
      return ['/login', '/guide'].includes(this.url)
    },
    hasChildPage() {
      return this.childMenus.length > 0
    },
    menus() {
      return getMenu()
    },
    childMenus() {
      if (!this.url.length) return
      const arr = getTopObjFromObjArr(this.menus, this.url)
      if (arr && arr.children) {
        return arr.children
      } else {
        return []
      }
    },
    layoutAsideTop() {
      return this.isMobile
        ? this.layoutHeaderHeight
        : this.layoutMainMarginTop + this.layoutHeaderHeight
    },
  },
  watch: {
    $route(val) {
      this.url = val.path
    },
  },
  methods: {
    isToolbarActive(menu) {
      if (menu.children) {
        return isObjArrHasVal(menu.children, this.url)
      }
      return menu.url === this.url
    },
    handleMenuItemClick(menuObj) {
      let menu = null
      if (menuObj.children) {
        menu = getObjFromObjArr(menuObj.children)
      } else {
        menu = menuObj
      }
      if (this.drawer) this.drawer = false
      this.$router.push(menu.url)
    },
    setHeight() {
      const contentMinHeight = 600 // 定义内容区域最小高度
      const height = Math.max(document.body.clientHeight, contentMinHeight)
      this.$refs.layout.style.minHeight = `${height}px`
      if (this.$refs.layoutAside) {
        const height =
          document.body.clientHeight -
          this.$refs.layoutHeader.$el.offsetHeight -
          this.layoutMainMarginTop
        this.$refs.layoutAside.style.maxHeight = `${height}px`
      }
    },
    showMobileMenu(menu) {
      this.childList.forEach((l) => {
        if (l !== menu) {
          l.selected = false
        }
      })
      menu.selected = !menu.selected
    },
    changeScreen() {
      this.setHeight()
      this.isMobile = isMobileDevice()
    },
  },
  mounted() {
    this.changeScreen()
    if (window.addEventListener) {
      window.addEventListener('resize', this.changeScreen)
    } else if (window.attachEvent) {
      window.attachEvent('resize', this.changeScreen)
    }
  },
  beforeUnmount() {
    if (window.addEventListener) {
      window.removeEventListener('resize', this.changeScreen)
    } else if (window.attachEvent) {
      window.detachEvent('resize', this.changeScreen)
    }
  },
}
</script>
