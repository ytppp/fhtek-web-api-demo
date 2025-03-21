import { h } from 'vue'
import FhUpgrade from './index.vue'
import { mergeOptions } from '@/util/tool'
import { usePopup } from '@/hooks/popup'
import Popup from '@/components/popup/index.vue'

const defaultOptions = {
  url: '',
  title: '',
  tip: '',
  timeout: 300,
  progressVisible: true,
}
let instance = null

export default {
  open(options) {
    const opt = mergeOptions(defaultOptions, options)
    if (!instance) {
      instance = usePopup(
        h(
          Popup,
          {
            isManual: true,
          },
          () =>
            h(FhUpgrade, {
              ...opt,
              hideHandle: () => {
                instance.close()
              },
            }),
        ),
      )
      instance.show()
    }
  },
  close() {
    if (instance) {
      instance.close()
      instance = null
    }
  },
}
