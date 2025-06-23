<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0155') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0456') }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="ipv4Columns"
          :data-source="ipv4Data"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0457') }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="ipv6Columns"
          :data-source="ipv6Data"
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
import { format } from '@/util/tool'

const { t } = useI18n()

const ipv4Columns = reactive([
  {
    key: 'wan',
    title: t('trans0155'),
  },
  {
    key: 'status',
    title: t('trans0166'),
  },
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0056')]),
  },
  {
    key: 'mask',
    title: t('trans0459'),
  },
  {
    key: 'type',
    title: t('trans0080'),
  },
  {
    key: 'vlanPriority',
    title: t('trans0450'),
  },
  {
    key: 'mac',
    title: format(t('trans0598'), [t('trans0057')]),
  },
  {
    key: 'gateway',
    title: t('trans0548'),
  },
  {
    key: 'dns1',
    title: t('trans0496'),
  },
  {
    key: 'dns2',
    title: t('trans0497'),
  },
])
const ipv6Columns = reactive([
  {
    key: 'wan',
    title: t('trans0155'),
  },
  {
    key: 'status',
    title: t('trans0166'),
  },
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0457')]),
  },
  {
    key: 'gateway',
    title: t('trans0548'),
  },
  {
    key: 'type',
    title: t('trans0080'),
  },
  {
    key: 'vlanPriority',
    title: t('trans0450'),
  },
  {
    key: 'mac',
    title: format(t('trans0598'), [t('trans0057')]),
  },
  {
    key: 'dns1',
    title: t('trans0496'),
  },
  {
    key: 'dns2',
    title: t('trans0497'),
  },
  {
    key: 'prefix',
    title: t('trans0596'),
  },
])
const ipv4Data = reactive([])
const ipv6Data = reactive([])
</script>
