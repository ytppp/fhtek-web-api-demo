<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0060') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form">
        <fh-form-item :label="$t('trans0060')">
          <fh-switch v-model="form.enable" @change="switchEnable"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0703')">
          <div>{{ currentLevel }}</div>
        </fh-form-item>
        <fh-form-item :label="$t('trans0037')" v-if="form.enable">
          <fh-select v-model="form.level" :options="securityLevels"> </fh-select>
        </fh-form-item>
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
import { ref, reactive, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { setFirewall, getFirewall } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

defineOptions({
  name: 'FirewallPage',
})

enum SecurityLevels {
  disable = 'disable',
  low = 'low',
  medium = 'medium',
  high = 'high',
  userdefined = 'userdefined',
}

const { convertBooleanStatus } = useDataClean()
const { t } = useI18n()
const dialog = inject('dialog')
const securityLevels = [
  {
    value: SecurityLevels.disable,
    text: t('trans0054'),
  },
  {
    value: SecurityLevels.low,
    text: t('trans0062'),
  },
  {
    value: SecurityLevels.medium,
    text: t('trans0063'),
  },
  {
    value: SecurityLevels.high,
    text: t('trans0064'),
  },
  // {
  //   value: SecurityLevels.userdefined,
  //   text: t('trans0065'),
  // }
]
const formRef = ref(null)
const form = reactive({
  enable: true,
  level: SecurityLevels.disable,
})
const formEnableInitial = ref(false)
const currentLevel = ref(SecurityLevels.disable)
const switchEnable = () => {
  if (!form.enable && formEnableInitial.value) {
    dialog
      .confirm({
        okText: t('trans0019'),
        cancelText: t('trans0020'),
        message: t('trans0067'),
      })
      .then(() => {
        save()
      })
      .catch(() => {
        form.enable = true
      })
  }
}
const save = () => {
  setFirewall({
    enable: convertBooleanStatus(form.enable),
    level: form.level,
  })
}
const getFirewallData = () => {
  getFirewall().then(({ data }) => {
    const { enable, level } = data
    formEnableInitial.value = form.enable = convertBooleanStatus(enable) as boolean
    form.level = level
    currentLevel.value = level
  })
}
onMounted(() => {
  getFirewallData()
})
</script>
