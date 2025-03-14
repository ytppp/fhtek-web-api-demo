<template>
  <transition name="wrap">
    <teleport to="body" :disabled="!isAppendBody">
      <div v-bind="attrs" ref="wrapRef" class="wrap" v-show="model">
        <div class="wrap__mask" :style="wrapStyleObj" @click="close" @touchstart="close"></div>
        <!-- modal -->
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
            <fh-icon
              class="modal__close"
              name="icon-close"
              @click="close"
              v-if="showClose"
            ></fh-icon>
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
      </div>
    </teleport>
  </transition>
</template>

<script setup>
import { useSlots, watch, computed, ref, useAttrs, onMounted } from 'vue'

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
  wrapBgColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.4)',
  },
})
const model = defineModel({
  type: Boolean,
  default: false,
})
const slots = useSlots()
const attrs = useAttrs()
const overflow = ref('')
const wrapRef = ref(null)

const wrapStyleObj = computed(() => {
  return {
    backgroundColor: props.wrapBgColor,
  }
})
const parentNode = computed(() => {
  if (props.isAppendBody) {
    return document.body
  } else {
    return wrapRef.value.parentNode
  }
})

watch(
  () => model.value,
  (val) => {
    if (val) {
      wrapRef.value.style.position = props.isAppendBody ? 'fixed' : 'absolute'
      // desktop prevent scroll
      overflow.value = parentNode.value ? parentNode.value.style.overflow : ''
      parentNode.value.style.overflow = 'hidden'
      // mobile prevent scroll
      parentNode.value && parentNode.value.addEventListener('touchmove', preventDefault, false)
    } else {
      parentNode.value.style.overflow = overflow.value
      parentNode.value && parentNode.value.removeEventListener('touchmove', preventDefault, false)
    }
  },
)

onMounted(() => {
  if (model.value) {
    wrapRef.value.style.position = props.isAppendBody ? 'fixed' : 'absolute'
  }
})

const preventDefault = (e) => {
  e.preventDefault()
}

const close = () => {
  if (props.beforeClose) {
    props.beforeClose()
  }
  model.value = false
}
</script>
