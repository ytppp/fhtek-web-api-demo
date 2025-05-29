<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0271') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form" :rules="formRules">
        <fh-form-item :label="$t('trans0259')">
          <fh-switch v-model="form.enable"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0260')" prop="Interval">
          <fh-input v-model="form.interval"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0261')" prop="url">
          <fh-input v-model="form.url"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0262')" prop="platUser">
          <fh-input v-model="form.platUser"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0263')" prop="platPwd">
          <fh-input v-model="form.platPwd" type="password" show-password></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0264')" prop="terminalUser">
          <fh-input v-model="form.terminalUser"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0265')" prop="terminalPwd">
          <fh-input v-model="form.terminalPwd" type="password" show-password></fh-input>
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
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const formRef = ref(null)
const form = reactive({
  enable: true,
  interval: '',
  url: '',
  platUser: '',
  platPwd: '',
  terminalUser: '',
  terminalPwd: '',
})
const formRules = {
  interval: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  url: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  platUser: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  platPwd: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    }
  ],
  terminalUser: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  terminalPwd: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    }
  ],
}
</script>
