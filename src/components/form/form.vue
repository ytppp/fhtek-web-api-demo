<template>
  <form :id="id">
    <slot></slot>
  </form>
</template>

<script setup>
import { ref, provide, computed, watch, useId } from 'vue'
import { useIsMobile } from '@/hooks/is-mobile'

defineOptions({
  name: 'FhForm',
  componentName: 'Form',
})

const id = useId()
const { isMobile } = useIsMobile()

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
    default: '', // value: top, left, right. when set to left or right, label-width must be set
  },
  labelWidth: {
    type: String,
    default: '230px',
  },
})

const selfLabelPosition = ref('')
const potentialLabelWidthArr = ref([])
const formItems = ref([])

const autoLabelWidth = computed(() => {
  if (!potentialLabelWidthArr.value.length) return 0
  const max = Math.max(...potentialLabelWidthArr.value)
  return max ? `${max}px` : ''
})

watch(isMobile, (val) => (selfLabelPosition.value = val ? 'top' : 'right'), {
  immediate: true,
})

const registerFormItem = (validates) => {
  formItems.value.push(validates)
}
const validate = () => {
  let result = true
  formItems.value.forEach((validates) => {
    result = validates.validate() && result
  })
  return result
}
const clearValidate = () => {
  formItems.value.forEach((validates) => {
    validates.clearValidate()
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

provide('form', {
  autoLabelWidth,
  registerLabelWidth,
  deregisterLabelWidth,
  labelWidth: computed(() => props.labelWidth),
  labelPosition: computed(() => props.labelPosition || selfLabelPosition.value),
  rules: computed(() => props.rules),
  model: computed(() => props.model),
  disabled: computed(() => props.disabled),
})
provide('registerFormItem', registerFormItem)

defineExpose({
  validate,
  clearValidate,
})
</script>

<style lang="less"></style>
