<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0456') }}</h1>
    </div>
    <div class="page__content">
      <fh-form :model="form" :rules="rules" class="form">
        <fh-form-item :label="$t('trans0415')" prop="ip">
          <fh-input v-model="form.ip" clearable>
            <template #prefix>
              <fh-icon name="icon-user" class="input__icon"></fh-icon>
            </template>
          </fh-input>
          <template #extra>
            {{ $t('trans0644') }}
          </template>
        </fh-form-item>
        <fh-form-item :label="$t('trans0460')" label-position="left">
          <fh-switch
            v-model="form.enable"
            :active-value="EnableStatus.yes"
            :inactive-value="EnableStatus.no"
          ></fh-switch>
        </fh-form-item>
        <template v-if="isEnable">
          <fh-form-item prop="ip_start" :label="$t('trans0151')" ref="ip_start">
            <fh-input v-model="form.ip_start" @blur="ipStartChange"></fh-input>
          </fh-form-item>
          <fh-form-item prop="ip_end" :label="$t('trans0152')" ref="ip_end">
            <fh-input v-model="form.ip_end"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0461')">
            <fh-select v-model="form.lease" :options="leases"></fh-select>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { getIpBefore, getIpAfter } from '@/util/tool'

const { t } = useI18n()
const Leases = {
  oneHour: 1,
  oneDay: 24,
  oneWeek: 24 * 7,
}
const leases = reactive([
  {
    value: Leases.oneHour,
    text: t('trans0462', 1, { val: 1 }),
  },
  {
    value: Leases.oneDay,
    text: t('trans0463', 1, { val: 1 }),
  },
  {
    value: Leases.oneWeek,
    text: t('trans0464', 1, { val: 1 }),
  },
])
const EnableStatus = reactive({
  yes: 1,
  no: 0,
})
const form = reactive({
  enable: EnableStatus.yes,
  ip: '',
  mask: '',
  ip_start: '',
  ip_end: '',
  lease: Leases.oneHour,
})
const labelWidth = ref('110px')
const rules = reactive({
  ip: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
  ],
  ip_start: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
  ],
  ip_end: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
  ],
})
const ipOffset = computed(() => {
  return Number(getIpAfter(form.ip_end)) - Number(getIpAfter(form.ip_start)) + 1
})
const isEnable = computed(() => {
  return form.enable === EnableStatus.yes
})

async function fetchData() {
  // try {
  //   const response = await axios.get('/action/GetLanIp')
  //   console.log(response.data.data)
  //   const { enable, ip, mask, ip_start, ip_offset, lease } = response.data.data
  //   Object.assign(form, {
  //     enable,
  //     ip,
  //     mask,
  //     ip_start,
  //     ip_end: `${getIpBefore(ip_start)}${Number(getIpAfter(ip_start)) + Number(ip_offset) - 1}`,
  //     lease: Number(lease),
  //   })
  // } catch (error) {
  //   console.log('获取数据失败:', error)
  // }
}

const ipStartChange = () => {}
const save = () => {
  // const data = {
  //   enable: form.enable,
  //   ip: form.ip,
  //   mask: form.mask,
  //   ip_start: form.ip_start,
  //   ip_offset: ipOffset.value,
  //   lease: form.lease,
  // }
  // axios
  //   .post('/action/SetLanIp', {
  //     data,
  //   })
  //   .then((response) => {
  //     console.log(response.data)
  //   })
  //   .catch((error) => {
  //     console.log('POST 请求失败:', error)
  //   })
}

fetchData()
</script>

<style lang="less"></style>
