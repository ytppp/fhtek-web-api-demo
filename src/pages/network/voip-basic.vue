<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0546') }}</h1>
    </div>
    <div class="page__content">
      <fh-form
        class="form form--small"
        ref="formRef"
        :model="form"
        :rules="rules"
        v-if="hasVoipWan"
      >
        <fh-form-item :label="$t('trans0135')" prop="register.protocol">
          <fh-select v-model="form.protocol" :options="voipProtocolOpts"></fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0140')">
          <fh-select v-model="form.interface" :options="voiceWanOpts"> </fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0733')" prop="register.server">
          <fh-input v-model="form.register.server"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0734')" prop="register.port">
          <fh-input v-model="form.register.port"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0735')" prop="register.secServer">
          <fh-input v-model="form.register.secServer"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0736')" prop="register.secPort">
          <fh-input v-model="form.register.secPort"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0766')" prop="proxy.server">
          <fh-input v-model="form.proxy.server"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0767')" prop="proxy.port">
          <fh-input v-model="form.proxy.port"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0770')" prop="proxy.secServer">
          <fh-input v-model="form.proxy.secServer"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0786')" prop="proxy.secPort">
          <fh-input v-model="form.proxy.secPort"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0817')">
          <fh-switch v-model="form.outboundProxy.enable"></fh-switch>
        </fh-form-item>
        <template v-if="form.outboundProxy.enable">
          <fh-form-item :label="$t('trans0831')" prop="proxy.outboundProxy.proxy">
            <fh-input v-model="form.outboundProxy.proxy"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0836')" prop="proxy.outboundProxy.port">
            <fh-input v-model="form.outboundProxy.port"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0837')" prop="proxy.outboundProxy.secProxy">
            <fh-input v-model="form.outboundProxy.secProxy"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0838')" prop="outboundProxy.secPort">
            <fh-input v-model="form.outboundProxy.secPort"> </fh-input>
          </fh-form-item>
        </template>
        <div class="form__sub-header">
          <h2 class="page__title">{{ $t('trans0926').format(1) }}</h2>
        </div>
        <fh-form-item :label="$t('trans0839')">
          <fh-switch v-model="form.line1.enablePortSetting"></fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0739')">
          {{ form.line1.registrationStatus }}
        </fh-form-item>
        <fh-form-item :label="$t('trans0840')" prop="account">
          <fh-input v-model="form.line1.account"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0841')" prop="password">
          <fh-input v-model="form.line1.password"> </fh-input>
        </fh-form-item>
        <div class="form__sub-header">
          <h2 class="page__title">{{ $t('trans0926').format(2) }}</h2>
        </div>
        <fh-form-item :label="$t('trans0839')">
          <fh-switch v-model="form.line2.enablePortSetting"></fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0739')">
          {{ form.line2.registrationStatus }}
        </fh-form-item>
        <fh-form-item :label="$t('trans0840')" prop="account">
          <fh-input v-model="form.line2.account"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0841')" prop="password">
          <fh-input v-model="form.line2.password"> </fh-input>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0604') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
// import {
//   getIpBefore,
//   getIpAfter,
//   isIP,
//   ip2int,
//   isMulticast,
//   isLoopback,
//   isNetworkIP,
//   isBoardcastIP,
//   isValidGatewayIP,
//   getSubNetwork,
// } from '@/util/tool'
import { ServiceType } from '@/util/constant'
import { getWan, getVoipBasicSettings, setVoipBasicSettings } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

defineOptions({
  name: 'VoipBasicPage',
})

enum VoipProtocol {
  SIP = '0',
}
const { convertBooleanStatus, defaultVal } = useDataClean()
const { t } = useI18n()
const formRef = ref(null)
const hasVoipWan = ref(false)
const voipProtocolOpts = [
  {
    value: VoipProtocol.SIP,
    text: t('trans0923'),
  },
]
const voiceWanOpts = reactive([])
const form = reactive({
  protocol: VoipProtocol.SIP,
  interface: '', // VOICE wan id
  register: {
    server: '',
    port: '',
    secServer: '',
    secPort: '',
  },
  proxy: {
    server: '',
    port: '',
    secServer: '',
    secPort: '',
  },
  outboundProxy: {
    enable: true, // false不可见下面参数
    proxy: '',
    port: '',
    secProxy: '',
    secPort: '',
  },
  line1: {
    enablePortSetting: false,
    registrationStatus: '',
    account: '',
    password: '',
  },
  line2: {
    enablePortSetting: false,
    registrationStatus: '',
    account: '',
    password: '',
  },
})
const rules = reactive({
  protocol: [
    {
      rule: (value) => value,
      message: t('trans0677').format(t('trans0135')),
    },
  ],
  'register.server': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'register.port': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'register.secServer': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'register.secPort': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'proxy.server': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'proxy.port': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'proxy.secServer': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'proxy.secPort': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'outboundProxy.proxy': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'outboundProxy.port': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'outboundProxy.secProxy': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'outboundProxy.secPort': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'line1.account': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'line1.password': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'line2.account': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'line2.password': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
})
const save = () => {
  formRef.value.validate().then(() => {
    const data = {
      protocol: form.protocol,
      interface: form.interface,
      register: {
        server: form.register.server,
        port: form.register.port,
        secServer: form.register.secServer,
        secPort: form.register.secPort,
      },
      proxy: {
        server: form.proxy.server,
        port: form.proxy.port,
        secServer: form.proxy.secServer,
        secPort: form.proxy.secPort,
      },
      outboundProxy: {
        enable: convertBooleanStatus(form.outboundProxy.enable),
        proxy: form.outboundProxy.proxy,
        port: form.outboundProxy.port,
        secProxy: form.outboundProxy.secProxy,
        secPort: form.outboundProxy.secPort,
      },
      line1: {
        enablePortSetting: convertBooleanStatus(form.line1.enablePortSetting),
        account: form.line1.account,
        password: form.line1.password,
      },
      line2: {
        enablePortSetting: convertBooleanStatus(form.line2.enablePortSetting),
        account: form.line2.account,
        password: form.line2.password,
      },
    }
    setVoipBasicSettings(data)
  })
}
const getVoipBasicSettingsData = () => {
  getVoipBasicSettings().then(({ data }) => {
    form.protocol = data.protocol
    form.interface = data.interface
    form.register.server = data.register.server
    form.register.port = data.register.port
    form.register.secServer = data.register.secServer
    form.register.secPort = data.register.secPort
    form.proxy.server = data.proxy.server
    form.proxy.port = data.proxy.port
    form.proxy.secServer = data.proxy.secServer
    form.proxy.secPort = data.proxy.secPort
    form.outboundProxy.enable = convertBooleanStatus(data.outboundProxy.enable) as boolean
    form.outboundProxy.proxy = data.outboundProxy.proxy
    form.outboundProxy.port = data.outboundProxy.port
    form.outboundProxy.secProxy = data.outboundProxy.secProxy
    form.outboundProxy.secPort = data.outboundProxy.secPort
    form.line1.enablePortSetting = convertBooleanStatus(data.line1.enablePortSetting) as boolean
    form.line1.registrationStatus = data.line1.registrationStatus || defaultVal
    form.line1.account = data.line1.account
    form.line1.password = data.line1.password
    form.line2.enablePortSetting = convertBooleanStatus(data.line2.enablePortSetting) as boolean
    form.line2.registrationStatus = data.line2.registrationStatus || defaultVal
    form.line2.account = data.line2.account
    form.line2.password = data.line2.password
  })
}
const getWanInfo = () => {
  getWan().then(({ data }) => {
    const { items } = data
    const voiceWan = items.find((item) => {
      return (
        item.serviceType === ServiceType.VOICE || item.serviceType === ServiceType.VOICE_INTERNET
      )
    })
    hasVoipWan.value = !!voiceWan
    if (hasVoipWan.value) {
      const voiceWanList: any[] = [
        {
          value: voiceWan.id,
          text: voiceWan.wanName,
        },
      ]
      Object.assign(voiceWanOpts, voiceWanList)
      getVoipBasicSettingsData()
    }
  })
}
onMounted(() => {
  getWanInfo()
})
</script>

<style lang="less"></style>
