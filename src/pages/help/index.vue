<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0947') }}</h1>
    </div>
    <div class="page__content">
      <fh-markdown-preview :content="HelpZhMd" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import HelpZhMd from './help-zh.md?raw'

defineOptions({
  name: 'FhHelp',
})
</script>
