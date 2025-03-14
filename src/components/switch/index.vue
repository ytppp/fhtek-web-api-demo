<template>
  <div class="switch" @click.prevent="switchValue">
    <input
      class="switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      :value="model"
      checked
      @keydown.enter="switchValue"
    />
    <span class="switch__inner" :class="{ 'is-checked': checked, 'is-disabled': disabled }"></span>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

defineOptions({
  name: 'FhButton',
})

const form = inject('form', {})
const formItem = inject('formItem', {})

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  label: { type: String },
  value: {
    type: [Boolean, String, Number],
    default: false,
  },
  activeValue: {
    type: [Boolean, String, Number],
    default: true,
  },
  inactiveValue: {
    type: [Boolean, String, Number],
    default: false,
  },
  name: String,
  id: String,
})
const model = defineModel({
  type: [String, Number],
  default: '',
})
const emit = defineEmits(['change', 'input'])

const checked = computed(() => {
  return model.value === props.activeValue
})
const switchDisabled = computed(() => {
  return props.disabled || form.disabled
})

const handleChange = () => {
  model.value = checked.value ? props.inactiveValue : props.activeValue
  emit('input', model.value)
  emit('change', model.value)
}
const switchValue = () => {
  !switchDisabled.value && handleChange()
}
</script>
