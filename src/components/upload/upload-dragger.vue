<template>
  <div
    class="dragger"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
  >
    <div class="dragger__wrap" v-if="isDragOver">
      {{ $t('trans0207') }}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FhUploadDragger',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDragOver: false,
    }
  },
  emits: ['file'],
  methods: {
    handleDragEnter() {
      this.isDragOver = true
    },
    handleDragLeave() {
      this.isDragOver = false
    },
    handleDrop(e) {
      e.preventDefault()
      this.isDragOver = false
      if (this.disabled) {
        return
      }
      this.$parent.initUploadStatus()
      const { files } = e.dataTransfer
      this.$emit('file', files)
    },
  },
}
</script>
