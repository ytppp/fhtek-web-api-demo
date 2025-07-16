<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0715') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0716') }}</h2>
      </div>
      <div class="display-form">
        <div class="display-form__item" v-for="(item, index) in basicInfo" :key="index">
          <div class="display-form__label">{{ item.label }}</div>
          <div class="display-form__value">{{ item.value }}</div>
        </div>
      </div>
      <div class="page__table">
        <fh-table
          :columns="lanListColumns"
          :data-source="lanListData"
          :show-row-checkbox="false"
          :show-index="false"
          :border="true"
        >
        </fh-table>
      </div>
      <div class="page__table">
        <fh-table
          :columns="lanColumns"
          :data-source="lanData"
          :show-row-checkbox="false"
          :border="true"
        >
        </fh-table>
      </div>
      <div class="page__table">
        <fh-table
          :columns="interfaceColumns"
          :data-source="interfaceData"
          :show-row-checkbox="false"
          :show-index="false"
        >
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
import { getLanInfo, getWlanDevices } from '@/http/api'
import { Lan1, Lan2, Lan3, Lan4, SsidText, NetType, netTypeText } from '@/util/constant'

const { t } = useI18n()
const { defaultDataObj, defaultVal } = useDataClean()
const Down = 'down'
const basicInfo = reactive({
  ip: {
    label: format(t('trans0598'), [t('trans0056')]),
    value: defaultVal,
  },
  ipv6: {
    label: format(t('trans0598'), [t('trans0457')]),
    value: defaultVal,
  },
  mac: {
    label: format(t('trans0598'), [t('trans0057')]),
    value: defaultVal,
  },
})
const lanListColumns = reactive([
  {
    key: Lan1,
    title: SsidText[Lan1],
  },
  {
    key: Lan2,
    title: SsidText[Lan2],
  },
  {
    key: Lan3,
    title: SsidText[Lan3],
  },
  {
    key: Lan4,
    title: SsidText[Lan4],
  },
])
const lanColumns = reactive([
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
const interfaceColumns = reactive([
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
        key: 'byte1',
        title: t('trans0708'),
      },
      {
        key: 'package1',
        title: t('trans0709'),
      },
      {
        key: 'error1',
        title: t('trans0234'),
      },
      {
        key: 'abandon1',
        title: t('trans0710'),
      },
    ],
  },
])
const lanListData = reactive([])
const lanData = reactive([])
const interfaceData = reactive([])

const getLanInfoData = () => {
  getLanInfo().then(({ data }) => {
    const { ip, ipv6, mac, lan, datas } = data
    const thisInterfaceData = []
    const thisBasicInfo = {
      ip,
      ipv6,
      mac,
    }
    const thisLanListData = [
      {
        [Lan1]: convertLan(lan[Lan1]),
        [Lan2]: convertLan(lan[Lan2]),
        [Lan3]: convertLan(lan[Lan3]),
        [Lan4]: convertLan(lan[Lan4]),
      },
    ]
    datas.forEach((item) => {
      thisInterfaceData.push({
        interface: item.ifname,
        byte: item.receive.byte,
        package: item.receive.package,
        error: item.receive.error,
        abandon: item.receive.abandon,
        byte1: item.send.byte,
        package1: item.send.package,
        error1: item.send.error,
        abandon1: item.send.abandon,
      })
    })
    defaultDataObj(basicInfo, thisBasicInfo)
    Object.assign(lanListData, thisLanListData)
    Object.assign(interfaceData, thisInterfaceData)
  })
}
const convertLan = (lanVal) => {
  return lanVal === Down ? t('trans0653') : lanVal
}
const getLanDeviceData = () => {
  getWlanDevices().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const thisLanData = []
    items.forEach((item) => {
      if (item.type === NetType.ethernet) {
        thisLanData.push({
          ...item,
          typeAlias: netTypeText[item.type],
        })
      }
    })
    Object.assign(lanData, thisLanData)
  })
}

onMounted(() => {
  getLanInfoData()
  getLanDeviceData()
})
</script>
