<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0747') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0407')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table :columns="dhcpColumn" :data-source="dhcpData" :show-row-checkbox="false">
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0408')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table :columns="dhcpv6Column" :data-source="dhcpv6Data" :show-row-checkbox="false">
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'
import { getStaInfo } from '@/http/api'

enum IpType {
  v4 = '1',
  v6 = '2',
}
const { t } = useI18n()

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
    key: 'ipv6',
    title: format(t('trans0598'), [t('trans0457')]),
  },
  {
    key: 'duid',
    title: t('trans0746'),
  },
  {
    key: 'lease',
    title: t('trans0745'),
  },
])
const dhcpData = reactive([])
const dhcpv6Data = reactive([])

const getStaInfoData = () => {
  getStaInfo().then(({ data }) => {
    const { items } = data
    items.forEach((item) => {
      if (item.type === IpType.v4) {
        dhcpData.push({
          ip: item.ip,
          mac: item.mac,
          lease: item.lease,
        })
      }
      if (item.type === IpType.v6) {
        dhcpv6Data.push({
          duid: item.duid,
          ipv6: item.ipv6,
          lease: item.lease,
        })
      }
    })
  })
}

onMounted(() => {
  getStaInfoData()
})
</script>
