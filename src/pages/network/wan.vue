<template>
  <div class="page wan-page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0014') }}</h1>
    </div>
    <div class="page__content">
      <fh-button size="small" @click="addWanConn" v-if="isEdit">
        {{ $t('trans0760') }}
      </fh-button>
      <fh-button size="small" @click="cancelWanConnAdd" v-if="isAdd">
        {{ $t('trans0020') }}
      </fh-button>
      <fh-form class="form" ref="wanRef" :model="wan" :rules="wanRules">
        <div class="form__col">
          <fh-form-item :label="t('trans0140')" v-if="isEdit">
            <fh-select v-model="wan.id" :options="wanOptions" @change="changeWan"></fh-select>
            <template #extra>
              <fh-button v-if="isShowWanDel" @click="delWanConn" size="small">
                {{ $t('trans0759') }}
              </fh-button>
            </template>
          </fh-form-item>
          <fh-form-item :label="t('trans0761')" label-position="left">
            <fh-checkbox v-model="wan.enable" />
          </fh-form-item>
          <fh-form-item :label="t('trans0762')">
            <fh-select v-model="wan.wanMode" :options="wanModeOptions"></fh-select>
          </fh-form-item>
          <fh-form-item :label="t('trans0080')" v-if="isRouter">
            <fh-select v-model="wan.netType" :options="netTypesOptions"></fh-select>
          </fh-form-item>
          <fh-form-item :label="t('trans0763')">
            <fh-select v-model="wan.serviceType" :options="serviceTypeOptions"></fh-select>
          </fh-form-item>
          <template v-if="isHidePortBinding">
            <fh-form-item :label="t('trans0764')">
              <fh-checkbox-group v-model="wan.lan">
                <fh-checkbox v-for="item in lanOptions" :key="item.value" :label="item.value">
                  {{ item.text }}
                </fh-checkbox>
              </fh-checkbox-group>
            </fh-form-item>
            <fh-form-item :label="t('trans0765')">
              <fh-checkbox-group v-model="wan.wlan24g">
                <fh-checkbox v-for="item in wlan24gOptions" :key="item.value" :label="item.value">
                  {{ item.text }}
                </fh-checkbox>
              </fh-checkbox-group>
            </fh-form-item>
            <fh-form-item :label="t('trans0766')">
              <fh-checkbox-group v-model="wan.wlan5g">
                <fh-checkbox v-for="item in wlan5gOptions" :key="item.value" :label="item.value">
                  {{ item.text }}
                </fh-checkbox>
              </fh-checkbox-group>
            </fh-form-item>
          </template>
          <template v-if="isRouter">
            <fh-form-item :label="t('trans0770')">
              <fh-radio-group v-model="wan.protocol">
                <fh-radio v-for="item in ipOptions" :key="item.value" :label="item.value">
                  {{ item.text }}
                </fh-radio>
              </fh-radio-group>
            </fh-form-item>
            <fh-form-item :label="t('trans0482')" prop="mtu">
              <fh-input v-model="wan.mtu"></fh-input>
              <template #extra>{{ getMtuTips().tips }}</template>
            </fh-form-item>
            <fh-form-item :label="t('trans0778')" label-position="left" v-if="isHideEnableNat">
              <fh-checkbox v-model="wan.enableNat" />
            </fh-form-item>
          </template>
          <fh-form-item :label="t('trans0777')" v-if="isShowMultiVlanId" prop="multiVlanId">
            <fh-input v-model="wan.multiVlanId"></fh-input>
            <template #extra>{{ rangeTips(t('trans0777'), 1, 4094) }}</template>
          </fh-form-item>
          <fh-form-item :label="t('trans0771')">
            <fh-select v-model="wan.vlan.mode" :options="vlanModeOptions"></fh-select>
          </fh-form-item>
          <template v-if="isVlanModeTag">
            <fh-form-item :label="t('trans0775')" prop="vlan.id">
              <fh-input v-model="wan.vlan.id"></fh-input>
              <template #extra>{{ rangeTips(t('trans0775'), 1, 4094) }}</template>
            </fh-form-item>
            <fh-form-item :label="t('trans0776')">
              <fh-select v-model="wan.vlan.p8021" :options="p8021Options(7)"></fh-select>
            </fh-form-item>
          </template>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="save" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </div>
        <div class="form__col">
          <div v-if="isPppoe">
            <fh-form-item :label="$t('trans0086')" prop="ppp.user">
              <fh-input v-model="wan.ppp.user" maxlength="64"> </fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0087')" prop="ppp.pwd">
              <fh-input type="password" v-model="wan.ppp.pwd" show-password> </fh-input>
            </fh-form-item>
            <fh-form-item :label="t('trans0790')" label-position="left">
              <fh-checkbox v-model="wan.ppp.enableRouterBridge" />
            </fh-form-item>
          </div>
          <div v-if="isIpv4">
            <template v-if="isStatic">
              <fh-form-item
                :label="format($t('trans0598'), [$t('trans0456')])"
                prop="ipv4.static.ip"
                ref="ipRef"
              >
                <fh-input v-model="wan.ipv4.static.ip" @blur="ipChange"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0459')" prop="ipv4.static.mask" ref="maskRef">
                <fh-input v-model="wan.ipv4.static.mask" @blur="maskChange"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0548')" prop="ipv4.static.gateway" ref="gatewayRef">
                <fh-input v-model="wan.ipv4.static.gateway"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0496')" prop="ipv4.static.dns1">
                <fh-input v-model="wan.ipv4.static.dns1" @change="changeDns1"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0497')" prop="ipv4.static.dns2" ref="dns2Ref">
                <fh-input v-model="wan.ipv4.static.dns2"></fh-input>
              </fh-form-item>
            </template>
          </div>
          <div v-if="isIpv6">
            <fh-form-item :label="t('trans0779')" label-position="left" v-if="!isStatic">
              <fh-checkbox v-model="wan.ipv6.isSlaac" />
            </fh-form-item>
            <template v-if="isStatic">
              <fh-form-item
                :label="format($t('trans0598'), [$t('trans0457')])"
                prop="ipv6.static.ip"
              >
                <fh-input v-model="wan.ipv6.static.ip"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0599')" prop="ipv6.static.gateway">
                <fh-input v-model="wan.ipv6.static.gateway"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0596')" prop="ipv6.static.prefix">
                <fh-input v-model="wan.ipv6.static.prefix"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0496')" prop="ipv6.static.dns1">
                <fh-input v-model="wan.ipv6.static.dns1" @change="changeIpv6Dns1"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0497')" prop="ipv6.static.dns2" ref="ipv6Dns2Ref">
                <fh-input v-model="wan.ipv6.static.dns2"></fh-input>
              </fh-form-item>
            </template>
            <fh-form-item :label="t('trans0782')" label-position="left">
              <fh-checkbox v-model="wan.ipv6.pd.enable" />
            </fh-form-item>
            <template v-if="isIpv6PdEnable">
              <fh-form-item :label="t('trans0783')">
                <fh-radio-group v-model="wan.ipv6.pd.mode">
                  <fh-radio v-for="item in prefixModeOptions" :key="item.value" :label="item.value">
                    {{ item.text }}
                  </fh-radio>
                </fh-radio-group>
              </fh-form-item>
              <template v-if="isIpv6PdModeManually">
                <fh-form-item :label="$t('trans0784')" prop="ipv6.pd.address">
                  <fh-input v-model="wan.ipv6.pd.address"></fh-input>
                </fh-form-item>
                <fh-form-item :label="$t('trans0785')" prop="ipv6.pd.primaryTime">
                  <fh-input v-model="wan.ipv6.pd.primaryTime"></fh-input>
                </fh-form-item>
                <fh-form-item :label="$t('trans0461')" prop="ipv6.pd.leaseTime">
                  <fh-input v-model="wan.ipv6.pd.leaseTime"></fh-input>
                </fh-form-item>
              </template>
            </template>
          </div>
        </div>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IP, VlanMode, ModalType } from '@/util/constant'
import {
  format,
  isIP,
  isMulticast,
  isLoopback,
  isValidDns,
  isValidMask,
  isValidNameEx,
  validationCharacterRange,
  isValidIpv6AddrExtra,
  isValidIpv6Dns,
  getIpBefore,
  isNetworkIP,
  isBoardcastIP,
  isValidGatewayIP,
  isValidLength,
  isValidSymbol,
  specialChar,
  isValidInteger,
} from '@/util/tool'
import { useDataClean } from '@/hooks/data-clean'
import { getLan, getWan, addWan, editWan, deleteWan } from '@/http/api'

defineOptions({
  name: 'WanPage',
})
enum ServiceType {
  TR069 = 'TR069',
  INTERNET = 'INTERNET',
  TR069_INTERNET = 'TR069_INTERNET',
  IPTV = 'IPTV',
  VOICE = 'VOICE',
  VOICE_INTERNET = 'VOICE_INTERNET',
  OTHER = 'OTHER',
}
enum NetType {
  dhcp = 'dhcp',
  static = 'static',
  pppoe = 'pppoe',
}
enum PrefixMode {
  auto = 'auto',
  manually = 'manually',
}
enum WanMode {
  router = 'router',
  bridge = 'bridge',
}

const { convertBooleanStatus } = useDataClean()
const { t } = useI18n()
const ipRef = ref(null)
const maskRef = ref(null)
const gatewayRef = ref(null)
const dns2Ref = ref(null)
const ipv6Dns2Ref = ref(null)
const wanRef = ref(null)
const modalType = ref(ModalType.add)
const lanOptions = [
  {
    value: 'LAN1',
    text: 'LAN1',
  },
  {
    value: 'LAN2',
    text: 'LAN2',
  },
  {
    value: 'LAN3',
    text: 'LAN3',
  },
  {
    value: 'LAN4',
    text: 'LAN4',
  },
]
const wlan24gOptions = [
  {
    value: 'SSID1',
    text: 'SSID1',
  },
  {
    value: 'SSID2',
    text: 'SSID2',
  },
  {
    value: 'SSID3',
    text: 'SSID3',
  },
  {
    value: 'SSID4',
    text: 'SSID4',
  },
]
const wlan5gOptions = [
  {
    value: 'SSIDAC1',
    text: 'SSIDAC1',
  },
  {
    value: 'SSIDAC2',
    text: 'SSIDAC2',
  },
  {
    value: 'SSIDAC3',
    text: 'SSIDAC3',
  },
  {
    value: 'SSIDAC4',
    text: 'SSIDAC4',
  },
]
const ipOptions = [
  {
    value: IP.IPv4,
    text: t('trans0456'),
  },
  {
    value: IP.IPv6,
    text: t('trans0457'),
  },
  {
    value: IP.mix,
    text: t('trans0605'),
  },
]
const wanModeOptions = [
  {
    value: WanMode.router,
    text: t('trans0069'),
  },
  {
    value: WanMode.bridge,
    text: t('trans0083'),
  },
]
const netTypesOptions = [
  {
    value: NetType.dhcp,
    text: t('trans0082'),
  },
  {
    value: NetType.static,
    text: t('trans0084'),
  },
  {
    value: NetType.pppoe,
    text: t('trans0081'),
  },
]
const vlanModeOptions = [
  {
    value: VlanMode.Tag,
    text: t('trans0772'),
  },
  {
    value: VlanMode.Untag,
    text: t('trans0773'),
  },
  {
    value: VlanMode.Transparent,
    text: t('trans0774'),
  },
]
const prefixModeOptions = [
  {
    value: PrefixMode.auto,
    text: t('trans0487'),
  },
  {
    value: PrefixMode.manually,
    text: t('trans0486'),
  },
]
const MtuRange = {
  ipAndIpv4: [576, 1500],
  ipAndMix: [1280, 1500],
  pppAndIpv4: [576, 1492],
  pppAndMix: [1280, 1492],
}
const wanInitial = () => ({
  id: '',
  enable: true,
  serviceType: ServiceType.INTERNET,
  lan: [],
  wlan24g: [],
  wlan5g: [],
  vlan: {
    mode: VlanMode.Tag,
    id: '',
    p8021: '0',
  },
  protocol: IP.IPv4,
  multiVlanId: '',
  mtu: '1500',
  enableNat: false,
  wanMode: WanMode.router,
  netType: NetType.dhcp,
  ppp: {
    user: '',
    pwd: '',
    enableRouterBridge: false,
  },
  ipv4: {
    static: {
      ip: '',
      mask: '',
      gateway: '',
      dns1: '',
      dns2: '',
    },
  },
  ipv6: {
    isSlaac: false,
    pd: {
      enable: false,
      mode: PrefixMode.auto,
      address: '',
      primaryTime: '',
      leaseTime: '',
    },
    static: {
      ip: '',
      gateway: '',
      prefix: '',
      dns1: '',
      dns2: '',
    },
  },
})
const wan = reactive(wanInitial())
const wanOptions = reactive([])
const wanList = reactive([])

const isRouter = computed(() => wan.wanMode === WanMode.router)
const isBridge = computed(() => wan.wanMode === WanMode.bridge)
const isIpMix = computed(() => wan.protocol === IP.mix)
const isIpv4 = computed(() => wan.protocol === IP.IPv4 || isIpMix.value)
const isIpv6 = computed(() => wan.protocol === IP.IPv6 || isIpMix.value)
const isStatic = computed(() => wan.netType === NetType.static)
const isPppoe = computed(() => wan.netType === NetType.pppoe)
const isIpv6PdEnable = computed(() => wan.ipv6.pd.enable)
const isVlanModeTag = computed(() => wan.vlan.mode === VlanMode.Tag)
const isIpv6PdModeManually = computed(() => wan.ipv6.pd.mode === PrefixMode.manually)
const isShowMultiVlanId = computed(
  () => wan.serviceType === ServiceType.IPTV || wan.serviceType === ServiceType.OTHER,
)
const isHidePortBinding = computed(
  () => !(wan.serviceType === ServiceType.TR069 || wan.serviceType === ServiceType.VOICE),
)
const isHideEnableNat = computed(
  () => !(wan.serviceType === ServiceType.TR069 || wan.serviceType === ServiceType.VOICE),
)
const serviceTypeOptions = computed(() => {
  if (isRouter.value) {
    return [
      {
        value: ServiceType.TR069,
        text: 'TR069',
      },
      {
        value: ServiceType.INTERNET,
        text: 'INTERNET',
      },
      {
        value: ServiceType.TR069_INTERNET,
        text: 'TR069_INTERNET',
      },
      {
        value: ServiceType.IPTV,
        text: 'IPTV',
      },
      {
        value: ServiceType.VOICE,
        text: 'VOICE',
      },
      {
        value: ServiceType.VOICE_INTERNET,
        text: 'VOICE_INTERNET',
      },
      {
        value: ServiceType.OTHER,
        text: 'OTHER',
      },
    ]
  } else {
    return [
      {
        value: ServiceType.INTERNET,
        text: 'INTERNET',
      },
      {
        value: ServiceType.IPTV,
        text: 'IPTV',
      },
      {
        value: ServiceType.OTHER,
        text: 'OTHER',
      },
    ]
  }
})
const isAdd = computed(() => {
  return modalType.value === ModalType.add
})
const isEdit = computed(() => {
  return modalType.value === ModalType.edit
})
const isShowWanDel = computed(() => wanList.length > 1)

const isGatewaySameWithIp = (gateway, ip) => !gateway || !ip || gateway !== ip
const isGatewaySameSegmentWithIp = (gateway, ip) =>
  !gateway || !ip || getIpBefore(gateway) === getIpBefore(ip)
const validateSameDns = (dns1, dns2) => !(dns1 && dns2 && dns1 === dns2)
const ipChange = () => {
  if (!ipRef.value?.validate()) {
    return
  }
  if (wan.ipv4.static.gateway) {
    gatewayRef.value?.validate()
  }
}
const maskChange = () => {
  if (!maskRef.value?.validate()) {
    return
  }
  if (wan.ipv4.static.ip) {
    ipRef.value?.validate()
  }
  if (wan.ipv4.static.gateway) {
    gatewayRef.value?.validate()
  }
}
const changeDns1 = () => {
  dns2Ref.value?.extraValidate(
    () => validateSameDns(wan.ipv4.static.dns1, wan.ipv4.static.dns2),
    t('trans0637'),
  )
}
const changeIpv6Dns1 = () => {
  ipv6Dns2Ref.value?.extraValidate(
    () => validateSameDns(wan.ipv6.static.dns1, wan.ipv6.static.dns2),
    t('trans0637'),
  )
}
const getMtuTips = () => {
  if (!isPppoe.value && wan.protocol === IP.IPv4) {
    return {
      tips: rangeTips(t('trans0482'), MtuRange.ipAndIpv4[0], MtuRange.ipAndIpv4[1]),
      rule: isValidInteger(wan.mtu, MtuRange.ipAndIpv4[0], MtuRange.ipAndIpv4[1]),
      ruleMsg: format(t('trans0388'), [
        t('trans0482'),
        MtuRange.ipAndIpv4[0],
        MtuRange.ipAndIpv4[1],
      ]),
    }
  }
  if (!isPppoe.value && isIpv6.value) {
    return {
      tips: rangeTips(t('trans0482'), MtuRange.ipAndMix[0], MtuRange.ipAndMix[1]),
      rule: isValidInteger(wan.mtu, MtuRange.ipAndMix[0], MtuRange.ipAndMix[1]),
      ruleMsg: format(t('trans0388'), [t('trans0482'), MtuRange.ipAndMix[0], MtuRange.ipAndMix[1]]),
    }
  }
  if (isPppoe.value && wan.protocol === IP.IPv4) {
    return {
      tips: rangeTips(t('trans0482'), MtuRange.pppAndIpv4[0], MtuRange.pppAndIpv4[1]),
      rule: isValidInteger(wan.mtu, MtuRange.pppAndIpv4[0], MtuRange.pppAndIpv4[1]),
      ruleMsg: format(t('trans0388'), [
        t('trans0482'),
        MtuRange.pppAndIpv4[0],
        MtuRange.pppAndIpv4[1],
      ]),
    }
  }
  if (isPppoe.value && isIpv6.value) {
    return {
      tips: rangeTips(t('trans0482'), MtuRange.pppAndMix[0], MtuRange.pppAndMix[1]),
      rule: isValidInteger(wan.mtu, MtuRange.pppAndMix[0], MtuRange.pppAndMix[1]),
    }
  }
}
const p8021Options = (max: number) => {
  const arr = []
  for (let i = 0; i <= max; i++) {
    arr.push({ value: i, text: i })
  }
  return arr
}
const rangeTips = (text, min: number, max: number) => {
  return format(t('trans0373'), [text, min, max])
}
const getWanList = () => {
  getWan().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      modalType.value = ModalType.add
      return
    }
    const wanOptionsList = items.map((item) => ({
      value: item.id,
      text: item.id,
    }))
    Object.assign(wanList, items)
    Object.assign(wanOptions, wanOptionsList)
    wan.id = items[0].id
    modalType.value = ModalType.edit
    changeWan()
  })
}
const changeWan = () => {
  const thisWan = wanList.find((item) => item.id === wan.id)
  wan.id = thisWan.id
  wan.enable = convertBooleanStatus(thisWan.enable)
  wan.serviceType = thisWan.serviceType
  wan.lan = thisWan.lan
  wan.wlan24g = thisWan.wlan24g
  wan.wlan5g = thisWan.wlan5g
  wan.vlan.mode = thisWan.vlan.mode
  wan.vlan.id = thisWan.vlan.id
  wan.vlan.p8021 = thisWan.vlan.p8021
  wan.protocol = thisWan.protocol
  wan.multiVlanId = thisWan.multiVlanId
  wan.mtu = thisWan.mtu
  wan.enableNat = convertBooleanStatus(thisWan.enableNat)
  wan.wanMode = thisWan.wanMode
  wan.netType = thisWan.netType
  wan.ppp.user = thisWan.ppp.user
  wan.ppp.pwd = thisWan.ppp.pwd
  wan.ppp.enableRouterBridge = convertBooleanStatus(thisWan.ppp.enableRouterBridge)
  wan.ipv4.static.ip = thisWan.ipv4.static.ip
  wan.ipv4.static.mask = thisWan.ipv4.static.mask
  wan.ipv4.static.gateway = thisWan.ipv4.static.gateway
  wan.ipv4.static.dns1 = thisWan.ipv4.static.dns1
  wan.ipv4.static.dns2 = thisWan.ipv4.static.dns2
  wan.ipv6.isSlaac = convertBooleanStatus(thisWan.ipv6.isSlaac)
  wan.ipv6.pd.enable = convertBooleanStatus(thisWan.ipv6.pd.enable)
  wan.ipv6.pd.mode = thisWan.ipv6.pd.mode
  wan.ipv6.pd.address = thisWan.ipv6.pd.address
  wan.ipv6.pd.primaryTime = thisWan.ipv6.pd.primaryTime
  wan.ipv6.pd.leaseTime = thisWan.ipv6.pd.leaseTime
  wan.ipv6.static.ip = thisWan.ipv6.static.ip
  wan.ipv6.static.gateway = thisWan.ipv6.static.gateway
  wan.ipv6.static.prefix = thisWan.ipv6.static.prefix
  wan.ipv6.static.dns1 = thisWan.ipv6.static.dns1
  wan.ipv6.static.dns2 = thisWan.ipv6.static.dns2
}
const addWanConn = () => {
  modalType.value = ModalType.add
  Object.assign(wan, wanInitial())
  console.log(wan)
}
const cancelWanConnAdd = () => {
  wan.id = wanOptions[0].value
  modalType.value = ModalType.edit
  changeWan()
}
const save = () => {
  if (wanRef.value.validate()) {
    const newWan = {
      enable: convertBooleanStatus(wan.enable),
      serviceType: wan.serviceType,
      lan: wan.lan,
      wlan24g: wan.wlan24g,
      wlan5g: wan.wlan5g,
      vlan: {
        mode: wan.vlan.mode,
        id: wan.vlan.id,
        p8021: wan.vlan.p8021,
      },
      protocol: wan.protocol,
      multiVlanId: wan.multiVlanId,
      mtu: wan.mtu,
      enableNat: convertBooleanStatus(wan.enableNat),
      wanMode: wan.wanMode,
      netType: wan.netType,
      ppp: {
        user: wan.ppp.user,
        pwd: wan.ppp.pwd,
        enableRouterBridge: convertBooleanStatus(wan.ppp.enableRouterBridge),
      },
      ipv4: {
        static: {
          ip: wan.ipv4.static.ip,
          mask: wan.ipv4.static.mask,
          gateway: wan.ipv4.static.gateway,
          dns1: wan.ipv4.static.dns1,
          dns2: wan.ipv4.static.dns2,
        },
      },
      ipv6: {
        isSlaac: convertBooleanStatus(wan.ipv6.isSlaac),
        pd: {
          enable: convertBooleanStatus(wan.ipv6.pd.enable),
          mode: wan.ipv6.pd.mode,
          address: wan.ipv6.pd.address,
          primaryTime: wan.ipv6.pd.primaryTime,
          leaseTime: wan.ipv6.pd.leaseTime,
        },
        static: {
          ip: wan.ipv6.static.ip,
          gateway: wan.ipv6.static.gateway,
          prefix: wan.ipv6.static.prefix,
          dns1: wan.ipv6.static.dns1,
          dns2: wan.ipv6.static.dns2,
        },
      },
    }
    if (isAdd.value) {
      addWan(newWan).then((res) => {
        getWanList()
      })
    }
    if (isEdit.value) {
      newWan.id = wan.id
      editWan(newWan).then((res) => {
        getWanList()
      })
    }
  }
}
const delWanConn = () => {
  deleteWan({ id: wan.id }).then((res) => {
    getWanList()
  })
}

const wanRules = reactive({
  'ipv4.static.ip': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => !isNetworkIP(value, wan.ipv4.static.mask),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => !isBoardcastIP(value, wan.ipv4.static.mask),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => isValidGatewayIP(value, wan.ipv4.static.mask),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    // {
    //   rule: (value) => {
    //     if (!lanIp.value) {
    //       return true
    //     }
    //     const lanIpBefore = getIpBefore(lanIp.value)
    //     const ipBefore = getIpBefore(value)
    //     if (ipBefore === lanIpBefore || lanIp.value === value) {
    //       return false
    //     }
    //     return true
    //   },
    //   message: t('trans0615'),
    // },
  ],
  'ipv4.static.mask': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value),
      message: format(t('trans0566'), [t('trans0459')]),
    },
    {
      rule: (value) => isValidMask(value),
      message: format(t('trans0566'), [t('trans0459')]),
    },
  ],
  'ipv4.static.gateway': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
      message: format(t('trans0566'), [t('trans0548')]),
    },
    {
      rule: (value) => !isNetworkIP(value, wan.ipv4.static.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isBoardcastIP(value, wan.ipv4.static.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => isGatewaySameSegmentWithIp(value, wan.ipv4.static.ip),
      message: t('trans0662'),
    },
    {
      rule: (value) => isGatewaySameWithIp(value, wan.ipv4.static.ip),
      message: t('trans0633'),
    },
  ],
  'ipv4.static.dns1': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value),
      message: format(t('trans0566'), [t('trans0496')]),
    },
    {
      rule: (value) => isValidDns(value),
      message: format(t('trans0566'), [t('trans0496')]),
    },
  ],
  'ipv4.static.dns2': [
    {
      rule: (value) => !value.trim().length || isIP(value),
      message: format(t('trans0566'), [t('trans0497')]),
    },
    {
      rule: (value) => !value.trim().length || isValidDns(value),
      message: format(t('trans0566'), [t('trans0497')]),
    },
    {
      rule: (value) => !value.trim().length || validateSameDns(wan.ipv4.static.dns1, value),
      message: t('trans0637'),
    },
  ],
  'ppp.user': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidNameEx(value),
      message: format(t('trans0566'), [t('trans0086')]),
    },
    {
      rule: (value) => validationCharacterRange(value, 1, 64),
      message: format(t('trans0003'), [t('trans0086'), 1, 64]),
    },
  ],
  'ppp.pwd': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 1, 64),
      message: format(t('trans0003'), [t('trans0087'), 1, 64]),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0087'), format(t('trans0042'), [specialChar])]),
    },
  ],
  'ipv6.static.ip': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => {
        const parts = value.split('/')
        if (parts.length === 2) {
          const ip = parts[0]
          const prefix = parseInt(parts[1])
          if (isIP(ip, IP.IPv6) && isValidIpv6AddrExtra(ip) && prefix >= 0 && prefix <= 128) {
            return true
          }
        }
        return false
      },
      message: t('trans0397'),
    },
  ],
  'ipv6.static.gateway': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value, IP.IPv6),
      message: t('trans0397'),
    },
    {
      rule: (value) => isValidIpv6Dns(value),
      message: t('trans0397'),
    },
  ],
  'ipv6.static.prefix': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => {
        const parts = value.split('/')
        if (parts.length === 2) {
          const ip = parts[0]
          const prefix = parseInt(parts[1])
          if (isIP(ip, IP.IPv6) && isValidIpv6AddrExtra(ip) && prefix >= 0 && prefix <= 128) {
            return true
          }
        }
        return false
      },
      message: t('trans0397'),
    },
  ],
  'ipv6.static.dns1': [
    {
      rule: (value) => value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value, IP.IPv6),
      message: t('trans0397'),
    },
    {
      rule: (value) => isValidIpv6Dns(value),
      message: t('trans0397'),
    },
  ],
  'ipv6.static.dns2': [
    {
      rule: (value) => !value.trim().length || isIP(value, IP.IPv6),
      message: t('trans0397'),
    },
    {
      rule: (value) => !value.trim().length || isValidIpv6Dns(value),
      message: format(t('trans0566'), [t('trans0497')]),
    },
    {
      rule: (value) => !value.trim().length || validateSameDns(wan.ipv6.static.dns1, value),
      message: t('trans0637'),
    },
  ],
  'vlan.id': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 1, 4094),
      message: format(t('trans0388'), [t('trans0775'), 1, 4094]),
    },
  ],
  multiVlanId: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 1, 4094),
      message: format(t('trans0388'), [t('trans0777'), 1, 4094]),
    },
  ],
  mtu: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: () => getMtuTips().rule,
      message: format(t('trans0398'), [t('trans0482')]),
    },
  ],
  'ipv6.pd.address': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'ipv6.pd.primaryTime': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'ipv6.pd.leaseTime': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
})
onMounted(() => {
  getWanList()
})
</script>

<style lang="less">
.wan-page {
  .form {
    width: 100%;
    display: flex;
  }
  .form__col {
    width: 350px;
    margin-right: 20px;
  }
}
</style>
