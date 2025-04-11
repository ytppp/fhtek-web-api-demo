<template>
  <div class="popover" ref="popover">
    <div ref="triggerWrapper" class="popover__trigger">
      <slot></slot>
    </div>
    <div
      ref="popoverWrapper"
      class="popover__wrap"
      :class="`position__wrap-${position}`"
      v-if="visible"
    >
      <div ref="popoverTriangle" class="popover__triangle"></div>
      <template v-if="title || $slots.title">
        <div class="popover__title" v-if="title">{{ title }}</div>
        <slot name="title" v-else></slot>
      </template>
      <template v-if="content || $slots.content">
        <div class="popover__content" v-if="content">{{ content }}</div>
        <slot name="content" v-else></slot>
      </template>
    </div>
  </div>
</template>

<script>
const Positions = {
  topStart: 'top-start',
  top: 'top',
  topEnd: 'top-end',
  bottomStart: 'bottom-start',
  bottom: 'bottom',
  bottomEnd: 'bottom-end',
  left: 'left',
  right: 'right',
}
const Trigger = {
  click: 'click',
  hover: 'hover',
}
export default {
  name: 'FhPopover',
  props: {
    position: {
      type: String,
      default: Positions.top,
      validator(value) {
        return [Positions.top, Positions.bottom].includes(value)
      },
    },
    trigger: {
      type: String,
      default: Trigger.hover,
      validator(value) {
        return [Trigger.click, Trigger.hover].includes(value)
      },
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    positionContent() {
      const { triggerWrapper, popoverWrapper } = this.$refs
      document.body.appendChild(popoverWrapper)
      const { width, height, top, left } = triggerWrapper.getBoundingClientRect()
      const { width: popoverWrapperWidth, height: popoverWrapperHeight } =
        popoverWrapper.getBoundingClientRect()
      const positions = {
        [Positions.top]: {
          top: parseInt(window.scrollY + top - popoverWrapperHeight),
          left: parseInt(window.scrollX + left - (popoverWrapperWidth - width) / 2),
        },
        [Positions.bottom]: {
          top: parseInt(window.scrollY + top + height),
          left: parseInt(window.scrollX + left - (popoverWrapperWidth - width) / 2),
        },
        // [Positions.left]: {
        //   top: top + (height - popoverHeight) / 2 + window.scrollY,
        //   left: window.scrollX - left,
        // },
        // [Positions.right]: {
        //   top: top + (height - popoverHeight) / 2 + window.scrollY,
        //   left: left + width + window.scrollX,
        // },
      }
      popoverWrapper.style.left = positions[this.position].left + 'px'
      popoverWrapper.style.top = positions[this.position].top + 'px'
    },
    handleClick(event) {
      if (this.$refs.triggerWrapper.contains(event.target)) {
        if (this.visible === true) {
          this.onClose()
        } else {
          this.onShow()
        }
      }
    },
    onShow() {
      this.visible = true
      this.$nextTick(() => {
        this.positionContent()
        document.addEventListener('click', this.eventHandler)
      })
    },
    onClose() {
      this.visible = false
      document.removeEventListener('click', this.eventHandler)
    },
    eventHandler(e) {
      if (
        this.$refs.popover &&
        (this.$refs.popover === e.target || this.$refs.popover.contains(e.target))
      ) {
        return
      }
      if (
        this.$refs.popoverWrapper &&
        (this.$refs.popoverWrapper === e.target || this.$refs.popoverWrapper.contains(e.target))
      ) {
        return
      }
      this.onClose()
    },
  },
  mounted() {
    if (this.trigger === Trigger.click) {
      this.$refs.popover.addEventListener('click', this.handleClick)
    } else {
      this.$refs.popover.addEventListener('mouseenter', this.onShow)
      this.$refs.popover.addEventListener('mouseleave', this.onClose)
    }
  },
  beforeUnmount() {
    if (this.trigger === Trigger.click) {
      this.$refs.popover.removeEventListener('click', this.handleClick)
    } else {
      this.$refs.popover.removeEventListener('mouseenter', this.onShow)
      this.$refs.popover.removeEventListener('mouseleave', this.onClose)
    }
  },
}
</script>

<style lang="less">
.popover {
  position: relative;
  display: inline-block;
}
.popover__trigger {
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.popover__wrap {
  position: absolute;
  z-index: 2000;
  padding: 0 10px;
  min-width: 100px;
  background-color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  font-size: 12px;
  color: #fff;
  padding: 10px;
  &.position__wrap-top {
    .popover__triangle {
      bottom: -8px;
      top: initial;
    }
  }
  &.position__wrap-bottom {
    .popover__triangle {
      top: -8px;
      bottom: initial;
      transform: rotate(-180deg);
    }
  }
}
.popover__triangle {
  width: 16px;
  height: 8px;
  position: absolute;
  left: calc(50% - 8px);
  &::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    overflow: hidden;
    border: 8px solid #333;
    border-bottom: none;
    border-left-color: transparent;
    border-right-color: transparent;
  }
}
.popover__title {
  line-height: 1;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
.popover__content {
  padding-top: 10px;
  font-weight: normal;
  white-space: normal;
}
</style>
