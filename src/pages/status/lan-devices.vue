<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0628') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table
          :columns="lanColumns"
          :data-source="lanDataDisplay"
          :show-row-checkbox="false"
          :show-header="false"
          :border="true"
          :show-index="false"
        >
          <template #blacklist="scope">
            <fh-icon
              @click="goMacFilter(scope.row.mac)"
              class="page__header-icon"
              name="icon-add"
              :title="$t('trans0164')"
            />
          </template>
          <template #footer>
            <div class="page__table-footer">
              <fh-pagination
                @change="lanChangeCurrent"
                :total="lanTotal"
                :default-current="lanCurrent"
                :defaultPageSize="lanPageSize"
              ></fh-pagination>
            </div>
          </template>
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'
import { getWlanDevices } from '@/http/api'
import { NetType } from '@/util/constant'
import { router } from '@/router/index'

const { t } = useI18n()
const dialog = inject('dialog')
const lanColumns = reactive([
  {
    key: 'id',
    title: t('trans0454'),
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
const lanData = reactive([])
const lanTotal = ref(0)
const lanCurrent = ref(1)
const lanPageSize = ref(20)

const lanDataDisplay = computed(() => {
  const start = (lanCurrent.value - 1) * lanPageSize.value
  const end = start + lanPageSize.value
  return lanData.slice(start, end)
})

const getLanDeviceData = () => {
  getWlanDevices({
    type: NetType.ethernet,
  }).then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const lanTableData = []
    items.forEach((item, index) => {
      lanTableData.push({
        ...item,
        id: index + 1,
      })
    })
    for (let i = 0; i < 100; i++) {
      lanTableData.push({
        id: i + 1,
        name: `name${i}`,
        ip: `192.168.1.${i}`,
        mac: `00:00:00:00:00:${i}`,
      })
    }
    lanTotal.value = lanTableData.length
    Object.assign(lanData, lanTableData)
  })
}
const goMacFilter = (mac) => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0939'),
    })
    .then(() => {
      router.push({
        name: 'macFilter',
        query: { t: Date.now(), mac },
      })
    })
    .catch(() => {})
}
const lanChangeCurrent = (current, currentPageSize) => {
  lanCurrent.value = current
  lanPageSize.value = currentPageSize
}

onMounted(() => {
  getLanDeviceData()
})
</script>
