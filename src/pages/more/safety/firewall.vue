<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0060') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form">
        <fh-form-item :label="$t('trans0060')" label-position="left">
          <fh-switch v-model="form.enable" @change="switchEnable"> </fh-switch>
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

enum SecurityLevels {
  disable = 'disable',
  low = 'low',
  medium = 'medium',
  high = 'high',
  userdefined = 'userdefined',
}

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
  enable: false,
  level: SecurityLevels.disable,
})
const formEnable = ref(false)
const switchEnable = (val) => {
  const message = val ? t('trans0066') : t('trans0067')
  if (formEnable.value) {
    dialog
      .confirm({
        okText: t('trans0019'),
        cancelText: t('trans0020'),
        message,
      })
      .then(() => {
        // todo
      })
      .catch(() => {
        form.enable = !form.enable
      })
  } else {
    // todo
  }
}
const save = () => {
  // todo
}
onMounted(() => {
  // todo
})
</script>
