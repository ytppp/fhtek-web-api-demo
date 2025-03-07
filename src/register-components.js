import FhButton from './components/button/index.vue'
import FhIcon from './components/icon/index.vue'
import FhInput from './components/input/index.vue'
import FhForm from './components/form/index.vue'
import FhFormItem from './components/form-item/index.vue'
import FhSwitch from './components/switch/index.vue'
import FhSelect from './components/select/index.vue'
import FhModal from './components/modal/index.vue'
import FhLayout from './components/layout/index.vue'
import FhHeader from './components/header/index.vue'
import FhFooter from './components/footer/index.vue'
import FhMenu from './components/menu/index.vue'
import FhDrawer from './components/drawer/index.vue'
import clickoutside from './components/directives/clickoutside.js'

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
  app.directive('clickoutside', clickoutside)
}

export default registerComponents
