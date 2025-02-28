<script>
// setup
// import { ref, watch, inject } from 'vue'

// const props = defineProps({
//   isAutoWidth: Boolean,
//   updateAll: Boolean,
// })

// const computedWidth = ref(0)
// const form = inject('form')
// const formItem = inject('formItem')

// watch(computedWidth, (val, oldVal) => {
//   if (props.updateAll) {
//     form.value.registerLabelWidth(val, oldVal)
//     formItem.value.updateComputedLabelWidth(val)
//   }
// })

// return

import { h } from 'vue'

export default {
  name: 'LabelWrap',
  inheritAttrs: false,
  inject: ['form', 'formItem'],
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean,
    labelPosition: String,
  },
  data() {
    return {
      computedWidth: 0,
    }
  },
  watch: {
    computedWidth(val, oldVal) {
      if (this.updateAll) {
        this.form.exposed.registerLabelWidth(val, oldVal)
        this.formItem.exposed.updateComputedLabelWidth(val)
      }
    },
  },
  methods: {
    getLabelWidth() {
      if (this.$el && this.$el.firstElementChild) {
        const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width
        return Math.ceil(parseFloat(computedWidth))
      } else {
        return 0
      }
    },
    updateLabelWidth(action = 'update') {
      if (this.$slots.default() && this.isAutoWidth && this.$el.firstElementChild) {
        if (action === 'update') {
          this.computedWidth = this.getLabelWidth()
        } else if (action === 'remove') {
          this.form.exposed.deregisterLabelWidth(this.computedWidth)
        }
      }
    },
  },
  render() {
    const slots = this.$slots.default()
    if (!slots) return null
    if (this.isAutoWidth) {
      const autoLabelWidth = this.form.exposed.autoLabelWidth.value
      const style = {}
      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const margin = parseInt(autoLabelWidth, 10) - this.computedWidth
        if (margin) {
          if (this.labelPosition === 'right') {
            style.marginLeft = margin + 'px'
          }
          if (this.labelPosition === 'right') {
            style.marginRight = margin + 'px'
          }
        }
      }
      console.log(style)
      return h(
        'div',
        {
          class: 'form-item__label-wrap',
          style,
        },
        slots,
      )
    } else {
      return slots[0]
    }
  },
  mounted() {
    this.updateLabelWidth('update')
  },
  updated() {
    this.updateLabelWidth('update')
  },
  beforeDestroy() {
    this.updateLabelWidth('remove')
  },
}
</script>
