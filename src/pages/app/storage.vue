<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0810') }}</h1>
    </div>
    <div class="page__content page__content--padding-small">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0811') }}</h2>
      </div>
      <fh-form class="form form--padding" :model="clientForm" :rules="clientFormRules">
        <fh-form-item :label="$t('trans0812')" prop="url">
          <fh-input v-model="clientForm.url"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0754')" prop="port">
          <fh-input v-model="clientForm.port"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0053')" prop="username">
          <fh-input v-model="clientForm.username"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0196')" prop="password">
          <fh-input v-model="clientForm.password"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0813')">
          {{ clientUsbDeviceText }}
        </fh-form-item>
        <fh-form-item :label="$t('trans0812')" prop="path" v-if="clientForm.usbDevice">
          <fh-input v-model="clientForm.path"></fh-input>
          <template #extra>
            {{ $t('trans0818') }}
          </template>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="download" block>
            {{ $t('trans0820') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__table">
        <fh-table :columns="columns" :data-source="data" :show-row-checkbox="false"></fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0815') }}</h2>
      </div>
      <fh-form class="form form--padding" :model="serverForm" :rules="serverFormRules">
        <fh-form-item :label="t('trans0816')" label-position="left">
          <fh-switch v-model="serverForm.enable" />
        </fh-form-item>
        <template v-if="serverForm.enable">
          <fh-form-item :label="$t('trans0053')" prop="username">
            <fh-input v-model="serverForm.username"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0196')" prop="password">
            <fh-input v-model="serverForm.password"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0754')" prop="port">
            <fh-input v-model="serverForm.port"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0813')">
            {{ serverUsbDeviceText }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0817')" prop="path" v-if="serverForm.usbDevice">
            <fh-input v-model="serverForm.rootPath"></fh-input>
            <template #extra>
              {{ $t('trans0819') }}
            </template>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0224') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const clientForm = reactive({
  url: 'ftp://',
  port: '',
  username: '',
  password: '',
  usbDevice: '',
  path: '',
})
const serverForm = reactive({
  enable: false,
  username: '',
  password: '',
  port: '',
  usbDevice: '',
  rootPath: '',
})
const clientFormRules = {
  url: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  port: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  username: [
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
  path: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
}
const serverFormRules = {
  port: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  username: [
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
  path: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
}
const columns = reactive([
  {
    key: 'username',
    title: t('trans0812'),
  },
  {
    key: 'password',
    title: t('trans0812'),
  },
  {
    key: 'port',
    title: t('trans0754'),
  },
  {
    key: 'url',
    title: t('trans0812'),
  },
  {
    key: 'path',
    title: t('trans0812'),
  },
  {
    key: 'status',
    title: t('trans0166'),
  },
])
const data = []

const clientUsbDeviceText = computed(() => {
  return clientForm.usbDevice ? clientForm.usbDevice : t('trans0821')
})
const serverUsbDeviceText = computed(() => {
  return serverForm.usbDevice ? serverForm.usbDevice : t('trans0821')
})
const download = () => {
  // todo
}
const save = () => {}
</script>
