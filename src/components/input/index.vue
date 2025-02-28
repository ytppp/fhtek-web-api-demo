<template>
  <div
    :class="[
      type === 'textarea' ? 'textarea' : 'input',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'input-group': slots.prepend || slots.append,
        'input-group--append': slots.append,
        'input-group--prepend': slots.prepend,
        'input--prefix': slots.prefix || prefixIcon,
        'input--suffix': slots.suffix || suffixIcon || clearable || showPassword,
      },
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="input-group__prepend" v-if="slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-bind="attrs"
        class="input__inner"
        :value="model"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :name="name"
        :aria-label="inputDisabled"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      />
      <!-- 前置内容 -->
      <span class="input__prefix" v-if="slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="input__icon" v-if="prefixIcon" :class="prefixIcon"> </i>
      </span>
      <!-- 后置内容 -->
      <span class="input__suffix" v-if="getSuffixVisible()">
        <span class="input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="input__icon" v-if="suffixIcon" :class="suffixIcon"> </i>
          </template>
          <fh-icon
            v-if="showClear"
            class="input__icon input__clear"
            name="icon-circle-close"
            @mousedown.prevent
            @click="clear"
          ></fh-icon>
          <fh-icon
            v-if="showPwdVisible"
            class="input__icon input__clear"
            :name="passwordVisible ? 'icon-eye' : 'icon-eye-close'"
            @click="handlePasswordVisible"
          ></fh-icon>
          <span v-if="isWordLimitVisible" class="input__count">
            <span class="input__count-inner"> {{ textLength }}/{{ upperLimit }} </span>
          </span>
        </span>
      </span>
      <!-- 后置元素 -->
      <div class="input-group__append" v-if="slots.append">
        <slot name="append"></slot>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, useSlots, useAttrs, inject } from 'vue'

defineOptions({
  name: 'FhButton',
  // inheritAttrs: false,
})
const props = defineProps({
  prefixIcon: {
    type: String,
    default: '',
  },
  suffixIcon: {
    type: String,
    default: '',
  },
  tabindex: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'text',
  },
  autocomplete: {
    type: String,
    default: 'new-password',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  showWordLimit: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()
const attrs = useAttrs()
const form = inject('form', {})
const formItem = inject('formItem', {})
const model = defineModel({
  type: [String, Number],
  default: '',
})
const hovering = ref(false)
const focused = ref(false)
const isComposing = ref(false)
const passwordVisible = ref(false)
const emit = defineEmits(['focus', 'blur', 'change', 'input', 'clear'])

const inputDisabled = computed(() => {
  return props.disabled || form.props.disabled
})

const isWordLimitVisible = computed(() => {
  return (
    props.showWordLimit &&
    attrs.maxlength &&
    (props.type === 'text' || props.type === 'textarea') &&
    !inputDisabled.value &&
    !props.readonly &&
    !props.showPassword
  )
})
const inputExceed = computed(() => {
  return isWordLimitVisible.value && textLength.value > upperLimit.value
})
const showClear = computed(() => {
  return (
    props.clearable && !inputDisabled.value && !props.readonly && (focused.value || hovering.value)
  )
})
const showPwdVisible = computed(() => {
  return props.showPassword && !inputDisabled.value && !props.readonly && focused.value
})
const upperLimit = computed(() => {
  return attrs.maxlength
})
const textLength = computed(() => {
  if (typeof model.value === 'number') {
    return String(model.value).length
  }
  return (model.value || '').length
})

const handleCompositionStart = () => {
  isComposing.value = true
}
const handleCompositionUpdate = () => {
  isComposing.value = true
}
const handleCompositionEnd = (event) => {
  if (isComposing.value) {
    isComposing.value = false
    handleInput(event)
  }
}
const handleInput = (event) => {
  if (isComposing.value) return
  model.value = event.target.value
  emit('input', model.value)
}
const handleFocus = (event) => {
  focused.value = true
  emit('focus', event)
  formItem.exposed.clearValidate()
}
const handleBlur = (event) => {
  focused.value = false
  emit('blur', event)
  formItem.exposed.validate()
}
const handleChange = (event) => {
  model.value = event.target.value
  emit('change', model.value)
  formItem.exposed.clearValidate()
}
const clear = (event) => {
  model.value = ''
  emit('clear', event)
}
const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
}
const getSuffixVisible = () => {
  return (
    slots.suffix ||
    props.suffixIcon ||
    showClear.value ||
    props.showPassword ||
    isWordLimitVisible.value
  )
}
</script>

<style lang="less">
.input {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: @form-item-max-width;
  position: relative;
  .input__inner {
    font-size: @input-font-size;
    padding: 0 10px;
    height: @input-height;
    line-height: 1;
    width: 100%;
    outline: 0;
    border-radius: @input-border-radius;
    border: @input-border;
    box-sizing: border-box;
    -webkit-appearance: none;
    background-color: @input-background-color;
    display: inline-block;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &::-ms-reveal {
      display: none;
    }
    &::-ms-clear {
      display: none;
      width: 0;
      height: 0;
    }
    &::placeholder {
      color: @input-placeholder-color;
    }
    &:hover {
      border-color: @input-hover-border;
    }
    &:focus {
      outline: none;
      // border-color: @input-focus-border;
    }
  }
  .input__clear {
    color: @input-icon-color;
    font-size: @input-font-size;
    cursor: pointer;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover {
      color: @input-clear-hover-color;
    }
  }
  .input__count {
    height: 100%;
    display: inline-flex;
    align-items: center;
    color: @color-info;
    font-size: 12px;
    .input__count-inner {
      background: @color-white;
      line-height: initial;
      display: inline-block;
      padding: 0 5px;
    }
  }
  .input__suffix {
    position: absolute;
    height: 100%;
    right: 5px;
    top: 0;
    text-align: center;
    color: @input-icon-color;
    transition: all 0.3s;
    pointer-events: none;
  }
  .input__suffix-inner {
    pointer-events: all;
  }
  .input__prefix {
    position: absolute;
    height: 100%;
    left: 5px;
    top: 0;
    text-align: center;
    color: @input-icon-color;
    transition: all 0.3s;
  }
  .input__icon {
    height: 100%;
    width: 25px;
    text-align: center;
    transition: all 0.3s;
    line-height: @input-height;
    &:after {
      content: '';
      height: 100%;
      width: 0;
      display: inline-block;
      vertical-align: middle;
    }
  }
  &.is-active {
    .input__inner {
      outline: none;
      border-color: @color-primary;
    }
  }
  &.is-disabled {
    .input__inner {
      background-color: @input-disabled-fill;
      border-color: @input-disabled-border;
      color: @input-disabled-color;
      cursor: not-allowed;

      &::placeholder {
        color: @input-disabled-placeholder-color;
      }
    }

    .input__icon {
      cursor: not-allowed;
    }
  }
  &.is-exceed {
    .input__inner {
      border-color: @color-danger;
    }
    .input__suffix {
      .input__count {
        color: @color-danger;
      }
    }
  }
  &.input--prefix {
    .input__inner {
      padding-left: 30px;
    }
  }
  &.input--suffix {
    .input__inner {
      padding-right: 30px;
    }
  }
}
</style>
