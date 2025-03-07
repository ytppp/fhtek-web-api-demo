<template>
  <div
    class="form-item"
    :class="{
      'is-success': success,
      'is-error': error,
    }"
  >
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="labelWidthCom === 'auto'"
      :label-position="labelPositionCom"
    >
      <label
        class="form-item__label"
        :title="label"
        :for="labelFor"
        :class="`form-item__label--${labelPositionCom}`"
        :style="labelStyle"
        v-if="label || slots.label"
      >
        <slot name="label">{{ label }}</slot>
      </label>
    </label-wrap>
    <div class="form-item__content" :style="contentStyle">
      <slot></slot>
    </div>
    <transition name="el-zoom-in-top">
      <div v-if="error" class="form-item__error">{{ validateMessage }}</div>
    </transition>
    <div class="form-item__extra" :style="contentStyle" v-if="slots.extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, provide, inject, useSlots } from 'vue'
import LabelWrap from './label-wrap.vue'

defineOptions({
  name: 'FhButton',
  componentName: 'FormItem',
})

const props = defineProps({
  label: {
    type: String,
  },
  prop: {
    type: String,
  },
  for: {
    type: String,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  labelPosition: {
    type: String,
    validator: function (value) {
      return ['top', 'left', 'right'].indexOf(value) !== -1
    },
  },
  labelWidth: {
    type: String,
  },
})
const slots = useSlots()
const validateMessage = ref('')
const computedLabelWidth = ref('')
const validators = ref([])
const result = ref(null) // null表示没有进行校验，true通过，false未通过
const parent = inject('form')
const instance = getCurrentInstance()
provide('formItem', instance)

const labelWidthCom = computed(() => {
  return props.labelWidth || parent.props.labelWidth
})
const labelPositionCom = computed(() => {
  return props.labelPosition || parent.props.labelPosition
})
const labelStyle = computed(() => {
  const ret = {}
  if (labelPositionCom.value === 'top') return ret
  if (labelWidthCom.value) {
    ret.width = labelWidthCom.value
  }
  return ret
})
const contentStyle = computed(() => {
  const ret = {}
  if (labelPositionCom.value === 'top') return ret
  if (!props.label && !props.labelWidth) return ret
  if (labelWidthCom.value === 'auto') {
    // don't konw how to do
    if (props.labelWidth === 'auto') {
      ret.marginLeft = computedLabelWidth.value
    } else if (parent.props.labelWidth === 'auto') {
      ret.marginLeft = parent.exposed.autoLabelWidth.value
    }
  } else {
    ret.marginLeft = labelWidthCom.value
  }
  return ret
})
const labelFor = computed(() => {
  return props.for || props.prop
})
const error = computed(() => {
  return result.value !== null && result.value === false
})
const success = computed(() => {
  return result.value === true
})

const updateComputedLabelWidth = (width) => {
  computedLabelWidth.value = width ? `${width}px` : ''
}
const getValueByPath = (obj, path) => {
  let tempObj = obj
  // remove start dot in path
  path = path.replace(/^\./, '')
  // replace .=>[]
  path = path.replace(/\.(\w+)(?=\.|\[|$)/g, '[$1]')
  // replace start key
  path = path.replace(/^(\w+)/, '[$1]')
  // sometime path is empty when init, so match will get null
  let keyArr = path.match(/(?:\[)(.*?)(?:\])/g) || []
  // remove [|]|"|' in key
  keyArr = keyArr.map((k) => k.replace(/(\[|\]|"|')/g, ''))
  let i = 0
  for (let len = keyArr.length; i < len - 1; i += 1) {
    if (!tempObj) break
    const key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    }
  }
  return tempObj ? tempObj[keyArr[i]] : null
}
const validate = () => {
  if (props.prop) {
    const rules = parent.props.rules || {}
    const prop = props.prop || ''
    const this_validators = rules[prop] || []
    validators.value = this_validators.concat(props.rules)
    const value = getValueByPath(parent.props.model, props.prop)
    let this_result = true
    // 检验
    if (validators.value && validators.value.length) {
      for (let j = 0; j < validators.value.length; j++) {
        const validator = validators.value[j]
        if (!validator.rule(value)) {
          this_result = false
          validateMessage.value = validator.message
          break
        }
      }
    }
    result.value = this_result
    return this_result
  }
  return true
}
const extraValidate = (validator, msg, ...arg) => {
  let this_result = true
  if (!validator(...arg)) {
    this_result = false
    validateMessage.value = msg
  }
  result.value = this_result
  return result
}
const clearValidate = () => {
  result.value = null
}
defineExpose({
  validate,
  clearValidate,
  extraValidate,
  updateComputedLabelWidth,
})
</script>
