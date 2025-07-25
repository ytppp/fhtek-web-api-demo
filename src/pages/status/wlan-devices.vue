<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0932') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0933') }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="wlanDevicesColumns"
          :data-source="b24gWlanData"
          :show-row-checkbox="false"
          :show-header="false"
          :border="true"
        >
          <template #name="scope">
            <fh-popover v-if="scope.row.name" :content="scope.row.name">
              <div style="width: 100px" class="ellipsis">
                {{ scope.row.name }}
              </div>
            </fh-popover>
          </template>
          <template #blacklist="scope">
            <fh-icon
              @click="goWifiMacFilter(scope.row.mac)"
              class="page__header-icon"
              name="icon-add"
              :title="$t('trans0164')"
            />
          </template>
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0934') }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="wlanDevicesColumns"
          :data-source="b5gWlanData"
          :show-row-checkbox="false"
          :show-header="false"
          :border="true"
        >
          <template #name="scope">
            <fh-popover v-if="scope.row.name" :content="scope.row.name">
              <div style="width: 100px" class="ellipsis">
                {{ scope.row.name }}
              </div>
            </fh-popover>
          </template>
          <template #blacklist="scope">
            <fh-icon
              @click="goWifiMacFilter(scope.row.mac)"
              class="page__header-icon"
              name="icon-add"
              :title="$t('trans0164')"
            />
          </template>
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'
import { getWlanDevices } from '@/http/api'
import { NetType, netTypeText } from '@/util/constant'
import { router } from '@/router/index'

defineOptions({
  name: 'StatusWlanPage',
})

const { t } = useI18n()
const dialog = inject('dialog')
const wlanDevicesColumns = reactive([
  {
    key: 'ssid',
    title: t('trans0051'),
  },
  {
    key: 'name',
    title: t('trans0935'),
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
    key: 'blacklist',
    title: t('trans0105'),
  },
])
const b24gWlanData = reactive([])
const b5gWlanData = reactive([])

const getWlanDeviceData = () => {
  getWlanDevices().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const b24gWlanTableData = []
    const b5gWlanTableData = []
    items.forEach((item) => {
      if (item.type === NetType.b24g) {
        b24gWlanTableData.push({
          ...item,
          typeAlias: netTypeText[item.type],
        })
      }
      if (item.type === NetType.b5g) {
        b5gWlanTableData.push({
          ...item,
          typeAlias: netTypeText[item.type],
        })
      }
    })
    Object.assign(b24gWlanData, b24gWlanTableData)
    Object.assign(b5gWlanData, b5gWlanTableData)
  })
}
const goWifiMacFilter = (mac) => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0937'),
    })
    .then(() => {
      router.push({
        name: 'wifiMacFilter',
        query: { t: Date.now(), mac },
      })
    })
    .catch(() => {})
}
onMounted(() => {
  getWlanDeviceData()
})
</script>
