import FhButton from './components/button/button.vue'
import FhDescriptions from './components/descriptions/descriptions.vue'
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
import FhCheckbox from './components/checkbox/checkbox.vue'
import FhCheckboxGroup from './components/checkbox/checkbox-group.vue'
import FhRadio from './components/radio/radio.vue'
import FhRadioGroup from './components/radio/radio-group.vue'
import FhPopover from './components/popover/popover.vue'
import FhTimePicker from './components/time-picker/time-picker.vue'
import FhStep from './components/step/step.vue'
import FhTable from './components/table/table.vue'
import FhTableNew from './components/table/table-new.vue'
import FhPagination from './components/pagination/pagination.vue'

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
  app.component('FhCheckbox', FhCheckbox)
  app.component('FhCheckboxGroup', FhCheckboxGroup)
  app.component('FhRadio', FhRadio)
  app.component('FhRadioGroup', FhRadioGroup)
  app.component('FhPopover', FhPopover)
  app.component('FhTimePicker', FhTimePicker)
  app.component('FhStep', FhStep)
  app.component('FhTable', FhTableNew)
  app.component('FhDescriptions', FhDescriptions)
  app.component('FhPagination', FhPagination)

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
