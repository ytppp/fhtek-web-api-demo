import ToastComm from './index.vue'
import { h, render } from 'vue'

const toast = (text = '', duration = 3000, type = 'error', parentEl = '.layout') => {
  const instance = h(ToastComm, {
    text,
    duration,
    type,
  })

  const pEl = document.querySelector(parentEl)
  pEl.appendChild(instance.$el)
  const rect = pEl.getBoundingClientRect()
  const left = rect.left + rect.width / 2
  instance.$el.style.left = `${left}px`
}

export default toast
