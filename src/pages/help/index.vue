<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0947') }}</h1>
    </div>
    <div class="page__content">
      <!-- <fh-markdown-preview :content="HelpEnMd" /> -->
      <v-md-preview :text="HelpEnMd" preview-class="github-markdown-body"></v-md-preview>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useInactiveDetector } from '@/hooks/inactive-detector'
import { getUsb } from '@/http/api'
import HelpZhMd from './help-zh.md?raw'
import HelpEnMd from './help-en.md?raw'

defineOptions({
  name: 'FhHelp',
})

useInactiveDetector(() => {
  getUsb(false, false, false)
})
</script>
