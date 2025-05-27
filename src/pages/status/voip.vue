<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0732') }}</h1>
    </div>
    <div class="page__content">
      <div class="display-form">
        <template v-for="(item, index) in registerInfo" :key="index">
          <div class="display-form__item">
            <div class="display-form__label">{{ item.label }}</div>
            <div class="display-form__value">{{ item.value }}</div>
          </div>
        </template>
      </div>
      <div class="display-form">
        <template v-for="(item, index) in lineInfo" :key="index">
          <div class="display-form__item">
            <div class="display-form__label">{{ item.label }}</div>
            <div class="display-form__value">{{ item.value }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { format } from '@/util/tool'

const { t } = useI18n()
const { cleanData, defaultVal } = useDataClean()

const registerInfo = reactive({
  server: {
    label: t('trans0733'),
    value: defaultVal,
  },
  port: {
    label: t('trans0734'),
    value: defaultVal,
  },
  secondServer: {
    label: t('trans0735'),
    value: defaultVal,
  },
  secondPort: {
    label: t('trans0736'),
    value: defaultVal,
  },
})

const lineInfo = reactive({
  name: {
    label: t('trans0737'),
    value: defaultVal,
  },
  tel: {
    label: t('trans0738'),
    value: defaultVal,
  },
  registerStatus: {
    label: t('trans0739'),
    value: defaultVal,
  },
  lineStatus: {
    label: t('trans0740'),
    value: defaultVal,
  },
})
</script>
