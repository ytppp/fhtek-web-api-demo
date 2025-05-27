<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0747') }}</h1>
    </div>
    <div class="page__content page__content--padding-small">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0716') }}</h2>
      </div>
      <div class="page__table">
        <fh-table :columns="dhcpColumn" :data-source="dhcpData" :show-row-checkbox="false">
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0716') }}</h2>
      </div>
      <div class="page__table">
        <fh-table :columns="dhcpv6Column" :data-source="dhcpv6Data" :show-row-checkbox="false">
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

const dhcpColumn = reactive([
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0056')]),
  },
  {
    key: 'mac',
    title: format(t('trans0598'), [t('trans0057')]),
  },
  {
    key: 'lease',
    title: t('trans0745'),
  },
])
const dhcpv6Column = reactive([
  {
    key: 'duid',
    title: t('trans0746'),
  },
  {
    key: 'ipv6',
    title: format(t('trans0598'), [t('trans0457')]),
  },
])
const dhcpData = reactive([])
const dhcpv6Data = reactive([])
</script>
