<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0628') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0702') }}</h2>
      </div>
      <div class="display-form">
        <div class="display-form__item">
          <div class="display-form__label">{{ $t('trans0705') }}</div>
          <div class="display-form__value">{{ b24gConnStatus }}</div>
        </div>
      </div>
      <!-- <div class="page__table">
        <fh-table
          :columns="b24gInterfaceColumns"
          :data-source="b24gInterfaceData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div> -->
      <div class="page__table">
        <fh-table
          :columns="b24gSsidColumns"
          :data-source="b24gSsidData"
          :show-row-checkbox="false"
          :show-index="false"
          :show-header="false"
          :border="true"
        >
        </fh-table>
      </div>
      <div class="page__table">
        <fh-table
          :columns="b24gWlanColumns"
          :data-source="b24gWlanData"
          :show-row-checkbox="false"
          :show-index="false"
          :show-header="false"
          :border="true"
        >
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0704') }}</h2>
      </div>
      <div class="display-form">
        <div class="display-form__item">
          <div class="display-form__label">{{ $t('trans0705') }}</div>
          <div class="display-form__value">{{ b5gConnStatus }}</div>
        </div>
      </div>
      <!-- <div class="page__table">
        <fh-table
          :columns="b5gInterfaceColumns"
          :data-source="b5gInterfaceData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div> -->
      <div class="page__table">
        <fh-table
          :columns="b5gSsidColumns"
          :data-source="b5gSsidData"
          :show-row-checkbox="false"
          :show-index="false"
          :show-header="false"
          :border="true"
        >
        </fh-table>
      </div>
      <div class="page__table">
        <fh-table
          :columns="b5gWlanColumns"
          :data-source="b5gWlanData"
          :show-row-checkbox="false"
          :show-index="false"
          :show-header="false"
          :border="true"
        >
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'
import { getWifi2gAdv, getWifi5gAdv, getWifi2g, getWifi5g, getWlanDevices } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { encryptsText, NetType, netTypeText } from '@/util/constant'

defineOptions({
  name: 'StatusWlanPage',
})

const { t } = useI18n()
const { convertBooleanStatus } = useDataClean()
const b24gConnStatus = ref('')
const b5gConnStatus = ref('')
const b24gInterfaceColumns = reactive([
  {
    key: 'interface',
    title: t('trans0140'),
  },
  {
    key: 'receive',
    title: t('trans0706'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
  {
    key: 'send',
    title: t('trans0707'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
])
const b24gSsidColumns = reactive([
  {
    key: 'index',
    title: t('trans0711'),
  },
  {
    key: 'name',
    title: t('trans0712'),
  },
  {
    key: 'enableAlias',
    title: t('trans0796'),
  },
  {
    key: 'hideAlias',
    title: t('trans0797'),
  },
  {
    key: 'encryptAlias',
    title: t('trans0031'),
  },
])
const b24gWlanColumns = reactive([
  {
    key: 'index',
    title: t('trans0711'),
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
    key: 'name',
    title: t('trans0070'),
  },
  {
    key: 'typeAlias',
    title: t('trans0717'),
  },
])
const b5gInterfaceColumns = reactive([
  {
    key: 'interface',
    title: t('trans0140'),
  },
  {
    key: 'receive',
    title: t('trans0706'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
  {
    key: 'send',
    title: t('trans0707'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
])
const b5gSsidColumns = reactive([
  {
    key: 'index',
    title: t('trans0711'),
  },
  {
    key: 'name',
    title: t('trans0712'),
  },
  {
    key: 'enableAlias',
    title: t('trans0796'),
  },
  {
    key: 'hideAlias',
    title: t('trans0797'),
  },
  {
    key: 'encryptAlias',
    title: t('trans0031'),
  },
])
const b5gWlanColumns = reactive([
  {
    key: 'index',
    title: t('trans0711'),
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
    key: 'name',
    title: t('trans0070'),
  },
  {
    key: 'typeAlias',
    title: t('trans0717'),
  },
])
const b24gInterfaceData = reactive([])
const b24gSsidData = reactive([])
const b24gWlanData = reactive([])
const b5gInterfaceData = reactive([])
const b5gSsidData = reactive([])
const b5gWlanData = reactive([])

const getWifi2gAdvData = () => {
  getWifi2gAdv().then(({ data }) => {
    b24gConnStatus.value = convertBooleanStatus(data.enable) ? t('trans0103') : t('trans0054')
  })
}
const getWifi5gAdvData = () => {
  getWifi5gAdv().then(({ data }) => {
    b5gConnStatus.value = convertBooleanStatus(data.enable) ? t('trans0103') : t('trans0054')
  })
}
const getWifi2gBasicData = () => {
  getWifi2g().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const tableData = items.map((item) => ({
      ...item,
      enableAlias: convertBooleanStatus(item.enable) ? t('trans0103') : t('trans0054'),
      hideAlias: convertBooleanStatus(item.enable_hide) ? t('trans0103') : t('trans0054'),
      encryptAlias: encryptsText[item.auth_mode],
    }))
    Object.assign(b24gSsidData, tableData)
  })
}
const getWifi5gBasicData = () => {
  getWifi5g().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const tableData = items.map((item) => ({
      ...item,
      enableAlias: convertBooleanStatus(item.enable) ? t('trans0103') : t('trans0054'),
      hideAlias: convertBooleanStatus(item.enable_hide) ? t('trans0103') : t('trans0054'),
      encryptAlias: encryptsText[item.auth_mode],
    }))
    Object.assign(b5gSsidData, tableData)
  })
}
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
onMounted(() => {
  getWifi2gAdvData()
  getWifi5gAdvData()
  getWifi2gBasicData()
  getWifi5gBasicData()
  getWlanDeviceData()
})
</script>
