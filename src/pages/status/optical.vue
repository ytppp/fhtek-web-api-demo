<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0718') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0719') }}</h2>
      </div>
      <div class="display-form">
        <template v-for="(item, index) in linkInfo" :key="index">
          <div class="display-form__item">
            <div class="display-form__label">{{ item.label }}</div>
            <div class="display-form__value">{{ item.value }}</div>
          </div>
        </template>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0720') }}</h2>
      </div>
      <div class="display-form">
        <template v-for="(item, index) in packetsInfo" :key="index">
          <div class="display-form__item">
            <div class="display-form__label">{{ item.label }}</div>
            <div class="display-form__value">{{ item.value }}</div>
          </div>
        </template>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0721') }}</h2>
      </div>
      <div class="display-form">
        <template v-for="(item, index) in opticalInfo" :key="index">
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
import { getPonInfo } from '@/http/api'

const { t } = useI18n()
const { defaultDataObj, defaultVal, convertBooleanStatus } = useDataClean()

const linkInfo = reactive({
  status: {
    label: t('trans0722'),
    value: defaultVal,
  },
  fecEnable: {
    label: t('trans0723'),
    value: defaultVal,
  },
  encrypt: {
    label: t('trans0536'),
    value: defaultVal,
  },
  alarm: {
    label: t('trans0724'),
    value: defaultVal,
  },
})
const packetsInfo = reactive({
  send: {
    label: t('trans0725'),
    value: defaultVal,
  },
  receive: {
    label: t('trans0726'),
    value: defaultVal,
  },
})
const opticalInfo = reactive({
  transmit: {
    label: t('trans0727'),
    value: defaultVal,
  },
  receive: {
    label: t('trans0728'),
    value: defaultVal,
  },
  voltage: {
    label: t('trans0729'),
    value: defaultVal,
  },
  bias: {
    label: t('trans0730'),
    value: defaultVal,
  },
  temperature: {
    label: t('trans0731'),
    value: defaultVal,
  },
})

const getPonInfoData = () => {
  getPonInfo().then(({ data }) => {
    const thisLinkInfo = {
      status: convertBooleanStatus(data.link_status) ? t('trans0654') : t('trans0655'),
      fecEnable: convertBooleanStatus(data.fec_enable) ? t('trans0103') : t('trans0054'),
      encrypt: convertBooleanStatus(data.encryption_mode) ? t('trans0103') : t('trans0054'),
      alarm: convertBooleanStatus(data.alarm_info) ? t('trans0412') : t('trans0925'),
    }
    const thisPacketsInfo = {
      send: data.packets_sent,
      receive: data.packets_received,
    }
    const thisOpticalInfo = {
      transmit: `${data.tx_light_power}dBm`,
      receive: `${data.rx_light_power}dBm`,
      voltage: `${data.voltage}mV`,
      bias: `${data.current}mA`,
      temperature: `${data.temperature}℃`,
    }
    defaultDataObj(linkInfo, thisLinkInfo)
    defaultDataObj(packetsInfo, thisPacketsInfo)
    defaultDataObj(opticalInfo, thisOpticalInfo)
  })
}

onMounted(() => {
  getPonInfoData()
})
</script>
