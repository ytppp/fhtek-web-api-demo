<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0823') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form form--padding" :model="form" :rules="rules">
        <fh-form-item :label="t('trans0824')">
          <fh-switch v-model="form.enable" />
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0813')">
            {{ usbDeviceText }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0825')" prop="path" v-if="form.usbDevice">
            <fh-input v-model="form.sharingpath"></fh-input>
            <template #extra>
              {{ $t('trans0826') }}
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
const form = reactive({
  enable: false,
  usbDevice: '',
  sharingpath: '',
})
const rules = {
  path: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
}
const usbDeviceText = computed(() => {
  return form.usbDevice ? form.usbDevice : t('trans0821')
})
const save = () => {}
</script>
