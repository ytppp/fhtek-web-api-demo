<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0495') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table
          :columns="lanColumns"
          :data-source="lanData"
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

<script setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'
import { getWlanDevices } from '@/http/api'
import { NetType } from '@/util/constant'
import { router } from '@/router/index'

const { t } = useI18n()
const lanColumns = reactive([
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0056')]),
  },
  {
    key: 'name',
    title: t('trans0935'),
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
const lanData = reactive([])

const getLanDeviceData = () => {
  getWlanDevices({
    type: NetType.ethernet,
  }).then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    Object.assign(lanData, items)
  })
}
const goWifiMacFilter = (mac) => {
  router.push({
    name: 'wifiMacFilter',
    query: { t: Date.now(), mac },
  })
}

onMounted(() => {
  getLanDeviceData()
})
</script>
