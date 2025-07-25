<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0628') }}</h1>
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
          <template #blacklist="scope">
            <fh-icon
              @click="goMacFilter(scope.row.mac)"
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
import { reactive, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'
import { getWlanDevices } from '@/http/api'
import { NetType } from '@/util/constant'
import { router } from '@/router/index'

const { t } = useI18n()
const dialog = inject('dialog')
const lanColumns = reactive([
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
const goMacFilter = (mac) => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0937'),
    })
    .then(() => {
      router.push({
        name: 'macFilter',
        query: { t: Date.now(), mac },
      })
    })
    .catch(() => {})
}

onMounted(() => {
  getLanDeviceData()
})
</script>
