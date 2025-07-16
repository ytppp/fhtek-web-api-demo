<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0715') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0716') }}</h2>
      </div>
      <div class="display-form">
        <div class="display-form__item" v-for="(item, index) in basicInfo" :key="index">
          <div class="display-form__label">{{ item.label }}</div>
          <div class="display-form__value">{{ item.value }}</div>
        </div>
      </div>
      <div class="page__table">
        <fh-table
          :columns="lanListColumns"
          :data-source="lanListData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div>
      <div class="page__table">
        <fh-table :columns="lanColumns" :data-source="lanData" :show-row-checkbox="false">
        </fh-table>
      </div>
      <div class="page__table">
        <fh-table
          :columns="interfaceColumns"
          :data-source="interfaceData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
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

const basicInfo = reactive({
  ip: {
    label: format(t('trans0598'), [t('trans0056')]),
    value: defaultVal,
  },
  ipv6: {
    label: format(t('trans0598'), [t('trans0457')]),
    value: defaultVal,
  },
  mac: {
    label: format(t('trans0598'), [t('trans0057')]),
    value: defaultVal,
  },
})
const lanListColumns = reactive([
  {
    key: 'lan1',
    title: 'LAN1',
  },
  {
    key: 'lan2',
    title: 'LAN2',
  },
  {
    key: 'lan3',
    title: 'LAN3',
  },
  {
    key: 'lan4',
    title: 'LAN4',
  },
])
const lanColumns = reactive([
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0056')]),
  },
  {
    key: 'mac',
    title: format(t('trans0598'), [t('trans0057')]),
  },
  {
    key: 'type',
    title: t('trans0717'),
  },
])
const interfaceColumns = reactive([
  {
    key: 'interface',
    title: t('trans0140'),
  },
  {
    key: 'receive',
    title: t('trans0706'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
  {
    key: 'send',
    title: t('trans0707'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
])
const lanListData = reactive([])
const lanData = reactive([])
const interfaceData = reactive([])
</script>
