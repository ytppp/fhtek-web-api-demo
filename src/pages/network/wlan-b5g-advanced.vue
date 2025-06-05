<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ format($t('trans0611'), [$t('trans0050')]) }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form form--padding wifi-form" ref="wifiFormRef" :model="wifi" :rules="rules">
        <fh-form-item
          :label="format($t('trans0027'), [$t('trans0050')])"
          label-position="left"
          :label-width="labelWidth"
        >
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
import { getWifi5gAdv, setWifi5gAdv } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

defineOptions({
  name: 'b5gAdvancedPage',
})
enum BandWidths5G {
  hT20 = 'HT20',
  hT40 = 'HT40',
  hE20 = 'HE20',
  hE40 = 'HE40',
  hE80 = 'HE80',
  hE160 = 'HE160',
  vHT20 = 'VHT20',
  vHT40 = 'VHT40',
  vHT80 = 'VHT80',
  vHT160 = 'VHT160',
}
enum SelectMode5G {
  modeAonly = '2',
  modeANmixed = '8',
  modeACNA = '14',
  modeACN = '15',
  modeAx = '17',
}
enum Powermodes {
  low = '2', // 50%
  middle = '1', // 75%
  high = '6', // 100%
}
enum Channels5G {
  auto = '0',
  ch36 = '36',
  ch40 = '40',
  ch44 = '44',
  ch48 = '48',
  ch52 = '52',
  ch56 = '56',
  ch60 = '60',
  ch64 = '64',
  ch100 = '100',
  ch104 = '104',
  ch108 = '108',
  ch112 = '112',
  ch116 = '116',
  ch132 = '132',
  ch136 = '136',
  ch140 = '140',
  ch144 = '144',
  ch149 = '149',
  ch153 = '153',
  ch157 = '157',
  ch161 = '161',
  ch165 = '165',
}
const dialog = inject('dialog')
const { convertBooleanStatus } = useDataClean()
const { t } = useI18n()
const getCurrentChannel = ref('0')
const wifiFormRef = ref(null)
const labelWidth = '110px'
const modeOpts = [
  {
    value: SelectMode5G.modeAonly,
    text: '802.11a',
  },
  {
    value: SelectMode5G.modeANmixed,
    text: '802.11a/n',
  },
  {
    value: SelectMode5G.modeACNA,
    text: '802.11a/n/ac',
  },
  {
    value: SelectMode5G.modeACN,
    text: '802.11n/ac',
  },
  {
    value: SelectMode5G.modeAx,
    text: '802.11a/n/ac/ax',
  },
]
const bwOpts = [
  {
    value: BandWidths5G.hT20,
    text: 'HT20',
  },
  {
    value: BandWidths5G.hT40,
    text: 'HT40',
  },
  {
    value: BandWidths5G.vHT20,
    text: 'VHT20',
  },
  {
    value: BandWidths5G.vHT40,
    text: 'VHT40',
  },
  {
    value: BandWidths5G.vHT80,
    text: 'VHT80',
  },
  {
    value: BandWidths5G.vHT160,
    text: 'VHT160',
  },
  {
    value: BandWidths5G.hE20,
    text: 'HE20',
  },
  {
    value: BandWidths5G.hE40,
    text: 'HE40',
  },
  {
    value: BandWidths5G.hE80,
    text: 'HE80',
  },
  {
    value: BandWidths5G.hE160,
    text: 'HE160',
  },
]
const b5gChannelsInit = [
  {
    value: Channels5G.auto,
    text: format(t('trans0510'), [getCurrentChannel.value]),
    show: true,
  },
  {
    value: Channels5G.ch36,
    text: Channels5G.ch36,
    show: true,
  },
  {
    value: Channels5G.ch40,
    text: Channels5G.ch40,
    show: true,
  },
  {
    value: Channels5G.ch44,
    text: Channels5G.ch44,
    show: true,
  },
  {
    value: Channels5G.ch48,
    text: Channels5G.ch48,
    show: true,
  },
  {
    value: Channels5G.ch52,
    text: Channels5G.ch52,
    show: true,
  },
  {
    value: Channels5G.ch56,
    text: Channels5G.ch56,
    show: true,
  },
  {
    value: Channels5G.ch60,
    text: Channels5G.ch60,
    show: true,
  },
  {
    value: Channels5G.ch64,
    text: Channels5G.ch64,
    show: true,
  },
  {
    value: Channels5G.ch100,
    text: Channels5G.ch100,
    show: true,
  },
  {
    value: Channels5G.ch104,
    text: Channels5G.ch104,
    show: true,
  },
  {
    value: Channels5G.ch108,
    text: Channels5G.ch108,
    show: true,
  },
  {
    value: Channels5G.ch112,
    text: Channels5G.ch112,
    show: true,
  },
  {
    value: Channels5G.ch116,
    text: Channels5G.ch116,
    show: true,
  },
  {
    value: Channels5G.ch132,
    text: Channels5G.ch132,
    show: true,
  },
  {
    value: Channels5G.ch136,
    text: Channels5G.ch136,
    show: true,
  },
  {
    value: Channels5G.ch140,
    text: Channels5G.ch140,
    show: true,
  },
  {
    value: Channels5G.ch144,
    text: Channels5G.ch144,
    show: true,
  },
  {
    value: Channels5G.ch149,
    text: Channels5G.ch149,
    show: true,
  },
  {
    value: Channels5G.ch153,
    text: Channels5G.ch153,
    show: true,
  },
  {
    value: Channels5G.ch157,
    text: Channels5G.ch157,
    show: true,
  },
  {
    value: Channels5G.ch161,
    text: Channels5G.ch161,
    show: true,
  },
  {
    value: Channels5G.ch165,
    text: Channels5G.ch165,
    show: true,
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
  mode: SelectMode5G.modeAonly,
  bw: BandWidths5G.hT20,
  channel: Channels5G.auto,
  bandWidth: BandWidths5G.hT20,
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
/*
  1). 频宽只有配置为20Mhz，才会显示116和165信道，否则不显示这2个信道;
  2). 116或165信道时，频宽配置为非20Mhz时，信道会自动调整为自动信道，且信道不会再显示116和165信道
*/
const specialBandwidths = [BandWidths5G.hT20, BandWidths5G.vHT20, BandWidths5G.hE20]
const specialChannels = [Channels5G.ch116, Channels5G.ch165]

const showBandwidth = computed(() => {
  return wifi.mode !== SelectMode5G.modeAonly
})
const channelOpts = computed(() => {
  return b5gChannelsInit.filter((item) => {
    if (specialBandwidths.includes(wifi.bw)) {
      if (specialChannels.includes(item.value)) {
        item.show = true
      }
      return item.show === true
    } else {
      if (specialChannels.includes(item.value)) {
        item.show = false
      }
      return item.show === true
    }
  })
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
const getWifi5gData = () => {
  getWifi5gAdv().then(({ data }) => {
    wifi.enable = convertBooleanStatus(data.enable)
    wifi.mode = data.mode
    wifi.bw = data.bw
    wifi.channel = data.channel
    wifi.power = data.power
    wifi.beacon = data.beacon_interval
    if (Channels5G.auto === wifi.channel) {
      getCurrentChannel.value = data.channel_current
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
    setWifi5gAdv(data)
  }
}
onMounted(() => {
  getWifi5gData()
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
