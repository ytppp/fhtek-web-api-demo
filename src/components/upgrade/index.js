import { h } from 'vue'
import FhUpgrade from './upgrade.vue'
import { mergeOptions } from '@/util/tool'
import { usePopup } from '@/hooks/popup'
import { router } from '@/router/index'

const defaultOptions = {
  url: '',
  title: '',
  tip: '',
  timeout: 80 * 1000,
  interval: 1000,
  progressVisible: true,
}
let instance = null

export default {
  open(options) {
    const opt = mergeOptions(defaultOptions, options)
    if (!instance) {
      instance = usePopup(
        h(FhUpgrade, {
          ...opt,
          onHide: () => {
            this.close()
            router.push('/login')
          },
        }),
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
