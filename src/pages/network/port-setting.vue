<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0751') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form">
        <fh-form-item :label="SsidText[Lan1]">
          <fh-select
            @change="(val: string) => changePort(val, Lan1)"
            v-model="form[Lan1]"
            :options="modeList"
          >
          </fh-select>
        </fh-form-item>
        <fh-form-item :label="SsidText[Lan2]">
          <fh-select
            @change="(val: string) => changePort(val, Lan2)"
            v-model="form[Lan2]"
            :options="modeList"
          >
          </fh-select>
        </fh-form-item>
        <fh-form-item :label="SsidText[Lan3]">
          <fh-select
            @change="(val: string) => changePort(val, Lan3)"
            v-model="form[Lan3]"
            :options="modeList"
          >
          </fh-select>
        </fh-form-item>
        <fh-form-item :label="SsidText[Lan4]">
          <fh-select
            @change="(val: string) => changePort(val, Lan4)"
            v-model="form[Lan4]"
            :options="modeList"
          >
          </fh-select>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLanSpeed, setLanSpeed } from '@/http/api'
import { Lan1, Lan2, Lan3, Lan4, SsidText } from '@/util/constant'

enum Mode {
  auto = 'auto',
  h10 = '10half',
  f10 = '10full',
  h100 = '100half',
  f100 = '100full',
  f1000 = '1000full',
}
const { t } = useI18n()
const formRef = ref(null)
const form = reactive({
  [Lan1]: '',
  [Lan2]: '',
  [Lan3]: '',
  [Lan4]: '',
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
const changePort = (val: string, type: string) => {
  setLanSpeed({
    ifname: type,
    speed: val,
  })
}
const getLanSpeedData = () => {
  getLanSpeed().then(({ data }) => {
    const { items } = data
    form[Lan1] = items.find((item) => item.ifname === Lan1).speed
    form[Lan2] = items.find((item) => item.ifname === Lan2).speed
    form[Lan3] = items.find((item) => item.ifname === Lan3).speed
    form[Lan4] = items.find((item) => item.ifname === Lan4).speed
  })
}

onMounted(() => {
  getLanSpeedData()
})
</script>
