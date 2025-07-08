<template>
  <transition name="wrap">
    <teleport to="body" :disabled="!isAppendBody">
      <div v-bind="attrs" ref="wrapRef" class="wrap" v-show="visible">
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
const visible = ref(false)
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
  } else if (props.isManual) {
    return wrapRef.value.parentNode.parentNode // mount-node's parent node
  } else {
    return wrapRef.value.parentNode
  }
})

watch(visible, (val) => {
  if (val) {
    wrapRef.value.style.position = props.isAppendBody ? 'fixed' : 'absolute'
    overflow.value = parentNode.value ? parentNode.value.style.overflow : ''
    if (parentNode.value) {
      parentNode.value.style.overflow = 'hidden'
      parentNode.value.addEventListener('touchmove', preventDefault, false)
    }
  } else {
    if (parentNode.value) {
      parentNode.value.style.overflow = overflow.value
      parentNode.value.removeEventListener('touchmove', preventDefault, false)
    }
  }
})

onMounted(() => {
  // prevent auto open
  if (props.isManual) {
    visible.value = true
  }
})

onUnmounted(() => {
  visible.value = false
})

const preventDefault = (e) => {
  e.preventDefault()
}
const close = () => {
  if (!visible.value) return
  if (!props.closeOnClickWrap) {
    return
  }
  if (props.beforeClose) {
    props.beforeClose()
  }
  visible.value = false
}
const open = () => {
  visible.value = true
}

defineExpose({
  close,
  open,
})
</script>

<style lang="less">
.wrap {
  z-index: 1003;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  &.wrap-enter-active {
    transition: all 0.3s ease-in;
  }
  &.wrap-leave-active {
    transition: all 0.3s ease-out;
  }
  &.wrap-enter-from,
  &.wrap-leave-to {
    opacity: 0;
  }
  .wrap__mask {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
