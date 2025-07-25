<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0938') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0407')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="dhcpColumn"
          :data-source="dhcpData"
          :show-header="false"
          :show-row-checkbox="false"
          :border="true"
        >
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0408')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="dhcpv6Column"
          :data-source="dhcpv6Data"
          :show-header="false"
          :show-row-checkbox="false"
          :border="true"
        >
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, formatDuration } from '@/util/tool'
import { getStaInfo } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

enum IpType {
  v4 = '1',
  v6 = '2',
}
const { t } = useI18n()
const { defaultVal } = useDataClean()
const dhcpColumn = reactive([
  {
    key: 'hostname',
    title: t('trans0747'),
  },
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
    key: 'hostname',
    title: t('trans0747'),
  },
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

const transformDuration = (zone) => {
  if (!zone || window.isNaN(zone) || parseInt(zone, 10) < 0) {
    return defaultVal
  }
  zone = Number(zone)
  let timeArr = formatDuration(zone)
  let suffixs = [
    {
      key: 'year',
      text: 'trans0927',
      limitBefore: 1, // 向当前位的下多少位取值
    },
    {
      key: 'month',
      text: 'trans0928',
      limitBefore: 1,
    },
    {
      key: 'day',
      text: 'trans0499',
      limitBefore: 1,
    },
    {
      key: 'hour',
      text: 'trans0500',
      limitBefore: 1,
    },
    {
      key: 'minute',
      text: 'trans0501',
      limitBefore: 0,
    },
    {
      key: 'second',
      text: 'trans0488',
      limitBefore: 0,
    },
  ]
  const first = timeArr.findIndex((val) => val) // 找到第一个有值的日期
  const suffix = suffixs[first]
  const last = first + suffix.limitBefore + 1
  timeArr = timeArr.slice(first, last)
  suffixs = suffixs.slice(first, last)
  let durationStr = ''
  suffixs.forEach((item, i) => {
    if (timeArr[i]) {
      durationStr += `${timeArr[i]} ${t(suffixs[i].text)} `
    }
  })
  return durationStr
}
const getStaInfoData = () => {
  getStaInfo().then(({ data }) => {
    const { items } = data
    const thisDhcpData = []
    const thisDhcpv6Data = []
    items.forEach((item) => {
      const lease = transformDuration(item.lease)
      if (item.type === IpType.v4) {
        thisDhcpData.push({
          ...item,
          lease,
        })
      }
      if (item.type === IpType.v6) {
        thisDhcpv6Data.push({
          ...item,
          lease,
        })
      }
    })
    Object.assign(dhcpData, thisDhcpData)
    Object.assign(dhcpv6Data, thisDhcpv6Data)
  })
}

onMounted(() => {
  getStaInfoData()
})
</script>
