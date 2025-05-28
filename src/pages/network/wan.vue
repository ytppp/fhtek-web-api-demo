<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0014') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="wanRef" :model="wan" :rules="wanRules">
        <fh-form-item>
          <fh-button size="small" @click="addWanConn" v-if="isEdit">
            {{ $t('trans0760') }}
          </fh-button>
          <fh-button size="small" @click="cancelWanConnAdd" v-if="isAdd">
            {{ $t('trans0020') }}
          </fh-button>
        </fh-form-item>
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
          <template v-if="isPppoe">
            <fh-form-item :label="$t('trans0086')">
              <fh-input v-model="wan.ppp.user" maxlength="64"> </fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0087')">
              <fh-input type="password" v-model="wan.ppp.pwd" show-password> </fh-input>
            </fh-form-item>
            <fh-form-item :label="t('trans0790')" label-position="left">
              <fh-checkbox v-model="wan.ppp.enableRouterBridge" />
            </fh-form-item>
          </template>
          <template v-if="isIpv4">
            <template v-if="isStatic">
              <fh-form-item :label="format($t('trans0598'), [$t('trans0456')])">
                <fh-input v-model="wan.ipv4.static.ip"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0459')">
                <fh-input v-model="wan.ipv4.static.mask"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0548')">
                <fh-input v-model="wan.ipv4.static.gateway"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0496')">
                <fh-input v-model="wan.ipv4.static.dns1"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0497')">
                <fh-input v-model="wan.ipv4.static.dns2"></fh-input>
              </fh-form-item>
            </template>
          </template>
          <template v-if="isIpv6">
            <fh-form-item :label="t('trans0779')" label-position="left" v-if="!isStatic">
              <fh-checkbox v-model="wan.ipv6.isSlaac" />
            </fh-form-item>
            <template v-if="isStatic">
              <fh-form-item :label="format($t('trans0598'), [$t('trans0457')])">
                <fh-input v-model="wan.ipv6.static.ip"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0599')">
                <fh-input v-model="wan.ipv6.static.gateway"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0596')">
                <fh-input v-model="wan.ipv6.static.prefix"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0496')">
                <fh-input v-model="wan.ipv6.static.dns1"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0497')">
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
                <fh-form-item :label="$t('trans0784')">
                  <fh-input v-model="wan.ipv6.pd.address"></fh-input>
                </fh-form-item>
                <fh-form-item :label="$t('trans0785')">
                  <fh-input v-model="wan.ipv6.pd.primaryTime"></fh-input>
                </fh-form-item>
                <fh-form-item :label="$t('trans0461')">
                  <fh-input v-model="wan.ipv6.pd.leaseTime"></fh-input>
                </fh-form-item>
              </template>
            </template>
          </template>
          <fh-form-item :label="t('trans0482')">
            <fh-input v-model="wan.mtu"></fh-input>
            <template #extra>{{ mtuTips }}</template>
          </fh-form-item>
          <fh-form-item :label="t('trans0778')" label-position="left" v-if="isHideEnableNat">
            <fh-checkbox v-model="wan.enableNat" />
          </fh-form-item>
        </template>
        <fh-form-item :label="t('trans0777')" v-if="isShowMultiVlanId">
          <fh-input v-model="wan.multiVlanId"></fh-input>
          <template #extra>{{ rangeTips(1, 4094) }}</template>
        </fh-form-item>
        <fh-form-item :label="t('trans0771')">
          <fh-select v-model="wan.vlan.mode" :options="vlanModeOptions"></fh-select>
        </fh-form-item>
        <template v-if="isVlanModeTag">
          <fh-form-item :label="t('trans0775')">
            <fh-input v-model="wan.vlan.id"></fh-input>
            <template #extra>{{ rangeTips(1, 4094) }}</template>
          </fh-form-item>
          <fh-form-item :label="t('trans0776')">
            <fh-select v-model="wan.vlan.p8021" :options="p8021Options(7)"></fh-select>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @clicl="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IP, VlanMode, ModalType, EnableStatus } from '@/util/constant'
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

const { convertBool } = useDataClean()
const { t } = useI18n()
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
const wanInitial = {
  id: '',
  enable: false,
  serviceType: ServiceType.INTERNET,
  lan: [],
  wlan24g: [],
  wlan5g: [],
  vlan: {
    mode: VlanMode.Untag,
    id: '',
    p8021: '',
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
}
const wan = reactive(wanInitial)
const wanRules = reactive({})
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
const mtuTips = computed(() => {
  const MtuRange = {
    ipAndIpv4: [576, 1500],
    ipAndMix: [1280, 1500],
    pppAndIpv4: [576, 1492],
    pppAndMix: [1280, 1492],
  }
  if (isRouter.value && wan.protocol === IP.IPv4) {
    return rangeTips(MtuRange.ipAndIpv4[0], MtuRange.ipAndIpv4[1])
  }
  if (isRouter.value && isIpv6.value) {
    return rangeTips(MtuRange.ipAndMix[0], MtuRange.ipAndMix[1])
  }
  if (isBridge.value && wan.protocol === IP.IPv4) {
    return rangeTips(MtuRange.pppAndIpv4[0], MtuRange.pppAndIpv4[1])
  }
  if (isBridge.value && isIpv6.value) {
    return rangeTips(MtuRange.pppAndMix[0], MtuRange.pppAndMix[1])
  }
})
const isAdd = computed(() => {
  return modalType.value === ModalType.add
})
const isEdit = computed(() => {
  return modalType.value === ModalType.edit
})
const isShowWanDel = computed(() => wanList.length > 1)

const p8021Options = (max: number) => {
  const arr = []
  for (let i = 1; i <= max; i++) {
    arr.push({ value: i, text: i })
  }
  return arr
}
const rangeTips = (min: number, max: number) => {
  return format(t('trans0611'), [min, max])
}
const getWanList = () => {
  getWan().then(({ data }) => {
    const { items } = data
    if (iems.length === 0) {
      return
    }
    const wanOptionsList = items.map((item) => ({
      value: item.id,
      text: item.id,
    }))
    Object.assign(wanList, items)
    Object.assign(wanOptions, wanOptionsList)
    wan.id = wanOptions.value[0].id
    modalType.value = ModalType.edit
    changeWan()
  })
}
const changeWan = () => {
  const thisWan = wanList.find((item) => item.id === wan.id)
  wan.id = thisWan.id
  wan.enable = convertBool(thisWan.enable)
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
  wan.enableNat = convertBool(thisWan.enableNat)
  wan.wanMode = thisWan.wanMode
  wan.netType = thisWan.netType
  wan.ppp.user = thisWan.ppp.user
  wan.ppp.pwd = thisWan.ppp.pwd
  wan.ppp.enableRouterBridge = convertBool(thisWan.ppp.enableRouterBridge)
  wan.ipv4.static.ip = thisWan.ipv4.static.ip
  wan.ipv4.static.mask = thisWan.ipv4.static.mask
  wan.ipv4.static.gateway = thisWan.ipv4.static.gateway
  wan.ipv4.static.dns1 = thisWan.ipv4.static.dns1
  wan.ipv4.static.dns2 = thisWan.ipv4.static.dns2
  wan.ipv6.isSlaac = convertBool(thisWan.ipv6.isSlaac)
  wan.ipv6.pd.enable = convertBool(thisWan.ipv6.pd.enable)
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
  Object.assign(wan, wanInitial)
}
const cancelWanConnAdd = () => {
  wan.id = wanOptions.value[0].id
  modalType.value = ModalType.edit
  changeWan()
}
const save = () => {
  if (wanRef.value.validate()) {
    const newWan = {
      enable: convertBool(wan.enable),
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
      enableNat: convertBool(wan.enableNat),
      wanMode: wan.wanMode,
      netType: wan.netType,
      ppp: {
        user: wan.ppp.user,
        pwd: wan.ppp.pwd,
        enableRouterBridge: convertBool(wan.ppp.enableRouterBridge),
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
        isSlaac: convertBool(wan.ipv6.isSlaac),
        pd: {
          enable: convertBool(wan.ipv6.pd.enable),
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
  deleteWan(wan.id)
}
onMounted(() => {
  getWanList()
})
</script>
