<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0457') }}</h1>
    </div>
    <div class="page__content" :class="{ 'page__content--padding-small': isMix }">
      <template v-if="isMix">
        <div class="page__sub-header">
          <h2 class="page__title">{{ slaacTitleText }}</h2>
        </div>
        <!-- 表单 -->
        <div class="page__sub-header">
          <h2 class="page__title">{{ dhcpTitleText }}</h2>
        </div>
        <!-- 表单 -->
        <div class="page__sub-header">
          <h2 class="page__title">{{ dnsTitleText }}</h2>
        </div>
        <!-- 表单 -->
      </template>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0552') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  format,
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
import { getIpv6Lan, setIpv6Lan } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

defineOptions({
  name: 'LanIpv6Page',
})

const { convertBooleanStatus } = useDataClean()
const { t } = useI18n()
const loading = inject('loading')
const formRef = ref(null)
const form = reactive({
  enable: true,
  mode: Mode.slaac,
})

const slaacTitleText = computed(() => {
  return format(t('trans0469'), [t('trans0471')])
})
const dhcpTitleText = computed(() => {
  return format(t('trans0469'), [t('trans0408')])
})
const dnsTitleText = computed(() => {
  return format(t('trans0469'), [t('trans0473')])
})

function getIpv6LanData() {}
const save = () => {}
onMounted(() => {})
</script>
