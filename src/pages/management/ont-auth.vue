<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0780') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0767')">
          <fh-select v-model="form.authType" :options="authModeOpts"> </fh-select>
        </fh-form-item>
        <template v-if="isLoid">
          <fh-form-item :label="$t('trans0781')" prop="loid.loid">
            <fh-input v-model="form.loid.loid"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0768')" prop="loid.checkCode">
            <fh-input v-model="form.loid.checkCode"> </fh-input>
          </fh-form-item>
        </template>
        <template v-if="isPassword">
          <fh-form-item :label="$t('trans0196')" prop="password.password">
            <fh-input v-model="form.password.password"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0541')" prop="password.sn">
            <fh-input v-model="form.password.sn"> </fh-input>
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
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

enum AuthMode {
  loid = 'loid',
  password = 'password',
}

const { t } = useI18n()
const authModeOpts = [
  {
    value: AuthMode.loid,
    text: t('trans0781'),
  },
  {
    value: AuthMode.password,
    text: t('trans0196'),
  },
]
const formRef = ref(null)
const form = reactive({
  authType: AuthMode.loid,
  loid: {
    loid: '',
    checkCode: '',
  },
  password: {
    password: '',
    sn: '',
  },
})
const rules = {
  'loid.loid': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'loid.checkCode': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'password.password': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  'password.sn': [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
}
const isLoid = computed(() => form.authType === AuthMode.loid)
const isPassword = computed(() => form.authType === AuthMode.password)

const save = () => {}
</script>
