<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0813') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0749') }}</h2>
      </div>
      <div class="display-form">
        <div class="display-form__item">
          <div class="display-form__label">{{ $t('trans0813') }}</div>
          <div class="display-form__value">{{ usbText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUsb } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

const { t } = useI18n()
const { convertBooleanStatus } = useDataClean()
const hasUsbDevice = ref(false)

const usbText = computed(() => {
  return hasUsbDevice.value ? t('trans0652') : t('trans0653')
})

const getUsbInfo = () => {
  getUsb().then(({ data }) => {
    hasUsbDevice.value = convertBooleanStatus(data.has_usb)
  })
}

onMounted(() => {
  getUsbInfo()
})
</script>
