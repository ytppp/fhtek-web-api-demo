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
        <fh-form-item :label="$t('trans0839')">
          <fh-switch v-model="form.enablePortSetting"></fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0739')">
          {{ form.registrationStatus }}
        </fh-form-item>
        <fh-form-item :label="$t('trans0840')" prop="account">
          <fh-input v-model="form.account"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0841')" prop="password">
          <fh-input v-model="form.password"> </fh-input>
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
  getSubNetwork,
} from '@/util/tool'
// import { getLan, setLan } from '@/http/api'

defineOptions({
  name: 'VoipBasicPage',
})

enum VoipProtocol {
  SIP = '0',
}

const { t } = useI18n()
const formRef = ref(null)
const hasVoipWan = ref(true)
const voipProtocolOpts = [
  {
    value: VoipProtocol.SIP,
    text: t('trans0923'),
  },
]
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
  enablePortSetting: false,
  registrationStatus: '',
  account: '',
  password: '',
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
  account: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  password: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
})
const save = () => {
  formRef.value.validate().then(() => {
    // todo
  })
}
</script>

<style lang="less"></style>
