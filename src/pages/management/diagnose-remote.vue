<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0803') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form form--padding wifi-form" :model="remote">
        <fh-form-item :label="$t('trans0140')">
          <fh-select v-model="remote.interface" :options="interfaceOpts"> </fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0166')" label-position="left">
          {{ remote.status }}
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button block>
            {{ $t('trans0557') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'

enum Interface {
  all = 'All',
  lan1 = 'LAN1',
  lan2 = 'LAN2',
  lan3 = 'LAN3',
  lan4 = 'LAN4',
}
enum Status {
  start = 'start',
  stop = 'stop',
}

const { t } = useI18n()
const interfaceOpts = [
  {
    value: Interface.all,
    text: t('trans0537'),
  },
  // {
  //   value: Interface.lan1,
  //   text: 'LAN1',
  // },
  // {
  //   value: Interface.lan2,
  //   text: 'LAN2',
  // },
  // {
  //   value: Interface.lan3,
  //   text: 'LAN3',
  // },
  // {
  //   value: Interface.lan4,
  //   text: 'LAN4',
  // },
]
const remote = reactive({
  interface: 'All',
  status: Status.stop,
})
</script>
