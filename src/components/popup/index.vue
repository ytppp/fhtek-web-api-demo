<template>
  <transition name="wrap">
    <teleport to="body" :disabled="!isAppendBody">
      <div v-bind="attrs" ref="wrapRef" class="wrap" v-show="model">
        <div class="wrap__mask" :style="wrapStyleObj" @click="close" @touchstart="close"></div>
        <slot></slot>
      </div>
    </teleport>
  </transition>
</template>

<script lang="ts" setup>
import { computed, ref, watch, useAttrs, onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'FhPopup',
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
  beforeClose: {
    type: Function,
    default: () => ({}),
  },
  isAppendBody: {
    type: Boolean,
    default: true,
  }, // When set to false, perent node must set position
  isManual: {
    type: Boolean,
    default: false,
  }, // functional component must be set true
})
const model = defineModel('visible', {
  type: Boolean,
  default: false,
})
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
    return wrapRef.value.parentNode.parentNode // mount node's parent node
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
  if (props.isManual) {
    model.value = true
  }
})

onUnmounted(() => {
  model.value = false
})

const preventDefault = (e) => {
  e.preventDefault()
}
const close = () => {
  if (!props.closeOnClickWrap) {
    return
  }
  if (props.beforeClose) {
    props.beforeClose()
  }
  model.value = false
}

defineExpose({
  close,
})
</script>
