<template>
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
</template>

<script setup>
import FhButton from '@/components/button/index.vue'
import { DialogType } from './constant'

defineOptions({
  name: 'FhDialog',
})
defineProps({
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

const ok = () => {
  emits('ok')
}
const cancel = () => {
  emits('cancel')
}
</script>
