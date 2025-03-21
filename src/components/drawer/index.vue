<template>
  <transition name="drawer-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div class="drawer__wrapper" tabindex="-1" v-show="visible">
      <div
        class="drawer__container"
        :class="visible && 'drawer__open'"
        @click.self="handleWrapperClick"
        role="document"
        tabindex="-1"
      >
        <div
          aria-modal="true"
          aria-labelledby="drawer__title"
          :aria-label="title"
          class="drawer"
          :class="[direction, customClass]"
          :style="isHorizontal ? `width: ${drawerSize}` : `height: ${drawerSize}`"
          role="dialog"
          tabindex="-1"
        >
          <header class="drawer__header" id="el-drawer__title" v-if="withHeader">
            <slot name="title">
              <span role="heading" :title="title">{{ title }}</span>
            </slot>
            <fh-icon
              :aria-label="`close ${title || 'drawer'}`"
              class="drawer__close"
              name="icon-close"
              v-if="showClose"
              @click="closeDrawer"
            ></fh-icon>
          </header>
          <section class="drawer__body">
            <slot></slot>
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    beforeClose: {
      type: Function,
    },
    customClass: {
      type: String,
      default: '',
    },
    direction: {
      type: String,
      default: 'ltr',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1
      },
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    size: {
      type: [Number, String],
      default: '30%',
    },
    title: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
    },
    wrapperClosable: {
      type: Boolean,
      default: true,
    },
    withHeader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      prevActiveElement: null,
      overflow: '',
    }
  },
  computed: {
    isHorizontal() {
      return this.direction === 'rtl' || this.direction === 'ltr'
    },
    drawerSize() {
      return typeof this.size === 'number' ? `${this.size}px` : this.size
    },
    parentNode() {
      if (this.appendToBody) {
        return document.body
      } else {
        return this.$el.parentNode
      }
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.$emit('open')
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
        this.prevActiveElement = document.activeElement
        // desktop prevent scroll
        this.overflow = this.parentNode ? this.parentNode.style.overflow : ''
        this.parentNode.style.overflow = 'hidden'
        // mobile prevent scroll
        this.parentNode && this.parentNode.addEventListener('touchmove', this.preventDefault, false)
      } else {
        this.$nextTick(() => {
          if (this.prevActiveElement) {
            this.prevActiveElement.focus()
          }
          this.parentNode.style.overflow = this.overflow
          this.parentNode &&
            this.parentNode.removeEventListener('touchmove', this.preventDefault, false)
        })
      }
    },
  },
  methods: {
    preventDefault(e) {
      e.preventDefault()
    },
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    },
    handleWrapperClick() {
      if (this.wrapperClosable) {
        this.closeDrawer()
      }
    },
    closeDrawer() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
  },
  mounted() {
    if (this.visible) {
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },
  unmounted() {
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
}
</script>
