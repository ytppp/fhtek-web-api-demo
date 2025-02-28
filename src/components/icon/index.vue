<template>
  <svg @click="click" @mouseover="hover" @mouseout="out" class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script setup>
import { computed, ref } from 'vue'
import './iconfont'

defineOptions({
  name: 'FhIcon',
})

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  hoverName: {
    type: String,
  },
})

const isHover = ref(false)

const emit = defineEmits(['click'])

const iconName = computed(() => `#${isHover.value ? props.hoverName : props.name}`)

const click = (event) => {
  emit('click', event)
}
const hover = () => {
  if (!props.hoverName) {
    return
  }
  isHover.value = true
}
const out = () => {
  if (!props.hoverName) {
    return
  }
  isHover.value = false
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
