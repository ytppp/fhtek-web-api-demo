<template>
  <transition name="alert-fade">
    <div
      class="alert"
      :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
      v-show="visible"
    >
      <fh-icon class="alert__icon" :class="[isBigIcon]" :name="iconClass" v-if="showIcon"></fh-icon>
      <div class="alert__content">
        <span
          class="alert__title"
          :class="[isBoldTitle]"
          v-if="title || $slots.title"
          :style="`${$slots.default || description ? 'margin-bottom: 5px;' : ''}`"
        >
          <slot name="title">{{ title }}</slot>
        </span>
        <div class="alert__description" v-if="$slots.default && !description">
          <slot></slot>
        </div>
        <p class="alert__description" v-if="!$slots.default && description">
          {{ description }}
        </p>
        <template v-if="closable">
          <i class="alert__closebtn is-customed" @click="close()" v-if="closeText">
            {{ closeText }}
          </i>
          <fh-icon class="alert__closebtn" @click="close()" name="icon-circle-close" v-else>
          </fh-icon>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
const TYPE_CLASSES_MAP = {
  success: 'icon-success',
  warning: 'icon-warning',
  error: 'icon-error',
}
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'info',
    },
    closable: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: true,
    },
    closeText: {
      type: String,
      default: '',
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    effect: {
      type: String,
      default: 'light',
      validator: function (value) {
        return ['light', 'dark'].indexOf(value) !== -1
      },
    },
  },
  data() {
    return {
      visible: true,
    }
  },
  methods: {
    close() {
      this.visible = false
      this.$emit('close')
    },
  },

  computed: {
    typeClass() {
      return `alert--${this.type}`
    },
    iconClass() {
      return TYPE_CLASSES_MAP[this.type] || 'icon-info'
    },
    isBigIcon() {
      return this.description || this.$slots.default ? 'is-big' : ''
    },
    isBoldTitle() {
      return this.description || this.$slots.default ? 'is-bold' : ''
    },
  },
}
</script>
