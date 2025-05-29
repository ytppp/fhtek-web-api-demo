<template>
  <label
    class="checkbox"
    :class="{
      'is-disabled': isDisabled,
    }"
  >
    <span
      class="checkbox__input"
      :class="{
        'is-circle': isCircle,
        'is-checked': isChecked,
        'is-disabled': isDisabled,
      }"
    >
      <span class="checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="checkbox__original"
        type="checkbox"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
      <input
        v-else
        class="checkbox__original"
        type="checkbox"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script>
export default {
  name: 'FhCheckbox',
  inject: {
    form: {
      default: null,
    },
    formItem: {
      default: null,
    },
    checkboxGroup: {
      default: null,
    },
  },
  props: {
    circle: {
      type: Boolean,
      default: false,
    },
    modelValue: {},
    label: {},
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
  },
  data() {
    return {
      selfModel: false,
    }
  },
  computed: {
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'FhCheckboxGroup') {
          parent = parent.$parent
        } else {
          return true
        }
      }
      return false
    },
    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel
      }
    },
    isCircle() {
      return this.isGroup ? this.checkboxGroup.circle || this.circle : this.circle
    },
    isDisabled() {
      return this.isGroup
        ? this.checkboxGroup.disabled || this.disabled || this.form?.disabled.value
        : this.disabled || this.form?.disabled.value
    },
    model: {
      get() {
        return this.isGroup
          ? this.checkboxGroup.model.value
          : this.modelValue === undefined
            ? this.selfModel
            : this.modelValue
      },
      set(val) {
        if (this.isGroup) {
          this.checkboxGroup.handleInput(val)
        } else {
          this.$emit('input', val)
          this.selfModel = val
        }
      },
    },
  },
  emits: ['change', 'input', 'update:modelValue'],
  methods: {
    addToStore() {
      if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
        this.model.push(this.label)
      } else {
        this.model = this.trueLabel || true
      }
    },
    handleChange(ev) {
      let value
      if (ev.target.checked) {
        value = this.trueLabel === undefined ? (this.label ? this.label : true) : this.trueLabel
      } else {
        value = this.falseLabel === undefined ? (this.label ? this.label : false) : this.falseLabel
      }
      this.$nextTick(() => {
        if (this.isGroup) {
          this.checkboxGroup.updateModel(value)
        } else {
          this.$emit('change', value)
          this.$emit('update:modelValue', this.selfModel)
        }
      })
    },
  },
  created() {
    if (this.checked) {
      this.addToStore()
    }
  },
}
</script>

<style lang="less">
.checkbox {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  &.is-disabled {
    .checkbox__inner {
      background-color: #edf2fc;
      border-color: #dcdfe6;
      cursor: not-allowed;
      &::after {
        cursor: not-allowed;
        border-color: #c0c4cc;
      }
    }
    .checkbox__input {
      &.is-checked {
        .checkbox__inner {
          background-color: #edf2fc;
          border-color: #dcdfe6;
          &::after {
            border-color: #c0c4cc;
          }
        }
      }
    }
    .checkbox__label {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
  .checkbox__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    &.is-circle {
      .checkbox__inner {
        border-radius: 50%;
      }
    }
    &.is-checked {
      .checkbox__inner {
        background: @checkbox-checked-background-color;
        border-color: @checkbox-checked-background-color;
        &::after {
          transform: rotate(45deg) scaleY(1);
        }
      }
    }
  }
  .checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid @checkbox-border-color;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background: @checkbox-background-color;
    transition:
      border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
      background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
    &::after {
      box-sizing: content-box;
      content: '';
      border: 1px solid @checkbox-background-color;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      transition: transform 0.15s ease-in 0.05s;
      transform-origin: center;
    }
  }
  .checkbox__original {
    opacity: 0;
    outline: none;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1;
  }
  .checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 14px;
    white-space: normal;
  }
}
</style>
