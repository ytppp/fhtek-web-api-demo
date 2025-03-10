<template>
  <fh-wrap v-model:visible="visible">
    <div class="dialog">
      <div v-if="title" class="dialog__title">{{ title }}</div>
      <div class="dialog__message">{{ message }}</div>
      <div class="dialog__buttons">
        <fh-button size="small" v-if="dialogType !== DialogType.info" @click="cancel">
          {{ cancelText }}
        </fh-button>
        <fh-button size="small" @click="ok">{{ okText }}</fh-button>
      </div>
    </div>
  </fh-wrap>
</template>

<script setup>
import { ref } from 'vue'
import FhWrap from '../wrap/index.vue'
import FhButton from '../button/index.vue'
import { DialogType } from './constant'

defineOptions({
  name: 'DialogComm',
})
const props = defineProps({
  dialogType: {
    type: String,
    default: DialogType.info,
  },
  message: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  okText: {
    type: String,
    default: 'ok',
  },
  cancelText: {
    type: String,
    default: 'cancel',
  },
})
const emits = defineEmits(['ok', 'cancel'])
const visible = ref(true)

const ok = () => {
  visible.value = false
  emits('ok')
}
const cancel = () => {
  visible.value = false
  emits('cancel')
}
</script>
