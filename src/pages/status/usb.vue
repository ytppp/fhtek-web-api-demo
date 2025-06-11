<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0813') }}</h1>
    </div>
    <div class="page__content page__content--padding-small">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0749') }}</h2>
      </div>
      <div class="display-form">
        <template v-for="(item, index) in usb" :key="index">
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

const usb = reactive({
  status: {
    label: t('trans0813'),
    value: defaultVal,
  },
})
</script>
