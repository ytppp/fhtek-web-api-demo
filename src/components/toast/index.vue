<template>
  <transition name="toast">
    <teleport to="body">
      <div class="toast" :class="`toast--${type}`" v-show="visible" id="toastEl">
        <span>{{ text }}</span>
      </div>
    </teleport>
  </transition>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'

export default defineComponent({
  name: 'FhToast',
  props: {
    duration: {
      type: Number,
      default: 3000,
    },
    text: {
      type: String,
      default: '',
    },
    type: {
      default: String,
      default: 'success',
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  emits: ['hide'],
  methods: {
    startTimer() {
      this.timer = setTimeout(() => {
        this.visible = false
        this.$el.addEventListener('transitionend', this.hide)
      }, this.duration)
    },
    hide() {
      clearTimeout(this.timer)
      this.timer = null
      this.$emit('hide')
    },
  },
  mounted() {
    this.visible = true
    this.startTimer()
  },
})
</script>
