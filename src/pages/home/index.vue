<template>
  <div style="height: 200px; width: 200px; border: solid 1px red" v-loading="uploading">
    loading
  </div>
  <fh-button @click="toggleLoading">切换loading</fh-button>
  <fh-button @click="openDialog">消息弹框</fh-button>
  <fh-button @click="openDialog2">提示弹框2</fh-button>
  <fh-button @click="() => toggleVisible(true)">打开Modal</fh-button>
  <div style="height: 400px; width: 400px; position: relative; border: solid 1px red">
    <fh-modal v-model="visible" width="25%" :is-append-body="false">
      <template #body>
        <h2 class="signin-modal__title">{{ $t('trans0624') }}</h2>
        <p class="signin-modal__content">{{ $t('trans0625') }}</p>
      </template>
      <template #footer>
        <div class="signin-modal__action">
          <fh-button type="text" @click="() => toggleVisible(false)">
            {{ $t('trans0626') }}
          </fh-button>
        </div>
      </template>
    </fh-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'HomePage',
})

const { t } = useI18n()
const dialog = inject('dialog')
const uploading = ref(false)
const visible = ref(false)

const toggleLoading = () => {
  uploading.value = !uploading.value
}

const toggleVisible = (flag) => {
  visible.value = flag
}

const openDialog = () => {
  dialog
    .info({
      okText: t('trans0019'),
      message: t('trans0645'),
    })
    .then(() => {
      console.log('info then')
    })
}
const openDialog2 = () => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0021'),
    })
    .then(() => {
      console.log('confirm then')
    })
    .catch(() => {
      console.log('confirm catch')
    })
}
</script>
