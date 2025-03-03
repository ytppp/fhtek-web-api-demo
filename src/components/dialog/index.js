import { mergeOptions } from 'tool'
import FhDialog from './index.vue'
import { DialogType } from './constant'

const DefaultOpt = {
  [DialogType.info]: {
    title: '',
    message: 'info',
    callback: {},
    okText: 'ok',
  },
  [DialogType.confirm]: {
    title: '',
    message: 'confirm',
    callback: {},
    okText: 'ok',
    cancelText: 'cancel',
  },
}
const hasDialog = () => {
  const mask = document.querySelector('.dialog-layer')
  if (!mask) {
    return false
  }
  const cls = Array.from(mask.classList)
  // 如果弹出框整在处于离开动画的状态，也认为没有弹窗
  if (cls.includes('wrap-leave-active')) {
    return false
  }
  return true
}
const dialog = (options, type = DialogType.info) => {
  const opt = mergeOptions(DefaultOpt[type], options)
  opt.type = type
  if (!DefaultOpt[type]) {
    console.log('error dialog type')
    return
  }
  if (!hasDialog()) {
    const instance = new FhDialog({ data: opt }).$mount()
    instance.visible = true
    document.body.appendChild(instance.$el)
  }
}

export default {
  info(options) {
    dialog(options)
  },
  confirm(options) {
    dialog(options, DialogType.confirm)
  },
}
