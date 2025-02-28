<template>
  <form ref="form" class="fh-form">
    <slot></slot>
  </form>
</template>

<script setup>
import { ref, useSlots, provide, getCurrentInstance, computed } from 'vue'

defineOptions({
  name: 'FhForm',
  componentName: 'Form',
})

const props = defineProps({
  model: {
    type: Object,
  },
  rules: {
    type: Object,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  labelPosition: {
    type: String,
    default: 'top', // 如果值为 left 或者 right 时，则需要设置 label-width
  },
  labelWidth: {
    type: String,
  },
})

const potentialLabelWidthArr = ref([])

const slots = useSlots()

const instance = getCurrentInstance()
provide('form', instance)

const autoLabelWidth = computed(() => {
  if (!potentialLabelWidthArr.value.length) return 0
  const max = Math.max(...potentialLabelWidthArr.value)
  return max ? `${max}px` : ''
})

const validate = () => {
  let result = true
  const defaultSlots = slots.default?.() || []
  defaultSlots.forEach((child) => {
    if (child.validate) {
      if (!child.validate()) {
        result = false
      }
    }
    return true
  })
  return result
}
const clearValidate = () => {
  const defaultSlots = slots.default?.() || []
  defaultSlots.forEach((child) => {
    child.exposed.clearValidate()
  })
}
const getLabelWidthIndex = (width) => {
  const index = potentialLabelWidthArr.value.indexOf(width)
  if (index === -1) {
    throw new Error('[Form]unpected width ', width)
  }
  return index
}
const registerLabelWidth = (val, oldVal) => {
  if (val && oldVal) {
    const index = getLabelWidthIndex(oldVal)
    potentialLabelWidthArr.value.splice(index, 1, val)
  } else if (val) {
    potentialLabelWidthArr.value.push(val)
  }
}
const deregisterLabelWidth = (val) => {
  const index = getLabelWidthIndex(val)
  potentialLabelWidthArr.value.splice(index, 1)
}

defineExpose({
  autoLabelWidth,
  validate,
  clearValidate,
  registerLabelWidth,
  deregisterLabelWidth,
})
</script>
