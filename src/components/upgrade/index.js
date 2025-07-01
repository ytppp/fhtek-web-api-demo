import { h } from 'vue'
import FhUpgrade from './upgrade.vue'
import { mergeOptions } from '@/util/tool'
import { usePopup } from '@/hooks/popup'
import Popup from '@/components/popup/popup.vue'

const defaultOptions = {
  url: '',
  title: '',
  tip: '',
  timeout: 120000,
  interval: 1000,
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
              onHide: () => {
                this.close()
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
