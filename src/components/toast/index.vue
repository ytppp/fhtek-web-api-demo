<template>
  <transition name="toast">
    <div class="toast" :class="`toast--${type}`" v-show="visible">
      <span>{{ text }}</span>
    </div>
  </transition>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FhToast',
  props: {
    duration: {
      type: Number,
      default: 3000
    },
    text: {
      type: String,
      default: ''
    },
    type: {
      default: String,
      default: 'success'
    }
  },
  data() {
    return {
      visible: false,
      duration: 3000,
      text: '',
      type: 'success',
      timer: null,
    }
  },
  methods: {
    startTimer() {
      this.timer = setTimeout(() => {
        this.visible = false
        this.$el.addEventListener('transitionend', this.close)
      }, this.duration)
    },
    close() {
      this.timer = null
      this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
    },
  },
  mounted() {
    this.startTimer()
  },
})
</script>
