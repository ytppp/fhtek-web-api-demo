<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0954') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" :model="form">
        <fh-form-item :label="$t('trans0953')">
          <fh-switch v-model="form.enable" />
        </fh-form-item>
        <fh-form-item>
          <fh-alert type="info" :description="$t('trans0955')" show-icon :center="false" />
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWifiMlo, setWifiMlo } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { successTips } from '@/util/tool'

const { convertBooleanStatus } = useDataClean()
const form = ref({
  enable: false,
})

const save = () => {
  setWifiMlo({
    enable: convertBooleanStatus(form.value.enable),
  }).then(() => {
    successTips()
  })
}

const getWifiMloData = () => {
  getWifiMlo().then(({ data }) => {
    form.value.enable = convertBooleanStatus(data.enable) as boolean
  })
}

onMounted(() => {
  getWifiMloData()
})
</script>
