<template>
  <div class="radio-group" :class="`is-${direction}`">
    <slot></slot>
  </div>
</template>

<script setup>
import { provide } from 'vue'

defineOptions({
  name: 'FhRadioGroup',
  componentName: 'FhRadioGroup',
})

const props = defineProps({
  direction: {
    type: String,
    default: 'horizontal',
  },
  disabled: Boolean,
})

const model = defineModel({
  type: [String, Number, Boolean],
  default: '',
})
const emit = defineEmits(['change', 'input'])

const handleChange = (val) => {
  emit('change', val)
}
const handleInput = (val) => {
  emit('input', val)
}
const updateModel = (value) => {
  model.value = value
  handleChange(model.value)
}

provide('radioGroup', {
  model,
  direction: props.direction,
  disabled: props.disabled,
  handleInput,
  handleChange,
  updateModel,
})
</script>
