<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ format($t('trans0611'), [$t('trans0049')]) }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form form--padding wifi-form" ref="wifiFormRef" :model="wifi" :rules="rules">
        <fh-form-item :label="format($t('trans0027'), [$t('trans0049')])">
          <fh-switch @change="switchEnable" v-model="wifi.enable"> </fh-switch>
        </fh-form-item>
        <template v-if="wifi.enable">
          <fh-form-item :label="$t('trans0508')">
            <fh-select v-model="wifi.mode" :options="modeOpts"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0509')" v-if="showBandwidth">
            <fh-select v-model="wifi.bw" :options="bwOpts"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0507')">
            <fh-select v-model="wifi.channel" :options="channelOpts"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0044')">
            <fh-select v-model="wifi.power" :options="powerOpts"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0801')" prop="beacon">
            <fh-input v-model="wifi.beacon"> </fh-input>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, inject, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, isValidInteger } from '@/util/tool'
import { getWifi2gAdv, setWifi2gAdv } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

defineOptions({
  name: 'b24gAdvancedPage',
})
enum BandWidths24G {
  b20 = 'bw20',
  b40 = 'bw40',
  b20m40 = 'bw20m40',
}
enum SelectMode24G {
  modebgnmix = '9', // 802.11b/g/n 显示频宽
  modebgmix = '0', // 802.11b/g
  moden = '6', // 802.11n 显示频宽
  modeg = '4', // 802.11g
  modeb = '1', // 802.11b
  modeAx = '16', // 802.11b/g/n/ax 显示频宽
}
enum Powermodes {
  low = '50', // 50%
  middle = '75', // 75%
  high = '100', // 100%
}
enum Channels24G {
  auto = '0',
  ch1 = '1',
  ch2 = '2',
  ch3 = '3',
  ch4 = '4',
  ch5 = '5',
  ch6 = '6',
  ch7 = '7',
  ch8 = '8',
  ch9 = '9',
  ch10 = '10',
  ch11 = '11',
  ch12 = '12',
  ch13 = '13',
}
const dialog = inject('dialog')
const { convertBooleanStatus } = useDataClean()
const { t } = useI18n()
const channelCurrent = ref('0')
const wifiFormRef = ref(null)
const modeOpts = [
  {
    value: SelectMode24G.modeb,
    text: '802.11b',
  },
  {
    value: SelectMode24G.modeg,
    text: '802.11g',
  },
  {
    value: SelectMode24G.moden,
    text: '802.11n',
  },
  {
    value: SelectMode24G.modebgmix,
    text: '802.11b/g',
  },
  {
    value: SelectMode24G.modebgnmix,
    text: '802.11b/g/n',
  },
  {
    value: SelectMode24G.modeAx,
    text: '802.11b/g/n/ax',
  },
]
const channelOpts = reactive([
  {
    value: Channels24G.auto,
    text: format(t('trans0510'), [channelCurrent.value]),
  },
  {
    value: Channels24G.ch1,
    text: Channels24G.ch1,
  },
  {
    value: Channels24G.ch2,
    text: Channels24G.ch2,
  },
  {
    value: Channels24G.ch3,
    text: Channels24G.ch3,
  },
  {
    value: Channels24G.ch4,
    text: Channels24G.ch4,
  },
  {
    value: Channels24G.ch5,
    text: Channels24G.ch5,
  },
  {
    value: Channels24G.ch6,
    text: Channels24G.ch6,
  },
  {
    value: Channels24G.ch7,
    text: Channels24G.ch7,
  },
  {
    value: Channels24G.ch8,
    text: Channels24G.ch8,
  },
  {
    value: Channels24G.ch9,
    text: Channels24G.ch9,
  },
  {
    value: Channels24G.ch10,
    text: Channels24G.ch10,
  },
  {
    value: Channels24G.ch11,
    text: Channels24G.ch11,
  },
  {
    value: Channels24G.ch12,
    text: Channels24G.ch12,
  },
  {
    value: Channels24G.ch13,
    text: Channels24G.ch13,
  },
])
const bwOpts = [
  {
    value: BandWidths24G.b20,
    text: '20MHz',
  },
  {
    value: BandWidths24G.b40,
    text: '40MHz',
  },
  {
    value: BandWidths24G.b20m40,
    text: '20/40MHz',
  },
]
const powerOpts = [
  {
    value: Powermodes.low,
    text: t('trans0045'),
  },
  {
    value: Powermodes.middle,
    text: t('trans0046'),
  },
  {
    value: Powermodes.high,
    text: t('trans0047'),
  },
]
const wifi = reactive({
  enable: true,
  mode: SelectMode24G.modeb,
  bw: BandWidths24G.b20,
  channel: Channels24G.auto,
  power: Powermodes.high,
  beacon: '',
})
const rules = reactive({
  beacon: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 20, 1000),
      message: format(t('trans0567'), [20, 1000]),
    },
  ],
})

const showBandwidth = computed(() => {
  return (
    wifi.mode === SelectMode24G.moden ||
    wifi.mode === SelectMode24G.modebgnmix ||
    wifi.mode === SelectMode24G.modeAx
  )
})

const switchEnable = (val) => {
  if (!val) {
    dialog
      .confirm({
        okText: t('trans0019'),
        cancelText: t('trans0020'),
        message: t('trans0025'),
      })
      .then(() => {})
      .catch(() => {
        wifi.enable = true
      })
  }
}
const getWifi2gData = () => {
  getWifi2gAdv().then(({ data }) => {
    wifi.enable = convertBooleanStatus(data.enable)
    wifi.mode = data.mode
    wifi.bw = data.bw
    wifi.channel = data.channel
    wifi.power = data.power
    wifi.beacon = data.beacon_interval
    if (Channels24G.auto === wifi.channel) {
      channelCurrent.value = data.channel_current
      channelOpts[0].text = format(t('trans0510'), [channelCurrent.value])
    }
  })
}
const save = () => {
  if (wifiFormRef.value?.validate()) {
    const data = {
      enable: convertBooleanStatus(wifi.enable),
      mode: wifi.mode,
      bw: wifi.bw,
      channel: wifi.channel,
      power: wifi.power,
      beacon_interval: wifi.beacon,
    }
    setWifi2gAdv(data)
  }
}
onMounted(() => {
  getWifi2gData()
})
</script>

<style lang="less">
.wifi-form {
  .form-item {
    .form-item__extra {
      margin-left: 0px !important;
    }
  }
  .page__sub-header {
    margin-bottom: 20px;
  }
}
</style>
