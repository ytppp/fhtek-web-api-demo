import { h, render } from 'vue'
import { mergeOptions } from '../../util/tool'
import { DialogType } from './constant'
import DialogComm from './index.vue'

const DefaultOpt = {
  [DialogType.info]: {
    dialogType: DialogType.info,
    title: '',
    message: 'info',
    okText: 'ok',
  },
  [DialogType.confirm]: {
    dialogType: DialogType.confirm,
    title: '',
    message: 'confirm',
    okText: 'ok',
    cancelText: 'cancel',
  },
}
const dialog = (options, type = DialogType.info) => {
  const opt = mergeOptions(DefaultOpt[type], options)
  return new Promise((resolve, reject) => {
    const dialogCommInstance = h(DialogComm, {
      ...opt,
      onOk: () => {
        render(null, document.body)
        resolve()
      },
      onCancel: () => {
        render(null, document.body)
        reject()
      },
    })
    render(dialogCommInstance, document.body)
  })
}

export default {
  info(options) {
    return dialog(options)
  },
  confirm(options) {
    return dialog(options, DialogType.confirm)
  },
}
