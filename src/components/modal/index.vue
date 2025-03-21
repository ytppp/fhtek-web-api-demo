<template>
  <fh-popup
    :close-on-click-wrap="closeOnClickWrap"
    :is-append-body="isAppendBody"
    v-model:visible="model"
    ref="popupRef"
  >
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
  </fh-popup>
</template>

<script setup>
import { ref, useSlots } from 'vue'
import FhPopup from '@/components/popup/index.vue'

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
  isAppendBody: {
    type: Boolean,
    default: true,
  }, // When set to false, perent node must set position
  // wrapBgColor: {
  //   type: String,
  //   default: 'rgba(0, 0, 0, 0.4)',
  // },
})
const model = defineModel({
  type: Boolean,
  default: false,
})
const slots = useSlots()
const popupRef = ref(null)
const close = () => {
  popupRef.value.close()
}
</script>
