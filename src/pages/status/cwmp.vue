<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0249') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0741') }}</h2>
      </div>
      <fh-descriptions :data="interaction"></fh-descriptions>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0742') }}</h2>
      </div>
      <fh-descriptions :data="business"></fh-descriptions>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { format } from '@/util/tool'

const { t } = useI18n()
const { cleanData, defaultVal } = useDataClean()

const interaction = reactive({
  inform: {
    label: t('trans0743'),
    value: defaultVal,
  },
  request: {
    label: t('trans0734'),
    value: defaultVal,
  },
})

const business = reactive({
  status: {
    label: t('trans0744'),
    value: defaultVal,
  },
})
</script>
