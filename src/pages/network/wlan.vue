<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0017') }}</h1>
    </div>
    <div class="page__content page__content--padding-small">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0049') }}</h2>
      </div>
      <fh-form class="form form--padding wifi-form" ref="wifiFormRef" :model="wifi" :rules="rules">
        <fh-form-item :label="b24gWifiText" label-position="left" :label-width="labelWidth">
          <fh-switch v-model="wifi.isB5gFirst"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="b24gWifiText" label-position="left" :label-width="labelWidth">
          <fh-switch v-model="wifi.b24g.enable"> </fh-switch>
        </fh-form-item>
        <template v-if="isB24gEnable">
          <fh-form-item label="Hide Wifi" label-position="left" :label-width="labelWidth">
            <fh-switch v-model="wifi.b24g.hide"> </fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0029')" prop="ssid">
            <fh-input v-model="wifi.b24g.ssid" maxlength="64"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0031')">
            <fh-select v-model="wifi.b24g.encrypt" :options="encrypts"> </fh-select>
          </fh-form-item>
          <fh-alert v-if="b24gEncryptTip" :title="b24gEncryptTip" type="info" show-icon> </fh-alert>
          <fh-form-item :label="$t('trans0030')" v-if="!isb24gEncryptNone" prop="password">
            <fh-input
              v-model="wifi.b24g.password"
              type="password"
              minlength="8"
              maxlength="64"
              show-password
            >
            </fh-input>
          </fh-form-item>
          <fh-form-item label="Max Sta Total" prop="sta">
            <fh-input name="b24gPassword" v-model="wifi.b24g.sta"> </fh-input>
            <template #extra> 0 meas no limit </template>
          </fh-form-item>
          <fh-form-item :label="$t('trans0509')">
            <fh-select v-model="wifi.b24g.bandWidth" :options="b24gBandWidths"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0507')">
            <fh-select v-model="wifi.b24g.channel" :options="b24gChannels"> </fh-select>
          </fh-form-item>
        </template>
        <fh-form-item :label="b5gWifiText" label-position="left" :label-width="labelWidth">
          <fh-switch v-model="wifi.b5g.enable" @change="(val) => switchEnable(Bands.b5g, val)">
          </fh-switch>
        </fh-form-item>
        <template v-if="isB5gEnable">
          <fh-form-item label="Hide Wifi" label-position="left" :label-width="labelWidth">
            <fh-switch v-model="wifi.b5g.hide"> </fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0029')" prop="ssid">
            <fh-input v-model="wifi.b5g.ssid" maxlength="64"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0031')">
            <fh-select v-model="wifi.b5g.encrypt" :options="encrypts"> </fh-select>
          </fh-form-item>
          <fh-alert v-if="b5gEncryptTip" :title="b5gEncryptTip" type="info" show-icon> </fh-alert>
          <fh-form-item :label="$t('trans0030')" v-if="!isb5gEncryptNone" prop="password">
            <fh-input
              v-model="wifi.b5g.password"
              type="password"
              minlength="8"
              maxlength="64"
              show-password
            >
            </fh-input>
          </fh-form-item>
          <fh-form-item label="Max Sta Total" prop="sta">
            <fh-input name="b24gPassword" v-model="wifi.b5g.sta"> </fh-input>
            <template #extra> 0 meas no limit </template>
          </fh-form-item>
          <fh-form-item :label="$t('trans0509')">
            <fh-select
              v-model="wifi.b5g.bandWidth"
              :options="b5gBandWidths"
              @change="change5gBandwidth"
            >
            </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0507')">
            <fh-select v-model="wifi.b5g.channel" :options="b5gChannels"> </fh-select>
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
import { computed, reactive, ref, inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isValidLength, isValidSymbol, format, specialChar, isValidInteger } from '@/util/tool'
import { getWifi2g, setWifi2g, getWifi5g, setWifi5g } from '@/http/api'

defineOptions({
  name: 'WifiPage',
})

enum EnableStatus {
  yes = '1',
  no = '0',
}
enum Bands {
  b24g = '2.4G',
  b5g = '5G',
}
enum Encrypts {
  none = 'none',
  wpaWpa2PskTkip = 'psk-mixed+tkip',
  wpaWpa2PskCcmp = 'psk-mixed+ccmp',
  wpaWpa2PskTkipCcmp = 'psk-mixed+tkip+ccmp',
  wpa2Wpa3PskSaeCcmp = 'sae-mixed',
  wpaPskCcmp = 'psk+ccmp',
  wpaPskTkip = 'psk+tkip',
  wpa2PskTkip = 'psk2+tkip',
  wpa3SaeCcmp = 'sae',
}
enum BandWidths {
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
const Channels24G = {
  auto: '0',
  ch1: '1',
  ch2: '2',
  ch3: '3',
  ch4: '4',
  ch5: '5',
  ch6: '6',
  ch7: '7',
  ch8: '8',
  ch9: '9',
  ch10: '10',
  ch11: '11',
  ch12: '12',
  ch13: '13',
}
const Channels5G = {
  auto: '0',
  ch36: '36',
  ch40: '40',
  ch44: '44',
  ch48: '48',
  ch52: '52',
  ch56: '56',
  ch60: '60',
  ch64: '64',
  ch100: '100',
  ch104: '104',
  ch108: '108',
  ch112: '112',
  ch116: '116',
  ch132: '132',
  ch136: '136',
  ch140: '140',
  ch144: '144',
  ch149: '149',
  ch153: '153',
  ch157: '157',
  ch161: '161',
  ch165: '165',
}
const dialog = inject('dialog')
const { t } = useI18n()
const getB24CurrentChannel = ref('0')
const getB5CurrentChannel = ref('0')
const wifiFormRef = ref(null)
const b5gWifiFormRef = ref(null)
const labelWidth = '110px'
const encrypts = [
  {
    value: Encrypts.none,
    text: 'Open',
  },
  {
    value: Encrypts.wpaWpa2PskTkip,
    text: 'WPA/WPA2-PSK(TKIP)',
  },
  {
    value: Encrypts.wpaWpa2PskCcmp,
    text: 'WPA/WPA2-PSK(CCMP)',
  },
  {
    value: Encrypts.wpaWpa2PskTkipCcmp,
    text: 'WPA/WPA2-PSK(TKIP|CCMP)',
  },
  {
    value: Encrypts.wpa2Wpa3PskSaeCcmp,
    text: 'WPA2/WPA3-PSK/SAE(CCMP)',
  },
  {
    value: Encrypts.wpaPskCcmp,
    text: 'WPA-PSK(CCMP)',
  },
  {
    value: Encrypts.wpaPskTkip,
    text: 'WPA-PSK(TKIP)',
  },
  {
    value: Encrypts.wpa2PskTkip,
    text: 'WPA2-PSK(TKIP)',
  },
  {
    value: Encrypts.wpa3SaeCcmp,
    text: 'WPA3-SAE(CCMP)',
  },
]
const b24gChannels = [
  {
    value: Channels24G.auto,
    text: format(t('trans0510'), [getB24CurrentChannel.value]),
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
]
const b5gChannelsInit = [
  {
    value: Channels5G.auto,
    text: format(t('trans0510'), [getB5CurrentChannel.value]),
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
const b24gBandWidths = [
  {
    value: BandWidths.hT20,
    text: 'HT20',
  },
  {
    value: BandWidths.hT40,
    text: 'HT40',
  },
  {
    value: BandWidths.hE20,
    text: 'HE20',
  },
  {
    value: BandWidths.hE40,
    text: 'HE40',
  },
]
const b5gBandWidths = [
  {
    value: BandWidths.hT20,
    text: 'HT20',
  },
  {
    value: BandWidths.hT40,
    text: 'HT40',
  },
  {
    value: BandWidths.vHT20,
    text: 'VHT20',
  },
  {
    value: BandWidths.vHT40,
    text: 'VHT40',
  },
  {
    value: BandWidths.vHT80,
    text: 'VHT80',
  },
  {
    value: BandWidths.vHT160,
    text: 'VHT160',
  },
  {
    value: BandWidths.hE20,
    text: 'HE20',
  },
  {
    value: BandWidths.hE40,
    text: 'HE40',
  },
  {
    value: BandWidths.hE80,
    text: 'HE80',
  },
  {
    value: BandWidths.hE160,
    text: 'HE160',
  },
]
const wifi = reactive({
  isB5gFirst: false,
  b24g: {
    enable: EnableStatus.no,
    hide: EnableStatus.no,
    ssid: '',
    encrypt: Encrypts.none,
    password: '',
    sta: 0,
    channel: Channels24G.auto,
    bandWidth: BandWidths.hT20,
  },
  b5g: {
    enable: EnableStatus.no,
    hide: EnableStatus.no,
    ssid: '',
    encrypt: Encrypts.none,
    password: '',
    sta: 0,
    channel: Channels24G.auto,
    bandWidth: BandWidths.hT20,
  },
})
const rules = reactive({
  'b24g.ssid': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 1, 32),
      message: format(t('trans0003'), [t('trans0051'), 1, 32]),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0051'), format(t('trans0042'), [specialChar])]),
    },
  ],
  'b24g.password': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 8, 63),
      message: format(t('trans0003'), [t('trans0196'), 8, 63]),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0196'), format(t('trans0042'), [specialChar])]),
    },
  ],
  'b24g.sta': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 0, 64),
      message: format(t('trans0567'), [0, 64]),
    },
  ],
  'b5g.ssid': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 1, 32),
      message: format(t('trans0003'), [t('trans0051'), 1, 32]),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0051'), format(t('trans0042'), [specialChar])]),
    },
  ],
  'b5g.password': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 8, 63),
      message: format(t('trans0003'), [t('trans0196'), 8, 63]),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0196'), format(t('trans0042'), [specialChar])]),
    },
  ],
  'b5g.sta': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 0, 64),
      message: format(t('trans0567'), [0, 64]),
    },
  ],
})
/*
  1). 频宽只有配置为20Mhz，才会显示116和165信道，否则不显示这2个信道;
  2). 116或165信道时，频宽配置为非20Mhz时，信道会自动调整为自动信道，且信道不会再显示116和165信道
*/
const specialBandwidths = [BandWidths.hT20, BandWidths.vHT20, BandWidths.hE20]
const specialChannels = [Channels5G.ch116, Channels5G.ch165]

const b24gWifiText = computed(() => {
  if (wifi.isB5gFirst) {
    return format(t('trans0027'), [''])
  } else {
    return format(t('trans0027'), [t('trans0049')])
  }
})
const b5gWifiText = computed(() => {
  if (wifi.isB5gFirst) {
    return format(t('trans0027'), [''])
  } else {
    return format(t('trans0027'), [t('trans0050')])
  }
})
const isB24gEnable = computed(() => {
  return wifi.b24g.enable === EnableStatus.yes
})
const isB5gEnable = computed(() => {
  return wifi.b5g.enable === EnableStatus.yes
})
const isb24gEncryptNone = computed(() => {
  return wifi.b24g.encrypt === Encrypts.none
})
const b24gEncryptTip = computed(() => {
  if (isb24gEncryptNone.value) {
    return t('trans0032')
  }
  return ''
})
const isb5gEncryptNone = computed(() => {
  return wifi.b5g.encrypt === Encrypts.none
})
const b5gEncryptTip = computed(() => {
  if (isb5gEncryptNone.value) {
    return t('trans0032')
  }
  return ''
})
const b5gChannels = computed(() => {
  return b5gChannelsInit.filter((item) => {
    if (specialBandwidths.includes(wifi.b5g.bandWidth)) {
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

const switchEnable = (band, val) => {
  let flag = true
  if (band == Bands.b24g) {
    flag = wifi.b24g.enable
  } else if (band == Bands.b5g) {
    flag = wifi.b5g.enable
  }
  if (flag && !val) {
    dialog
      .confirm({
        okText: t('trans0019'),
        cancelText: t('trans0020'),
        message: t('trans0025'),
      })
      .then(() => {})
      .catch(() => {
        if (band == Bands.b24g) {
          wifi.b24g.enable = true
        }
        if (band == Bands.b5g) {
          wifi.b5g.enable = true
        }
      })
  }
}
const change5gBandwidth = () => {
  if (!specialBandwidths.includes(b5gWifi.bandWidth) && specialChannels.includes(b5gWifi.channel)) {
    wifi.b5g.channel = Channels5G.auto
  }
}
const getWifi2gData = () => {
  // getWifi2g().then(({ data }) => {
  //   wifi.enable = data.wl_enable_2g
  //   wifi.hide = data.wl_hide_2g
  //   wifi.ssid = data.wl_ssid_2g
  //   wifi.encrypt = data.wl_safe_2g
  //   wifi.password = data.wl_passwd_2g
  //   wifi.sta = data.wl_maxassoc_2g
  //   wifi.channel = data.wl_channel_2g
  //   wifi.bandWidth = data.wl_bw_2g
  //   if (Channels24G.auto === data.wl_channel_2g) {
  //     getB24CurrentChannel.value = data.wl_channel_2g_current
  //   }
  //   wifiEnable.value = wifi.enable === EnableStatus.yes
  // })
  // getWifi5g().then(({ data }) => {
  //   b5gWifi.enable = data.wl_enable_5g
  //   b5gWifi.hide = data.wl_hide_5g
  //   b5gWifi.ssid = data.wl_ssid_5g
  //   b5gWifi.encrypt = data.wl_safe_5g
  //   b5gWifi.password = data.wl_passwd_5g
  //   b5gWifi.sta = data.wl_maxassoc_5g
  //   b5gWifi.channel = data.wl_channel_5g
  //   b5gWifi.bandWidth = data.wl_bw_5g
  //   if (Channels5G.auto === data.wl_channel_5g) {
  //     getB5CurrentChannel.value = data.wl_channel_5g_current
  //   }
  //   b5gWifiEnable.value = wifi.enable === EnableStatus.yes
  // })
}
const save = () => {
  // if (b5gWifiFormRef.value?.validate()) {
  //   const data = {wl_enable_2g: wifi.enable,
  //     wl_hide_2g: wifi.hide,
  //     wl_ssid_2g: wifi.ssid,
  //     wl_safe_2g: wifi.encrypt,
  //     wl_passwd_2g: wifi.password,
  //     wl_maxassoc_2g: wifi.sta,
  //     wl_channel_2g: wifi.channel,
  //     wl_bw_2g: wifi.bandWidth,
  //     wl_enable_5g: b5gWifi.enable,
  //     wl_hide_5g: b5gWifi.hide,
  //     wl_ssid_5g: b5gWifi.ssid,
  //     wl_safe_5g: b5gWifi.encrypt,
  //     wl_passwd_5g: b5gWifi.password,
  //     wl_maxassoc_5g: b5gWifi.sta,
  //     wl_channel_5g: b5gWifi.channel,
  //     wl_bw_5g: b5gWifi.bandWidth,
  //   }
  //   setWifi5g(data)
  // }
}
onMounted(() => {
  // getWifi2gData()
  // getWifi5gData()
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
