<template>
  <div class="page wan-status">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0140') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0456')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="columns"
          :data-source="ipv4Data"
          :show-index="false"
          :show-row-checkbox="false"
          :show-header="false"
          :border="true"
        >
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0457')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="ipv6Columns"
          :data-source="ipv6Data"
          :show-index="false"
          :show-row-checkbox="false"
          :show-header="false"
          :border="true"
        >
        </fh-table>
      </div>
      <fh-modal v-model="visible" :title="$t('trans0929')">
        <template #body>
          <fh-descriptions :data="displayInfo"></fh-descriptions>
        </template>
      </fh-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, cidrToSubnetMask } from '@/util/tool'
import { getWanInfo } from '@/http/api'
import { IP, NetType, netTypeText } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'

defineOptions({
  name: 'StatusWanPage',
})

enum Status {
  UP = 'UP',
  DOWN = 'DOWN',
}

const { t } = useI18n()
const { defaultDataObj, defaultVal } = useDataClean()
const StatusText = {
  [Status.UP]: t('trans0652'),
  [Status.DOWN]: t('trans0653'),
}
const visible = ref(false)
const columns = reactive([
  {
    key: 'wan',
    title: t('trans0140'),
    width: '240',
  },
  {
    key: 'statusAlias',
    title: t('trans0166'),
    width: '100',
  },
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0056')]),
    width: '150',
  },
  {
    key: 'vlanPriority',
    title: t('trans0450'),
    width: '120',
  },
  {
    key: 'mac',
    title: format(t('trans0598'), [t('trans0057')]),
    width: '200',
  },
  {
    key: 'mask',
    title: t('trans0459'),
    width: '150',
  },
  {
    key: 'mode',
    title: t('trans0080'),
    width: '100',
  },
  {
    key: 'gateway',
    title: t('trans0548'),
    width: '200',
  },
  {
    key: 'dns1',
    title: t('trans0496'),
    width: '200',
  },
  {
    key: 'dns2',
    title: t('trans0497'),
    width: '200',
  },
])
const ipv6Columns = reactive([
  {
    key: 'wan',
    title: t('trans0140'),
    width: '240',
  },
  {
    key: 'statusAlias',
    title: t('trans0166'),
    width: '100',
  },
  {
    key: 'prefix',
    title: t('trans0476'),
    width: '220',
  },
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0056')]),
    width: '300',
  },
  {
    key: 'vlanPriority',
    title: t('trans0450'),
    width: '120',
  },
  {
    key: 'mac',
    title: format(t('trans0598'), [t('trans0057')]),
    width: '200',
  },
  {
    key: 'gateway',
    title: t('trans0548'),
    width: '200',
  },
  {
    key: 'mode',
    title: t('trans0080'),
    width: '100',
  },
  {
    key: 'dns1',
    title: t('trans0496'),
    width: '200',
  },
  {
    key: 'dns2',
    title: t('trans0497'),
    width: '200',
  },
])
const displayInfo = reactive({
  wan: {
    label: t('trans0140'),
    value: defaultVal,
  },
  statusAlias: {
    label: t('trans0166'),
    value: defaultVal,
  },
  typeAlias: {
    label: t('trans0080'),
    value: defaultVal,
  },
  ip: {
    label: format(t('trans0598'), [t('trans0056')]),
    value: defaultVal,
  },
  gateway: {
    label: t('trans0548'),
    value: defaultVal,
  },
  dns1: {
    label: t('trans0496'),
    value: defaultVal,
  },
  dns2: {
    label: t('trans0497'),
    value: defaultVal,
  },
  prefix: {
    label: t('trans0476'),
    value: defaultVal,
  },
})
const ipv4Data = reactive([])
const ipv6Data = reactive([])

const getWanData = () => {
  getWanInfo().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const thisIpv4Data = []
    const thisIpv6Data = []
    items.forEach((item) => {
      const ipv4 = item.ipv4
      const ipv6 = item.ipv6
      let dns1 = ''
      let dns2 = ''
      const statusAlias = StatusText[item.status]
      if (item.dns_servers.length > 0) {
        dns1 = item.dns_servers[0]
        dns2 = item.dns_servers.length === 2 && item.dns_servers[1]
      }
      const ipArr: string[] = []
      const gatewayArr: string[] = []
      const prefixArr: string[] = []
      ipv4.forEach((ipv4Item) => {
        if (ipv4Item.hasOwnProperty('address')) {
          ipArr.push(ipv4Item.address)
        }
        if (ipv4Item.hasOwnProperty('gateway')) {
          gatewayArr.push(ipv4Item.gateway)
        }
      })
      ipv6.forEach((ipv6Item) => {
        if (ipv6Item.hasOwnProperty('address')) {
          ipArr.push(ipv6Item.address)
        }
        if (ipv6Item.hasOwnProperty('gateway')) {
          gatewayArr.push(ipv6Item.gateway)
        }
        if (ipv6Item.hasOwnProperty('prefix')) {
          prefixArr.push(ipv6Item.prefix)
        }
      })
      const tableItem = {
        ...item,
        wan: item.wanname,
        ip: ipArr.map((val) => val.split('/')[0]).join(' '),
        mask: ipArr.map((val) => cidrToSubnetMask(Number(val.split('/')[1]))).join(' '),
        mode: netTypeText[item.protocol],
        gateway: gatewayArr.join(' '),
        prefix: prefixArr.join(''),
        dns1,
        dns2,
        vlanPriority: `${item.vid}/${item.p8021}`,
        mac: item.macaddr,
        statusAlias,
      }
      if (ipv4.length > 0 || item.protocol === NetType.dhcp) {
        thisIpv4Data.push(tableItem)
      } else if (ipv6.length > 0 || item.protocol === NetType.dhcpv6) {
        thisIpv6Data.push(tableItem)
      }
      if (item.protocol === NetType.bridge) {
        thisIpv4Data.push(tableItem)
        thisIpv6Data.push(tableItem)
      }
    })
    Object.assign(ipv4Data, thisIpv4Data)
    Object.assign(ipv6Data, thisIpv6Data)
  })
}
const formatContent = (value) => value.split(' ').join('\n')
const detail = (row) => {
  visible.value = true
  const thisDisplayInfo = {
    wan: row.wan,
    statusAlias: row.statusAlias,
    typeAlias: row.typeAlias,
    ip: formatContent(row.ip),
    gateway: formatContent(row.gateway),
    dns1: row.dns1,
    dns2: row.dns2,
    prefix: row.prefix,
  }
  defaultDataObj(displayInfo, thisDisplayInfo, (key) => {
    displayInfo[key].show = !(row.ipv4.length && key === 'prefix')
  })
}

onMounted(() => {
  getWanData()
})
</script>

<style lang="less">
.wan-status {
  .table-main {
    max-width: 980px;
  }
}
</style>
