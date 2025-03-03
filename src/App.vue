<template>
  <!-- <RouterView /> -->
  <fh-button @click="toggleVisible">{{ $t('trans0002') }}</fh-button>
  {{ visible }}
  <fh-modal v-model="visible" :title="$t('trans0165')">
    <template #body>
      <div>123</div>
    </template>
    <template #footer>
      <div>modal footer</div>
    </template>
  </fh-modal>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const toggleVisible = () => {
  visible.value = !visible.value
}
</script>
