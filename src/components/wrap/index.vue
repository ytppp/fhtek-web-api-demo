<template>
  <transition name="wrap">
    <teleport to="body" :disabled="isAppendBody === false">
      <div ref="teleportEle" class="wrap" v-show="model">
        <div class="wrap__mask" :style="wrapStyleObj" @click="close" @touchstart="close"></div>
        <slot></slot>
      </div>
    </teleport>
  </transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'FhWrap',
})

const props = defineProps({
  closeOnClickWrap: {
    type: Boolean,
    default: false,
  },
  wrapBgColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.4)',
  },
  isAppendBody: {
    type: Boolean,
    default: true,
  },
})
const model = defineModel('visible', {
  type: Boolean,
  default: false,
})
const overflow = ref('')
const teleportEle = ref(null)

const wrapStyleObj = computed(() => {
  return {
    backgroundColor: props.wrapBgColor,
  }
})
const parentNode = computed(() => {
  if (props.isAppendBody) {
    return document.body
  } else {
    return teleportEle.value.parentNode
  }
})

watch(
  () => model.value,
  (val) => {
    model.value = val
    if (model.value) {
      teleportEle.value.style.position = props.isAppendBody ? 'fixed' : 'absolute'
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

const preventDefault = (e) => {
  e.preventDefault()
}
const close = () => {
  if (!props.closeOnClickWrap) {
    return
  }
  model.value = false
}
</script>
