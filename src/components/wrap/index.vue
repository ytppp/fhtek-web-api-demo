<template>
  <transition name="wrap">
    <teleport :to="body">
      <div class="wrap" v-show="open">
        <div class="wrap__mask" :style="wrapStyleObj" @click="close" @touchstart="close"></div>
        <slot></slot>
      </div>
    </teleport>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
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

const open = ref(false)
const overflow = ref('')
</script>
