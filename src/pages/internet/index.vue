<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0014') }}</h1>
    </div>
    <div class="page__content page__content--padding-small">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0456') }}</h2>
      </div>
      <fh-form class="form form--padding" ref="ipv4FormRef" :model="ipv4" :rules="ipv4Rules">
        <fh-form-item :label="t('trans0080')">
          <fh-select v-model="ipv4.netType" :options="netTypes"></fh-select>
        </fh-form-item>
        <template v-if="isStatic">
          <fh-form-item :label="$t('trans0179')" prop="static.ip" ref="ipRef">
            <fh-input v-model="ipv4.static.ip" @blur="ipChange"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0459')" prop="static.mask" ref="maskRef">
            <fh-input v-model="ipv4.static.mask" @blur="maskChange"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0548')" prop="static.gateway" ref="gatewayRef">
            <fh-input v-model="ipv4.static.gateway"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0496')" prop="static.dns1">
            <fh-input v-model="ipv4.static.dns1" @blur="changeDns1"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0497')" prop="static.dns2" ref="dns2Ref">
            <fh-input v-model="ipv4.static.dns2"></fh-input>
          </fh-form-item>
        </template>
        <template v-if="isPppoe">
          <fh-form-item :label="$t('trans0086')" prop="pppoe.username">
            <fh-input v-model="ipv4.pppoe.username" maxlength="64"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0087')" prop="pppoe.password">
            <fh-input type="password" v-model="ipv4.pppoe.password" show-password> </fh-input>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="saveIpv4" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0457') }}</h2>
      </div>
      <fh-form class="form form--padding" ref="ipv6FormRef" :model="ipv6" :rules="ipv6Rules">
        <fh-form-item :label="$t('trans0457')" label-position="left">
          <fh-switch
            v-model="ipv6.enable"
            :active-value="EnableStatusIpv6.yes"
            :inactive-value="EnableStatusIpv6.no"
          ></fh-switch>
        </fh-form-item>
        <template v-if="isIpv6Enable">
          <fh-form-item :label="t('trans0080')">
            <fh-select v-model="ipv6.netType" :options="ipv6NetTypes"></fh-select>
          </fh-form-item>
          <template v-if="isIpv6Static">
            <fh-form-item :label="$t('trans0457')" prop="static.ip">
              <fh-input v-model="ipv6.static.ip"></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0599')" prop="static.gateway">
              <fh-input v-model="ipv6.static.gateway"></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0596')" prop="static.prefix">
              <fh-input v-model="ipv6.static.prefix"></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0496')" prop="static.dns1">
              <fh-input v-model="ipv6.static.dns1" @blur="changeIpv6Dns1"></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0497')" prop="static.dns2" ref="ipv6Dns2Ref">
              <fh-input v-model="ipv6.static.dns2"></fh-input>
            </fh-form-item>
          </template>
          <template v-if="isIpv6Pppoe">
            <fh-form-item :label="$t('trans0086')" prop="pppoe.username">
              <fh-input v-model="ipv6.pppoe.username" maxlength="64"> </fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0087')" prop="pppoe.password">
              <fh-input type="password" v-model="ipv6.pppoe.password" show-password> </fh-input>
            </fh-form-item>
          </template>
          <template v-if="isIpv6dhcp">
            <fh-form-item label="地址请求模式">
              <fh-select v-model="ipv6.dhcp.reqAddress" :options="reqAddressTypes"></fh-select>
            </fh-form-item>
            <fh-form-item label="前缀请求模式">
              <fh-select v-model="ipv6.dhcp.reqPrefix" :options="reqPrefixTypes"></fh-select>
            </fh-form-item>
          </template>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="saveIpv6" block>
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
import { IP } from '@/util/constant'
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
import { getLan, getWan, setWan, getIpv6Wan, setIpv6Wan } from '@/http/api'

defineOptions({
  name: 'InternetPage',
})

enum EnableStatus {
  yes = '1',
  no = '0',
}
enum EnableStatusIpv6 {
  yes = 1,
  no = 0,
}
enum NetType {
  pppoe = 'pppoe',
  dhcp = 'dhcp',
  dhcpv6 = 'dhcpv6',
  static = 'static',
  bridge = 'bridge',
}
enum ReqAddress {
  try = 'try',
  auto = 'auto',
  none = 'none',
}
enum ReqPrefix {
  auto = 'auto',
  none = 'no',
}

const { t } = useI18n()
const ipv4FormRef = ref(null)
const ipv6FormRef = ref(null)
const ipRef = ref(null)
const maskRef = ref(null)
const gatewayRef = ref(null)
const dns2Ref = ref(null)
const ipv6Dns2Ref = ref(null)
const lanIp = ref('')
const netTypes = [
  {
    value: NetType.pppoe,
    text: t('trans0081'),
  },
  {
    value: NetType.dhcp,
    text: t('trans0082'),
  },
  {
    value: NetType.static,
    text: t('trans0084'),
  },
]
const ipv6NetTypes = [
  {
    value: NetType.pppoe,
    text: t('trans0081'),
  },
  {
    value: NetType.dhcpv6,
    text: t('trans0082'),
  },
  {
    value: NetType.static,
    text: t('trans0084'),
  },
]
const reqAddressTypes = [
  {
    value: ReqAddress.try,
    text: 'try',
  },
  {
    value: ReqAddress.auto,
    text: 'auto',
  },
  {
    value: ReqAddress.none,
    text: 'none',
  },
]
const reqPrefixTypes = [
  {
    value: ReqPrefix.auto,
    text: 'auto',
  },
  {
    value: ReqPrefix.none,
    text: 'none',
  },
]
const ipv4 = reactive({
  enable: EnableStatus.yes,
  netType: NetType.static,
  static: {
    ip: '',
    mask: '',
    gateway: '',
    dns1: '',
    dns2: '',
  },
  pppoe: {
    username: '',
    password: '',
  },
})
const ipv6 = reactive({
  enable: EnableStatusIpv6.yes,
  netType: NetType.static,
  static: {
    ip: '',
    gateway: '',
    prefix: '',
    dns1: '',
    dns2: '',
  },
  pppoe: {
    username: '',
    password: '',
  },
  dhcp: {
    reqAddress: ReqAddress.try,
    reqPrefix: ReqPrefix.auto,
  },
})
const ipv4Rules = reactive({
  'static.ip': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => !isNetworkIP(value, ipv4.static.mask),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => !isBoardcastIP(value, ipv4.static.mask),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => isValidGatewayIP(value, ipv4.static.mask),
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
  'static.mask': [
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
  'static.gateway': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
      message: format(t('trans0566'), [t('trans0548')]),
    },
    {
      rule: (value) => !isNetworkIP(value, ipv4.static.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isBoardcastIP(value, ipv4.static.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => isGatewaySameSegmentWithIp(value, ipv4.static.ip),
      message: t('trans0662'),
    },
    {
      rule: (value) => isGatewaySameWithIp(value, ipv4.static.ip),
      message: t('trans0633'),
    },
  ],
  'static.dns1': [
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
  'static.dns2': [
    {
      rule: (value) => !value.trim().length || isIP(value),
      message: format(t('trans0566'), [t('trans0497')]),
    },
    {
      rule: (value) => !value.trim().length || isValidDns(value),
      message: format(t('trans0566'), [t('trans0497')]),
    },
    {
      rule: (value) => !value.trim().length || validateSameDns(ipv4.static.dns1, value),
      message: t('trans0637'),
    },
  ],
  'pppoe.username': [
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
  'pppoe.password': [
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
})
const ipv6Rules = reactive({
  'static.ip': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value, IP.IPv6),
      message: t('trans0397'),
    },
    {
      rule: (value) => isValidIpv6AddrExtra(value),
      message: t('trans0397'),
    },
  ],
  'static.gateway': [
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
  'static.prefix': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value, IP.IPv6),
      message: t('trans0397'),
    },
    {
      rule: (value) => isValidIpv6AddrExtra(value),
      message: t('trans0397'),
    },
  ],
  'static.dns1': [
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
  'static.dns2': [
    {
      rule: (value) => !value.trim().length || isIP(value, IP.IPv6),
      message: t('trans0397'),
    },
    {
      rule: (value) => !value.trim().length || isValidIpv6Dns(value),
      message: format(t('trans0566'), [t('trans0497')]),
    },
    {
      rule: (value) => !value.trim().length || validateSameDns(ipv6.static.dns1, value),
      message: t('trans0637'),
    },
  ],
  'pppoe.username': [
    {
      rule: (value) => value || value.trim().length,
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
  'pppoe.password': [
    {
      rule: (value) => value,
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
})

const isStatic = computed(() => ipv4.netType === NetType.static)
const isPppoe = computed(() => ipv4.netType === NetType.pppoe)
const isIpv6Enable = computed(() => ipv6.enable === EnableStatusIpv6.yes)
const isIpv6Static = computed(() => ipv6.netType === NetType.static)
const isIpv6Pppoe = computed(() => ipv6.netType === NetType.pppoe)
const isIpv6dhcp = computed(() => ipv6.netType === NetType.dhcpv6)

function reverseEnum<T extends Record<string, string | number>>(
  enumObj: T,
): { [key: number | string]: string } {
  const reversed: { [key: number | string]: string } = {}
  for (const key in enumObj) {
    if (enumObj.hasOwnProperty(key)) {
      const value = enumObj[key]
      reversed[value] = key
    }
  }
  return reversed
}
const isGatewaySameWithIp = (gateway, ip) => !gateway || !ip || gateway !== ip
const isGatewaySameSegmentWithIp = (gateway, ip) =>
  !gateway || !ip || getIpBefore(gateway) === getIpBefore(ip)
const validateSameDns = (dns1, dns2) => !(dns1 && dns2 && dns1 === dns2)
const ipChange = () => {
  if (!ipRef.value?.validate()) {
    return
  }
  if (ipv4.static.gateway) {
    gatewayRef.value?.validate()
  }
}
const maskChange = () => {
  if (!maskRef.value?.validate()) {
    return
  }
  if (ipv4.static.ip) {
    ipRef.value?.validate()
  }
  if (ipv4.static.gateway) {
    gatewayRef.value?.validate()
  }
}
const changeDns1 = () => {
  dns2Ref.value?.extraValidate(
    () => validateSameDns(ipv4.static.dns1, ipv4.static.dns2),
    t('trans0637'),
  )
}
const changeIpv6Dns1 = () => {
  ipv6Dns2Ref.value?.extraValidate(
    () => validateSameDns(ipv6.static.dns1, ipv6.static.dns2),
    t('trans0637'),
  )
}
function getLanData() {
  getLan().then(({ data }) => {
    const { ip } = data
    lanIp.value = ip
  })
}
function getWanData() {
  getWan().then(({ data }) => {
    const { disabled, wan_proto } = data
    ipv4.enable = disabled
    ipv4.netType = wan_proto
    if (isStatic.value && data.hasOwnProperty(NetType.static)) {
      ipv4.static.ip = data.static.wan_ip || ''
      ipv4.static.mask = data.static.wan_netmask || ''
      ipv4.static.gateway = data.static.wan_gateway || ''
      ipv4.static.dns1 = data.static.wan_dns1 || ''
      ipv4.static.dns2 = data.static.wan_dns2 || ''
    }
    if (isPppoe.value && data.hasOwnProperty(NetType.pppoe)) {
      ipv4.pppoe.username = data.pppoe.username || ''
      ipv4.pppoe.password = data.pppoe.password || ''
    }
  })
}
function getIpv6WanData() {
  getIpv6Wan().then(({ data }) => {
    const { enabled, proto } = data
    ipv6.enable = enabled
    ipv6.netType = proto
    if (isIpv6Static.value && data.hasOwnProperty(NetType.static)) {
      ipv6.static.ip = data.static.address || ''
      ipv6.static.gateway = data.static.gateway || ''
      ipv6.static.prefix = data.static.prefix || ''
      ipv6.static.dns1 = data.static.dns1 || ''
      ipv6.static.dns2 = data.static.dns2 || ''
    }
    if (isIpv6Pppoe.value && data.hasOwnProperty(NetType.pppoe)) {
      ipv6.pppoe.username = data.pppoe.username || ''
      ipv6.pppoe.password = data.pppoe.password || ''
    }
    if (isIpv6dhcp.value && data.hasOwnProperty(NetType.dhcpv6)) {
      ipv6.dhcp.reqAddress = data.dhcpv6.reqAddress
      ipv6.dhcp.reqPrefix = data.dhcpv6.reqPrefix
    }
  })
}
const saveIpv4 = () => {
  if (ipv4FormRef.value?.validate()) {
    const data: {
      disabled: EnableStatus
      wan_proto: NetType
      static?: {
        wan_ip: string
        wan_netmask: string
        wan_gateway: string
        wan_dns1: string
        wan_dns2: string
      }
      pppoe?: {
        username: string
        password: string
      }
    } = {
      disabled: ipv4.enable,
      wan_proto: ipv4.netType,
    }
    if (isStatic.value) {
      data.static = {
        wan_ip: ipv4.static.ip,
        wan_netmask: ipv4.static.mask,
        wan_gateway: ipv4.static.gateway,
        wan_dns1: ipv4.static.dns1,
        wan_dns2: ipv4.static.dns2,
      }
    }
    if (isPppoe.value) {
      data.pppoe = {
        username: ipv4.pppoe.username,
        password: ipv4.pppoe.password,
      }
    }
    setWan(data)
  }
}
const saveIpv6 = () => {
  if (ipv6FormRef.value?.validate()) {
    const data: {
      enabled: EnableStatusIpv6
      proto: NetType
      static?: {
        address: string
        gateway: string
        prefix: string
        dns1: string
        dns2: string
      }
      pppoe?: {
        username: string
        password: string
      }
      dhcpv6?: {
        reqAddress: ReqAddress
        reqPrefix: ReqPrefix
      }
    } = {
      enabled: ipv6.enable,
      proto: ipv6.netType,
    }
    if (isIpv6Static.value) {
      data.static = {
        address: ipv6.static.ip,
        gateway: ipv6.static.gateway,
        prefix: ipv6.static.prefix,
        dns1: ipv6.static.dns1,
        dns2: ipv6.static.dns2,
      }
    }
    if (isIpv6Pppoe.value) {
      data.pppoe = {
        username: ipv6.pppoe.username,
        password: ipv6.pppoe.password,
      }
    }
    if (isIpv6dhcp.value) {
      data.dhcpv6 = {
        reqAddress: ipv6.dhcp.reqAddress,
        reqPrefix: ipv6.dhcp.reqPrefix,
      }
    }
    setIpv6Wan(data)
  }
}

onMounted(() => {
  getLanData()
  getWanData()
  getIpv6WanData()
})
</script>
