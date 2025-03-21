export default {
  created(el, binding) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false
      }
      if (binding.value) {
        binding.value(e)
      }
      return false
    }
    el.__vueClickOutside__ = documentHandler
    document.addEventListener('click', documentHandler)
    document.addEventListener('touchstart', documentHandler)
  },
  beforeUnmount(el) {
    document.removeEventListener('click', el.__vueClickOutside__)
    document.removeEventListener('touchstart', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  },
}
