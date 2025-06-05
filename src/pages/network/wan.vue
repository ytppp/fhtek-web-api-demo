<template>
  <div class="page wan-page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0014') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__operation">
        <fh-button size="small" @click="addWanConn" v-if="isEdit">
          {{ $t('trans0760') }}
        </fh-button>
        <fh-button size="small" @click="cancelWanConnAdd" v-if="isAdd && wanList.length">
          {{ $t('trans0020') }}
        </fh-button>
      </div>
      <fh-form class="form wan-form" ref="wanRef" :model="wan" :rules="wanRules">
        <div class="wan-form__col">
          <fh-form-item :label="t('trans0140')" v-if="isEdit">
            <fh-select v-model="wan.id" :options="wanOptions" @change="changeWan"></fh-select>
            <template #extra>
              <fh-button @click="delWanConn" size="small">
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
          <fh-form-item :label="t('trans0763')" prop="serviceType">
            <fh-select v-model="wan.serviceType" :options="serviceTypeOptions"></fh-select>
          </fh-form-item>
          <fh-form-item :label="t('trans0080')" v-if="isRouter" prop="netType">
            <fh-select
              @change="changeNetType"
              v-model="wan.netType"
              :options="netTypesOptions"
            ></fh-select>
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
            <fh-form-item :label="t('trans0092')" prop="mtu">
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
        <div class="wan-form__col">
          <div class="wan-form__box" v-if="isPppoe">
            <span class="wan-form__titile">{{ $t('trans0081') }}</span>
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
          <template v-if="isIpv4">
            <div class="wan-form__box" v-if="isStatic">
              <span class="wan-form__titile">{{ $t('trans0456') }}</span>
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
            </div>
          </template>
          <div class="wan-form__box" v-if="isIpv6">
            <span class="wan-form__titile">{{ $t('trans0457') }}</span>
            <fh-form-item :label="t('trans0779')" label-position="left" v-if="!isStatic">
              <fh-checkbox v-model="wan.ipv6.isSlaac" />
            </fh-form-item>
            <template v-if="isStatic">
              <fh-form-item
                :label="format($t('trans0598'), [$t('trans0457')])"
                prop="ipv6.static.ip"
              >
                <fh-input
                  :placeholder="`${format($t('trans0598'), [$t('trans0457')])}/${$t('trans0477')}`"
                  v-model="wan.ipv6.static.ip"
                ></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0599')" prop="ipv6.static.gateway">
                <fh-input v-model="wan.ipv6.static.gateway"></fh-input>
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
                <fh-radio-group v-model="wan.ipv6.pd.mode" :disabled="isStatic">
                  <fh-radio v-for="item in prefixModeOptions" :key="item.value" :label="item.value">
                    {{ item.text }}
                  </fh-radio>
                </fh-radio-group>
              </fh-form-item>
              <template v-if="isIpv6PdModeManually">
                <fh-form-item :label="$t('trans0784')" prop="ipv6.pd.address">
                  <fh-input v-model="wan.ipv6.pd.address"></fh-input>
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
import { ref, computed, reactive, onMounted, watch, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { IP, VlanMode, ModalType, WanMode } from '@/util/constant'
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

const { convertBooleanStatus } = useDataClean()
const { t } = useI18n()
const ipRef = ref(null)
const maskRef = ref(null)
const gatewayRef = ref(null)
const dns2Ref = ref(null)
const ipv6Dns2Ref = ref(null)
const wanRef = ref(null)
const modalType = ref(ModalType.add)
const lanIp = ref('')

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
    value: NetType.pppoe,
    text: t('trans0081'),
  },
  {
    value: NetType.static,
    text: t('trans0084'),
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
const serviceTypesInit = [
  {
    value: ServiceType.TR069,
    text: 'TR069',
    show: true,
  },
  {
    value: ServiceType.INTERNET,
    text: 'INTERNET',
    show: true,
  },
  {
    value: ServiceType.TR069_INTERNET,
    text: 'TR069_INTERNET',
    show: true,
  },
  {
    value: ServiceType.IPTV,
    text: 'IPTV',
    show: true,
  },
  {
    value: ServiceType.VOICE,
    text: 'VOICE',
    show: true,
  },
  {
    value: ServiceType.VOICE_INTERNET,
    text: 'VOICE_INTERNET',
    show: true,
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
  mtu: '',
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
    },
    static: {
      ip: '',
      gateway: '',
      dns1: '',
      dns2: '',
    },
  },
})
const wan = reactive(wanInitial())
let wanOptions: any[] = []
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
const isShowMultiVlanId = computed(() => wan.serviceType === ServiceType.IPTV)
const isHidePortBinding = computed(
  () => !(wan.serviceType === ServiceType.TR069 || wan.serviceType === ServiceType.VOICE),
)
const isHideEnableNat = computed(
  () => !(wan.serviceType === ServiceType.TR069 || wan.serviceType === ServiceType.VOICE),
)
const serviceTypeOptions = computed(() => {
  if (isBridge.value) {
    serviceTypesInit.forEach((item) => {
      item.show = false
      if (item.value === ServiceType.INTERNET || item.value === ServiceType.IPTV) {
        item.show = true
      }
    })
  }
  if (isRouter.value) {
    serviceTypesInit.forEach((item) => {
      item.show = true
    })
  }
  return serviceTypesInit.filter((item) => item.show === true)
})
const isAdd = computed(() => {
  return modalType.value === ModalType.add
})
const isEdit = computed(() => {
  return modalType.value === ModalType.edit
})
watch(
  () => wan.wanMode,
  () => {
    wan.serviceType = serviceTypeOptions.value[0].value
  },
)

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
      tips: rangeTips(t('trans0092'), MtuRange.ipAndIpv4[0], MtuRange.ipAndIpv4[1]),
      rule: isValidInteger(wan.mtu, MtuRange.ipAndIpv4[0], MtuRange.ipAndIpv4[1]),
      ruleMsg: format(t('trans0388'), [
        t('trans0092'),
        MtuRange.ipAndIpv4[0],
        MtuRange.ipAndIpv4[1],
      ]),
    }
  }
  if (!isPppoe.value && isIpv6.value) {
    return {
      tips: rangeTips(t('trans0092'), MtuRange.ipAndMix[0], MtuRange.ipAndMix[1]),
      rule: isValidInteger(wan.mtu, MtuRange.ipAndMix[0], MtuRange.ipAndMix[1]),
      ruleMsg: format(t('trans0388'), [t('trans0092'), MtuRange.ipAndMix[0], MtuRange.ipAndMix[1]]),
    }
  }
  if (isPppoe.value && wan.protocol === IP.IPv4) {
    return {
      tips: rangeTips(t('trans0092'), MtuRange.pppAndIpv4[0], MtuRange.pppAndIpv4[1]),
      rule: isValidInteger(wan.mtu, MtuRange.pppAndIpv4[0], MtuRange.pppAndIpv4[1]),
      ruleMsg: format(t('trans0388'), [
        t('trans0092'),
        MtuRange.pppAndIpv4[0],
        MtuRange.pppAndIpv4[1],
      ]),
    }
  }
  if (isPppoe.value && isIpv6.value) {
    return {
      tips: rangeTips(t('trans0092'), MtuRange.pppAndMix[0], MtuRange.pppAndMix[1]),
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
const rangeTips = (text: string, min: number, max: number) => {
  return format(t('trans0373'), [text, min, max])
}
const getWanList = (id?: string) => {
  getWan().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      modalType.value = ModalType.add
      // Object.assign(wanList, [])
      wanList.length = 0
      return
    }
    wanOptions = items.map((item) => ({
      value: item.id,
      text: item.id,
    }))
    Object.assign(wanList, items)
    wan.id = id ? id : items[items.length - 1].id
    modalType.value = ModalType.edit
    changeWan()
  })
}
const changeWan = () => {
  wanRef.value.clearValidate()
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
  wan.ipv6.static.ip = thisWan.ipv6.static.ip
  wan.ipv6.static.gateway = thisWan.ipv6.static.gateway
  wan.ipv6.static.dns1 = thisWan.ipv6.static.dns1
  wan.ipv6.static.dns2 = thisWan.ipv6.static.dns2
}
const addWanConn = () => {
  modalType.value = ModalType.add
  Object.assign(wan, wanInitial())
  wanRef.value.clearValidate()
}
const cancelWanConnAdd = () => {
  wan.id = wanOptions[0].value
  modalType.value = ModalType.edit
  wanRef.value.clearValidate()
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
        },
        static: {
          ip: wan.ipv6.static.ip,
          gateway: wan.ipv6.static.gateway,
          dns1: wan.ipv6.static.dns1,
          dns2: wan.ipv6.static.dns2,
        },
      },
    }
    if (isAdd.value) {
      addWan(newWan).then(() => {
        getWanList()
      })
    }
    if (isEdit.value) {
      newWan.id = wan.id
      editWan(newWan).then(() => {
        getWanList(newWan.id)
      })
    }
  }
}
const delWanConn = () => {
  deleteWan({ id: wan.id }).then(() => {
    getWanList()
  })
}
const changeNetType = () => {
  if (isStatic.value) {
    wan.ipv6.pd.mode = PrefixMode.manually
  }
}
const getLanData = () => {
  getLan().then(({ data }) => {
    const { lan } = data
    const { ip } = lan
    lanIp.value = ip
  })
}

const wanRules = reactive({
  serviceType: [
    {
      rule: (value) => value,
      message: format(t('trans0677'), [t('trans0763')]),
    },
    {
      rule: (value) => {
        if (value === ServiceType.TR069 || value === ServiceType.TR069_INTERNET) {
          if (isAdd.value) {
            return !wanList.some(
              (item) =>
                item.serviceType === ServiceType.TR069 ||
                item.serviceType === ServiceType.TR069_INTERNET,
            )
          }
          if (isEdit.value) {
            return !wanList
              .filter((item) => item.id !== wan.id)
              .some(
                (item) =>
                  item.serviceType === ServiceType.TR069 ||
                  item.serviceType === ServiceType.TR069_INTERNET,
              )
          }
        }
        if (value === ServiceType.VOICE || value === ServiceType.VOICE_INTERNET) {
          if (isAdd.value) {
            return !wanList.some(
              (item) =>
                item.serviceType === ServiceType.VOICE ||
                item.serviceType === ServiceType.VOICE_INTERNET,
            )
          }
          if (isEdit.value) {
            return !wanList
              .filter((item) => item.id !== wan.id)
              .some(
                (item) =>
                  item.serviceType === ServiceType.VOICE ||
                  item.serviceType === ServiceType.VOICE_INTERNET,
              )
          }
        }
        return true
      },
      message: format(t('trans0678'), [t('trans0763')]),
    },
  ],
  netType: [
    {
      rule: (value) => value,
      message: format(t('trans0677'), [t('trans0080')]),
    },
  ],
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
    {
      rule: (value) => {
        if (!lanIp.value) {
          return true
        }
        const lanIpBefore = getIpBefore(lanIp.value)
        const ipBefore = getIpBefore(value)
        if (ipBefore === lanIpBefore || lanIp.value === value) {
          return false
        }
        return true
      },
      message: t('trans0615'),
    },
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
        return isIP(value, IP.IPv6)
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
    {
      rule: (value) => {
        if (isAdd.value) {
          return !wanList.some((item) => item.vlan.id === value)
        }
        if (isEdit.value) {
          return !wanList.some((item) => item.id !== wan.id && item.vlan.id === value)
        }
      },
      message: format(t('trans0678'), [t('trans0775')]),
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
      message: format(t('trans0398'), [t('trans0092')]),
    },
  ],
  'ipv6.pd.address': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
})
onMounted(() => {
  getLanData()
  getWanList()
})
</script>

<style lang="less">
.wan-page {
  .wan-form {
    width: 100%;
    display: flex;
  }
  .wan-form__col {
    width: 350px;
    margin-right: 20px;
  }
  .wan-form__box {
    margin-top: 20px;
    border: 1px dashed #e1e1e1;
    padding: 8px;
    position: relative;
  }
  .wan-form__titile {
    position: absolute;
    top: -6px;
    left: 0px;
    color: #e1e1e1;
  }
}
</style>
