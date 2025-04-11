import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'FhTableColumnRender',
  props: {
    row: Object,
    column: Object,
    index: Number,
    render: Function,
  },
  setup(props, { slots, attrs, emit }) {
    return () => {
      const params = {
        row: props.row,
        column: props.column,
        index: props.index,
      }
      return props.render(h, params)
    }
  },
})
