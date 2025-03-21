<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0456') }}</h1>
    </div>
    <div class="page__content">
      <fh-form ref="formRef" :model="form" :rules="rules" class="form">
        <fh-form-item :label="$t('trans0415')" prop="ip" ref="ipRef">
          <fh-input v-model="form.ip" @blur="changeIp" clearable> </fh-input>
          <template #extra>
            {{ $t('trans0644') }}
          </template>
        </fh-form-item>
        <fh-form-item :label="$t('trans0460')" label-position="left">
          <fh-switch
            v-model="form.enable"
            :active-value="EnableStatus.yes"
            :inactive-value="EnableStatus.no"
          ></fh-switch>
        </fh-form-item>
        <template v-if="isEnable">
          <fh-form-item prop="ip_start" :label="$t('trans0151')" ref="ipStartRef">
            <fh-input v-model="form.ip_start" @blur="ipStartChange"></fh-input>
          </fh-form-item>
          <fh-form-item prop="ip_end" :label="$t('trans0152')" ref="ipEndRef">
            <fh-input v-model="form.ip_end"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0461')">
            <fh-select v-model="form.lease" :options="leases"></fh-select>
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
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getIpBefore,
  getIpAfter,
  isIP,
  ip2int,
  isMulticast,
  isLoopback,
  isNetworkIP,
  isBoardcastIP,
  isValidGatewayIP,
  isSameSubNetwork,
  getSubNetwork,
} from '@/util/tool'
import { getLan, setLan } from '@/http/api'

defineOptions({
  name: 'LanPage',
})

const { t } = useI18n()
const dialog = inject('dialog')
enum Leases {
  oneHour = 1,
  oneDay = 24,
  oneWeek = 24 * 7,
}
enum EnableStatus {
  yes = 1,
  no = 0,
}
interface ILease {
  value: Leases
  text: string
}
const leases: ILease[] = [
  {
    value: Leases.oneHour,
    text: t('trans0462', 1, { val: 1 }),
  },
  {
    value: Leases.oneDay,
    text: t('trans0463', 1, { val: 1 }),
  },
  {
    value: Leases.oneWeek,
    text: t('trans0464', 1, { val: 1 }),
  },
]
const ipRef = ref(null)
const ipStartRef = ref(null)
const ipEndRef = ref(null)
const formRef = ref(null)
const ipOrigin = ref('')
const wanIp = ref('')
const form = reactive({
  enable: EnableStatus.yes,
  ip: '',
  mask: '',
  ip_start: '',
  ip_end: '',
  lease: Leases.oneHour,
})
const rules = reactive({
  ip: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isNetworkIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isBoardcastIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => isValidGatewayIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => {
        if (!wanIp.value) {
          return true
        }
        const wanIpBefore = getIpBefore(wanIp.value)
        const ipBefore = getIpBefore(value)
        if (ipBefore === wanIpBefore || wanIp.value === value) {
          return false
        }
        return true
      },
      message: t('trans0614'),
    },
  ],
  ip_start: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isNetworkIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isBoardcastIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => isSameSubNetwork(value, form.ip, form.mask),
      message: t('trans0397'),
    },
  ],
  ip_end: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isNetworkIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isBoardcastIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => isSameSubNetwork(value, form.ip, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => {
        if (form.ip_start) {
          return ip2int(form.ip_start) <= ip2int(value)
        }
        return true
      },
      message: t('trans0467'),
    },
  ],
})
const ipOffset = computed(() => {
  return Number(getIpAfter(form.ip_end)) - Number(getIpAfter(form.ip_start)) + 1
})
const isEnable = computed(() => {
  return form.enable === EnableStatus.yes
})
const isIpChanged = computed(() => ipOrigin.value !== form.ip)

const isSameSubNetwork = (ip, lanip, mask) => {
  const subnetwork = getSubNetwork(lanip, mask)
  const subnetwork1 = getSubNetwork(ip, mask)
  if (subnetwork !== subnetwork1) {
    return false
  }
  if (ip2int(ip) === ip2int(lanip)) {
    return false
  }
  return true
}
async function getLanData() {
  getLan().then(({ data }) => {
    const { enable, ip, mask, ip_start, ip_offset, lease } = data
    Object.assign(form, {
      enable,
      ip,
      mask,
      ip_start,
      ip_end: `${getIpBefore(ip_start)}${Number(getIpAfter(ip_start)) + Number(ip_offset) - 1}`,
      lease: Number(lease),
    })
    ipOrigin.value = form.ip
  })
}
const changeIp = () => {
  if (!ipRef.value.validate()) {
    return
  }
  dialog
    .info({
      okText: t('trans0019'),
      message: t('trans0645'),
    })
    .then(() => {
      const ipBefore = getIpBefore(form.ip)
      const ipAfter = getIpAfter(form.ip)
      // c type ip: 1-254
      const ipStartAfter = `${ipAfter == 1 ? 2 : 1}`
      form.ip_start = `${ipBefore}${ipStartAfter}`
      ipStartRef.value.validate()

      const ipEndAfter = `${ipAfter == 254 ? 253 : 254}`
      form.ip_end = `${ipBefore}${ipEndAfter}`
      ipEndRef.value.validate()
    })
}
const ipStartChange = () => {
  ipEndRef.value.extraValidate(() => {
    const start = form.ip_start
    const end = form.ip_end
    if (isIP(start)) {
      if (start && end) {
        return ip2int(end) >= ip2int(start)
      }
      return true
    }
    return true
  }, t('trans0467'))
}
const save = () => {
  if (formRef.value.validate()) {
    const freq = isIpChanged.value ? 20 * 1000 : 2000
    setLan({
      enable: form.enable,
      ip: form.ip,
      mask: form.mask,
      ip_start: form.ip_start,
      ip_offset: ipOffset.value,
      lease: form.lease,
    }).then(() => {
      setTimeout(() => {
        if (isIpChanged.value) {
          console.log('isIpChanged')
          // window.location.href = `http://${this.form.ip}/index.html#/login`
        }
      }, freq)
    })
  }
}
onMounted(() => {
  getLanData()
})
</script>

<style lang="less"></style>
