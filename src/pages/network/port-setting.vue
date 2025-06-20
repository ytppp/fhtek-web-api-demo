<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0751') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form">
        <fh-form-item label="LAN1">
          <fh-select v-model="form.lan1" :options="modeList"> </fh-select>
        </fh-form-item>
        <fh-form-item label="LAN2">
          <fh-select v-model="form.lan2" :options="modeList"> </fh-select>
        </fh-form-item>
        <fh-form-item label="LAN3">
          <fh-select v-model="form.lan3" :options="modeList"> </fh-select>
        </fh-form-item>
        <fh-form-item label="LAN4">
          <fh-select v-model="form.lan4" :options="modeList"> </fh-select>
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

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { format } from '@/util/tool'

enum Mode {
  auto = 'auto/auto',
  h10 = '10M/Half',
  f10 = '10M/Full',
  h100 = '100M/Half',
  f100 = '100M/Full',
  f1000 = '1000M/Full',
}
const { t } = useI18n()
const { cleanData, defaultVal } = useDataClean()
const formRef = ref(null)
const form = reactive({
  lan1: '',
  lan2: '',
  lan3: '',
  lan4: '',
})
const modeList = reactive([
  {
    text: t('trans0487'),
    value: Mode.auto,
  },
  {
    text: '10M/Half Duplex',
    value: Mode.h10,
  },
  {
    text: '10M/Full Duplex',
    value: Mode.f10,
  },
  {
    text: '100M/Half Duplex',
    value: Mode.h100,
  },
  {
    text: '100M/Full Duplex',
    value: Mode.f100,
  },
  {
    text: '1000M/Full Duplex',
    value: Mode.f1000,
  },
])
const save = () => {
  // todo
}
</script>
