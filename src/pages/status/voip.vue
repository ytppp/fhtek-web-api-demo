<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0732') }}</h1>
    </div>
    <div class="page__content">
      <template v-if="hasVoipWan">
        <div class="display-form">
          <template v-for="(item, index) in registerInfo" :key="index">
            <div class="display-form__item">
              <div class="display-form__label">{{ item.label }}</div>
              <div class="display-form__value">{{ item.value }}</div>
            </div>
          </template>
        </div>
        <div class="display-form">
          <template v-if="isLine1Active">
            <template v-for="(item, index) in line1Info" :key="index">
              <div class="display-form__item">
                <div class="display-form__label">{{ item.label }}</div>
                <div class="display-form__value">{{ item.value }}</div>
              </div>
            </template>
          </template>
          <template v-if="isLine2Active">
            <template v-for="(item, index) in line2Info" :key="index">
              <div class="display-form__item">
                <div class="display-form__label">{{ item.label }}</div>
                <div class="display-form__value">{{ item.value }}</div>
              </div>
            </template>
          </template>
        </div>
      </template>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0604') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { ServiceType } from '@/util/constant'
import { getWan, getVoipBasicSettings } from '@/http/api'

const { t } = useI18n()
const { defaultDataObj, defaultVal, convertBooleanStatus } = useDataClean()
const hasVoipWan = ref(false)
const isLine1Active = ref(false)
const isLine2Active = ref(false)
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
const line1Info = reactive({
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
const line2Info = reactive({
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
const getVoipBasicSettingsData = () => {
  getVoipBasicSettings().then(({ data }) => {
    const thisRegisterInfo = {
      server: data.register.server,
      port: data.register.port,
      secondServer: data.register.secServer,
      secondPort: data.register.secPort,
    }
    const thisLine1Info = {
      name: t('trans0926').format(1),
      tel: data.line1.account,
      registerStatus: data.line1.registrationStatus,
      lineStatus: '-',
    }
    const thisLine2Info = {
      name: t('trans0926').format(2),
      tel: data.line2.account,
      registerStatus: data.line2.registrationStatus,
      lineStatus: '-',
    }
    isLine1Active.value = convertBooleanStatus(data.line1.active) as boolean
    isLine2Active.value = convertBooleanStatus(data.line2.active) as boolean
    defaultDataObj(registerInfo, thisRegisterInfo)
    defaultDataObj(line1Info, thisLine1Info)
    defaultDataObj(line2Info, thisLine2Info)
  })
}
const getWanInfo = () => {
  getWan().then(({ data }) => {
    const { items } = data
    const voiceWan = items.find((item) => {
      return (
        item.serviceType === ServiceType.VOICE || item.serviceType === ServiceType.VOICE_INTERNET
      )
    })
    hasVoipWan.value = !!voiceWan
    if (hasVoipWan.value) {
      getVoipBasicSettingsData()
    }
  })
}
onMounted(() => {
  getWanInfo()
})
</script>
