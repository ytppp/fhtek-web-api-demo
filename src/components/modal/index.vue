<template>
  <fh-wrap v-model:visible="model" :close-on-click-wrap="closeOnClickWrap">
    <div
      class="modal"
      :style="{ width: fullscreen ? '100%' : width, height: fullscreen ? '100%' : 'auto' }"
    >
      <div class="modal__header">
        <template v-if="slots.title || title">
          <template v-if="title">
            {{ title }}
          </template>
          <slot name="title" v-else></slot>
        </template>
        <fh-icon class="modal__close" name="icon-close" @click="close" v-if="showClose"></fh-icon>
      </div>
      <div
        class="modal__body"
        :style="`${fullscreen ? 'height: auto' : 'max-height: 80vh; overflow: auto'}`"
        v-if="slots.body"
      >
        <slot name="body"></slot>
      </div>
      <div class="modal__footer" v-if="slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </fh-wrap>
</template>

<script setup>
import { useSlots, watch } from 'vue'
import FhWrap from '../wrap/index.vue'

defineOptions({
  name: 'FhModal',
})

const props = defineProps({
  title: String,
  width: {
    type: String,
    default: '50%',
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  beforeClose: {
    type: Function,
    default: () => ({}),
  },
  closeOnClickWrap: {
    type: Boolean,
    default: true,
  },
})
const model = defineModel({
  type: Boolean,
  default: false,
})
const slots = useSlots()

watch(
  () => model.value,
  (val) => {
    if (!val) {
      close()
    }
  },
)

const close = () => {
  if (props.beforeClose) {
    props.beforeClose()
  }
}
</script>
