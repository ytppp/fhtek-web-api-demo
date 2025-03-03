<template>
  <fh-wrap class="dialog-layer" v-model:visible="visible">
    <div class="dialog">
      <div v-if="title" class="dialog__title">{{ title }}</div>
      <div class="dialog__message">{{ message }}</div>
      <div class="dialog__buttons">
        <fh-button size="small" v-if="type !== DialogType.info" @click="cancel()">
          {{ cancelText }}
        </fh-button>
        <fh-button size="small" @click="ok()">{{ okText }}</fh-button>
      </div>
    </div>
  </fh-wrap>
</template>

<script setup>
import FhWrap from '../wrap/index.vue'
import { DialogType } from './constant'

defineOptions({
  name: 'FhDialog',
})

const instance = getCurrentInstance()
const type = ref(DialogType.info)
const visible = ref(false)
const message = ref('')
const title = ref('')
const callback = ref({})
const okText = ref('ok')
const cancelText = ref('cancel')
const timer = ref(null)

const afterClose = () => {
  const parentNode = instance.parent
  let transitionendTriggered = false
  instance.addEventListener('transitionend', () => {
    parentNode.removeChild(instance)
    transitionendTriggered = true
  })
  // to fix transitionend not trigger
  timer.value = setTimeout(() => {
    if (!transitionendTriggered) {
      parentNode.removeChild(instance)
    }
  }, 500)
}
const ok = () => {
  visible.value = false
  afterClose()
  callback.value.ok && callback.value.ok()
}
const cancel = () => {
  visible.value = false
  this.afterClose()
  callback.value.cancel && callback.value.cancel()
}
</script>
