<template>
  <transition name="checkbox">
    <div class="checkbox-group" :class="`is-${direction}`">
      <slot></slot>
    </div>
  </transition>
</template>

<script setup>
import { provide } from 'vue'

defineOptions({
  name: 'FhCheckboxGroup',
  componentName: 'FhCheckboxGroup',
})

const props = defineProps({
  rect: {
    type: Boolean,
    default: true,
  },
  direction: {
    type: String,
    default: 'horizontal',
  },
  disabled: Boolean,
})

const model = defineModel({
  type: Array,
  default: () => [],
})

const emit = defineEmits(['change', 'input'])

const handleChange = (val) => {
  emit('change', val)
}
const handleInput = (val) => {
  emit('input', val)
}
const updateModel = (value) => {
  if (model.value.includes(value)) {
    model.value = model.value.filter((v) => v !== value)
  } else {
    model.value.push(value)
  }
  handleChange(model.value)
}

provide('checkboxGroup', {
  model,
  rect: props.rect,
  direction: props.direction,
  disabled: props.disabled,
  updateModel,
  handleChange,
  handleInput,
})
</script>

<style lang="less">
.checkbox-group {
  display: flex;
  &.is-vertical {
    flex-direction: column;
    .checkbox {
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  &.is-horizontal {
    flex-wrap: wrap;
    .checkbox {
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
</style>
