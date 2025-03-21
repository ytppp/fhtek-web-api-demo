<template>
  <div class="loading">
    <div class="loading__spinner">
      <svg viewBox="25 25 50 50" class="circular">
        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
      </svg>
    </div>
    <div v-if="title" class="loading__title">{{ title }}</div>
    <div v-if="tip" class="loading__tip">{{ tip }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FhLoading',
  props: {
    title: {
      type: String,
      default: '',
    },
    tip: {
      type: String,
      default: '',
    },
  },
})
</script>
