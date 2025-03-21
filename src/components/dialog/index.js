import { h } from 'vue'
import { mergeOptions } from '@/util/tool'
import { usePopup } from '@/hooks/popup'
import { DialogType, DefaultOpt } from './constant'
import FhDialog from './index.vue'
import Popup from '@/components/popup/index.vue'

const dialog = (options, type = DialogType.info) => {
  const opt = mergeOptions(DefaultOpt[type], options)
  return new Promise((resolve, reject) => {
    const dialogInstance = usePopup(
      h(
        Popup,
        {
          isManual: true,
        },
        () =>
          h(FhDialog, {
            ...opt,
            onOk: () => {
              dialogInstance.close()
              resolve()
            },
            onCancel: () => {
              dialogInstance.close()
              reject()
            },
          }),
      ),
    )
    dialogInstance.show()
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
