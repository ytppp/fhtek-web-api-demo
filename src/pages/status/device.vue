<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0070') }}</h1>
    </div>
    <div class="page__content">
      <div class="display-form">
        <template v-for="(item, index) in basicInfo" :key="index">
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

const { t } = useI18n()
const { cleanData, defaultVal } = useDataClean()

const basicInfo = reactive({
  modelName: {
    label: t('trans0540'),
    value: defaultVal,
  },
  sn: {
    label: t('trans0541'),
    value: defaultVal,
  },
  hwVersion: {
    label: t('trans0542'),
    value: defaultVal,
  },
  swVersion: {
    label: t('trans0543'),
    value: defaultVal,
  },
})

const defaultDataObj = (info) => {
  cleanData(info)
  Object.keys(info).forEach((key) => {
    const val = info[key] || defaultVal
    info[key].value = val
    info[key].show = true
  })
}

onMounted(() => {
  // defaultDataObj(basicInfo)
})
</script>
