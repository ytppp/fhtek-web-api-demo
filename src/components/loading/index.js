import { h } from 'vue'
import FhLoading from './loading.vue'
import { mergeOptions } from '@/util/tool'
import { usePopup } from '@/hooks/popup'
import Popup from '@/components/popup/popup.vue'

const DefaultOpt = {
  tip: '',
  title: '',
}
let instance = null
export default {
  open(options) {
    const opt = null
    if (typeof options === 'string') {
      opt = mergeOptions(DefaultOpt, {
        title: options,
      })
    } else {
      opt = mergeOptions(DefaultOpt, options)
    }
    if (!instance) {
      instance = usePopup(
        h(
          Popup,
          {
            isManual: true,
          },
          () =>
            h(FhLoading, {
              tip: opt.tip,
              title: opt.title,
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
