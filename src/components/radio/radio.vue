<template>
  <label
    class="radio"
    :class="{
      'is-selected': model === label,
      'is-disabled': isDisabled,
    }"
  >
    <span
      class="radio__input"
      :class="{
        'is-selected': model === label,
        'is-disabled': isDisabled,
      }"
    >
      <span class="radio__inner"></span>
      <input
        ref="radio"
        class="radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
        autocomplete="off"
      />
    </span>
    <span class="radio__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script>
export default {
  name: 'FhRadio',
  inject: {
    form: {
      default: '',
    },
    formItem: {
      default: '',
    },
    radioGroup: {
      default: '',
    },
  },
  props: {
    value: {},
    label: {},
    disabled: {
      type: Boolean,
      default: false,
    },
    name: String,
  },
  computed: {
    isDisabled() {
      return this.isGroup
        ? this.radioGroup.disabled || this.disabled || this.form?.disabled.value
        : this.disabled || this.form?.disabled.value
    },
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName !== 'FhRadioGroup') {
          parent = parent.$parent
        } else {
          return true
        }
      }
      return false
    },
    model: {
      get() {
        return this.isGroup ? this.radioGroup.model.value : this.value
      },
      set(val) {
        if (this.isGroup) {
          this.radioGroup.handleInput(val)
        } else {
          this.$emit('input', val)
        }
        this.$refs.radio && (this.$refs.radio.checked = this.model === this.label)
      },
    },
  },
  emits: ['change', 'input'],
  methods: {
    handleChange() {
      this.$nextTick(() => {
        const value = this.label
        if (this.isGroup) {
          this.radioGroup.updateModel(value)
        } else {
          this.$emit('change', value)
        }
      })
    },
  },
}
</script>
