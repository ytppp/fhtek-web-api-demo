import FhButton from './components/button/index.vue'
import FhIcon from './components/icon/index.vue'
import FhInput from './components/input/index.vue'
import FhForm from './components/form/index.vue'
import FhFormItem from './components/form-item/index.vue'
import FhSwitch from './components/switch/index.vue'
import FhSelect from './components/select/index.vue'
import clickoutside from './components/directives/clickoutside.js'

const registerComponents = (app) => {
  app.component('FhButton', FhButton)
  app.component('FhIcon', FhIcon)
  app.component('FhInput', FhInput)
  app.component('FhForm', FhForm)
  app.component('FhFormItem', FhFormItem)
  app.component('FhSwitch', FhSwitch)
  app.component('FhSelect', FhSelect)
  app.directive('clickoutside', clickoutside)
}

export default registerComponents
