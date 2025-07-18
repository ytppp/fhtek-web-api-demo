<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0140') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table :columns="columns" :data-source="displayData" :show-row-checkbox="false">
          <template #filtergroup>
            <fh-select v-model="display" :options="displayOptions"></fh-select>
          </template>
          <template #ip="scope">
            <fh-popover>
              <div style="width: 100px" class="ellipsis">
                {{ scope.row.ip }}
              </div>
              <template #content>
                <div style="white-space: pre-wrap">
                  {{ formatContent(scope.row.ip) }}
                </div>
              </template>
            </fh-popover>
          </template>
          <template #gateway="scope">
            <fh-popover>
              <div style="width: 100px" class="ellipsis">
                {{ scope.row.gateway }}
              </div>
              <template #content>
                <div style="white-space: pre-wrap">
                  {{ formatContent(scope.row.gateway) }}
                </div>
              </template>
            </fh-popover>
          </template>
          <template #operation="scope">
            <fh-button type="text" @click="detail(scope.row)">
              {{ $t('trans0929') }}
            </fh-button>
          </template>
        </fh-table>
      </div>
      <fh-modal v-model="visible" :title="$t('trans0929')">
        <template #body>
          <div class="display-form">
            <template v-for="(item, index) in displayInfo" :key="index">
              <div class="display-form__item" v-if="item.show">
                <div class="display-form__label">{{ item.label }}</div>
                <div class="display-form__value">{{ item.value }}</div>
              </div>
            </template>
          </div>
        </template>
      </fh-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'
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
const all = 'all'
const StatusText = {
  [Status.UP]: t('trans0652'),
  [Status.DOWN]: t('trans0653'),
}
const display = ref(all)
const visible = ref(false)
const displayOptions = [
  {
    value: all,
    text: t('trans0537'),
  },
  {
    value: IP.IPv4,
    text: t('trans0456'),
  },
  {
    value: IP.IPv6,
    text: t('trans0457'),
  },
  {
    value: NetType.bridge,
    text: t('trans0083'),
  },
]
const ipAndMaskText = `${format(t('trans0598'), [t('trans0056')])}/${t('trans0459')}`
const columns = reactive([
  {
    key: 'wan',
    title: t('trans0140'),
  },
  {
    key: 'statusAlias',
    title: t('trans0166'),
  },
  {
    key: 'ip',
    title: ipAndMaskText,
  },
  {
    key: 'typeAlias',
    title: t('trans0080'),
  },
  // no data support
  // {
  //   key: 'vlanPriority',
  //   title: t('trans0450'),
  // },
  // {
  //   key: 'mac',
  //   title: format(t('trans0598'), [t('trans0057')]),
  // },
  // no data support end
  {
    key: 'gateway',
    title: t('trans0548'),
    width: '200',
  },
  // {
  //   key: 'dns1',
  //   title: t('trans0496'),
  // },
  // {
  //   key: 'dns2',
  //   title: t('trans0497'),
  // },
  // {
  //   key: 'prefix',
  //   title: t('trans0476'),
  // },
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
    label: ipAndMaskText,
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
const tableData = reactive([])

const displayData = computed(() => {
  if (display.value === all) {
    return tableData
  }
  return tableData.filter((item) => item.display === display.value)
})

const getWanData = () => {
  getWanInfo().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const thisTableData = []
    items.forEach((item) => {
      const ipv4 = item.ipv4
      const ipv6 = item.ipv6
      let ip = ''
      let gateway = ''
      let display = ''
      let prefix = ''
      let dns1 = ''
      let dns2 = ''
      if (item.protocol === 'bridge') {
        display = NetType.bridge
      } else if (ipv4.length > 0) {
        display = IP.IPv4
        ip = ipv4[0].address
        gateway = ipv4[0].gateway
      } else if (ipv6.length > 0) {
        display = IP.IPv6
        ipv6.forEach((ipv6Item, index) => {
          if (ipv6Item.hasOwnProperty('address')) {
            ip += `${ipv6Item.address}${index === ipv6.length - 1 ? '' : ' '}`
          }
          if (ipv6Item.hasOwnProperty('gateway')) {
            gateway += `${ipv6Item.gateway}${index === ipv6.length - 1 ? '' : ' '}`
          }
          if (ipv6Item.hasOwnProperty('prefix')) {
            prefix = ipv6Item.prefix
          }
        })
      }
      if (item.dns_servers.length > 0) {
        dns1 = item.dns_servers[0]
        dns2 = item.dns_servers.length === 2 && item.dns_servers[1]
      }
      thisTableData.push({
        ...item,
        wan: `${item.wanname}(${item.interface})`,
        statusAlias: StatusText[item.status],
        display,
        typeAlias: netTypeText[item.protocol],
        ip,
        gateway,
        prefix,
        dns1,
        dns2,
      })
    })
    Object.assign(tableData, thisTableData)
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
