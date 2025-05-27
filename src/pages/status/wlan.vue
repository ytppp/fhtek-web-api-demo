<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0628') }}</h1>
    </div>
    <div class="page__content page__content--padding-small">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0702') }}</h2>
      </div>
      <div class="display-form">
        <div class="display-form__item">
          <div class="display-form__label">{{ $t('trans0705') }}</div>
          <div class="display-form__value">{{ b24gConnStatus }}</div>
        </div>
      </div>
      <div class="page__table">
        <fh-table
          :columns="b24gInterfaceColumns"
          :data-source="b24gInterfaceData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div>
      <div class="page__table">
        <fh-table
          :columns="b24gSsidColumns"
          :data-source="b24gSsidData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0704') }}</h2>
      </div>
      <div class="display-form">
        <div class="display-form__item">
          <div class="display-form__label">{{ $t('trans0705') }}</div>
          <div class="display-form__value">{{ b5gConnStatus }}</div>
        </div>
      </div>
      <div class="page__table">
        <fh-table
          :columns="b5gInterfaceColumns"
          :data-source="b5gInterfaceData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div>
      <div class="page__table">
        <fh-table
          :columns="b5gSsidColumns"
          :data-source="b5gSsidData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'

const { t } = useI18n()

const b24gConnStatus = ref('')
const b5gConnStatus = ref('')
const b24gInterfaceColumns = reactive([
  {
    key: 'interface',
    title: t('trans0140'),
  },
  {
    key: 'receive',
    title: t('trans0706'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
  {
    key: 'send',
    title: t('trans0707'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
])
const b24gSsidColumns = reactive([
  {
    key: 'index',
    title: t('trans0711'),
  },
  {
    key: 'name',
    title: t('trans0712'),
  },
  {
    key: 'security',
    title: t('trans0713'),
  },
  {
    key: 'auth',
    title: t('trans0714'),
  },
  {
    key: 'encrypt',
    title: t('trans0536'),
  },
])
const b5gInterfaceColumns = reactive([
  {
    key: 'interface',
    title: t('trans0140'),
  },
  {
    key: 'receive',
    title: t('trans0706'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
  {
    key: 'send',
    title: t('trans0707'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
])
const b5gSsidColumns = reactive([
  {
    key: 'index',
    title: t('trans0711'),
  },
  {
    key: 'name',
    title: t('trans0712'),
  },
  {
    key: 'security',
    title: t('trans0713'),
  },
  {
    key: 'auth',
    title: t('trans0714'),
  },
  {
    key: 'encrypt',
    title: t('trans0536'),
  },
])
const b24gInterfaceData = reactive([])
const b24gSsidData = reactive([])
const b5gInterfaceData = reactive()
const b5gSsidData = reactive([])
</script>
