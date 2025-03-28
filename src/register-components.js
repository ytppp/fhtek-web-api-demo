import FhButton from './components/button/button.vue'
import FhIcon from './components/icon/icon.vue'
import FhInput from './components/input/input.vue'
import FhForm from './components/form/form.vue'
import FhFormItem from './components/form-item/form-item.vue'
import FhSwitch from './components/switch/switch.vue'
import FhSelect from './components/select/select.vue'
import FhModal from './components/modal/modal.vue'
import FhLayout from './components/layout/layout.vue'
import FhHeader from './components/header/header.vue'
import FhFooter from './components/footer/footer.vue'
import FhMenu from './components/menu/menu.vue'
import FhDrawer from './components/drawer/drawer.vue'
import FhAlert from './components/alert/alert.vue'
import FhUpload from './components/upload/upload.vue'

import clickoutside from './components/directives/clickoutside.js'
import vloading from './components/directives/loading.js'

import toast from '@/components/toast'
import dialog from '@/components/dialog'
import loading from '@/components/loading'
import upgrade from '@/components/upgrade'

// Dialog 等组件需要手动导入
const registerComponents = (app) => {
  app.component('FhButton', FhButton)
  app.component('FhIcon', FhIcon)
  app.component('FhInput', FhInput)
  app.component('FhForm', FhForm)
  app.component('FhFormItem', FhFormItem)
  app.component('FhSwitch', FhSwitch)
  app.component('FhSelect', FhSelect)
  app.component('FhModal', FhModal)
  app.component('FhLayout', FhLayout)
  app.component('FhHeader', FhHeader)
  app.component('FhFooter', FhFooter)
  app.component('FhDrawer', FhDrawer)
  app.component('FhMenu', FhMenu)
  app.component('FhAlert', FhAlert)
  app.component('FhUpload', FhUpload)

  app.directive('clickoutside', clickoutside)
  app.directive('loading', vloading)

  app.config.globalProperties.$toast = toast
  app.config.globalProperties.$dialog = dialog
  app.config.globalProperties.$loading = loading
  app.config.globalProperties.$upgrade = upgrade
  app.provide('toast', app.config.globalProperties.$toast) // for use in setup
  app.provide('dialog', app.config.globalProperties.$dialog)
  app.provide('loading', app.config.globalProperties.$loading)
  app.provide('upgrade', app.config.globalProperties.$upgrade)
}

export default registerComponents
