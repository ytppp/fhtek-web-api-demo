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
    value: {},
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
          : this.value !== undefined
            ? this.value
            : this.selfModel
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
  emits: ['change', 'input'],
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
