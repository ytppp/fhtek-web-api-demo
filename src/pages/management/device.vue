<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0227') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0075') }}</h2>
      </div>
      <fh-form class="form form--padding">
        <fh-form-item>
          <fh-button @click="reboot" block>
            {{ $t('trans0075') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0224') }}</h2>
      </div>
      <fh-form class="form form--padding">
        <fh-form-item>
          <fh-button @click="resetDefaults" block>
            {{ $t('trans0224') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0643') }}</h2>
      </div>
      <fh-form class="form form--padding" ref="form">
        <fh-form-item :label="$t('trans0226')">
          <fh-button @click="backConfig" block>
            {{ $t('trans0226') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item :label="$t('trans0634')">
          <fh-upload
            dragable
            ref="uploader"
            :accept="accept"
            :on-error="handleUploadError"
            :on-success="handleUploadsuccess"
            :on-cancel="handleUploadcancel"
          />
        </fh-form-item>
        <fh-form-item>
          <fh-button @click="save" block :disabled="saveBtnDisabled">
            {{ $t('trans0634') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef, inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  startReboot,
  rebootStatus,
  startReset,
  resetStatus,
  backup,
  uploadConfig,
  getLan,
} from '@/http/api'
import { useCountDown } from '@/hooks/countdown'

defineOptions({
  name: 'DevicePage',
})

enum Status {
  doing = 'doing',
  done = 'done',
  fail = 'fail',
}

const { t } = useI18n()
const timeout = 1000 * 60 * 2 // 2 minutes
const interval = 5000 // 5 second
const accept = '.tgz'
const saveBtnDisabled = ref(false)
const dialog = inject('dialog')
const loading = inject('loading')
const toast = inject('toast')
const uploader = useTemplateRef('uploader')
const lanIp = ref('')

const doingRebootHandle = () => {
  checkRebootStatus()
}
const doingResetHandle = () => {
  checkResetStatus()
}
const doneRebootHandle = () => {
  loading.close()
}
const doneResetHandle = () => {
  loading.close()
}
const reboot = () => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0242'),
    })
    .then(() => {
      startReboot().then(({ data }) => {
        const status = data.status
        if (status === Status.doing) {
          loading.open({
            tip: t('trans0229'),
          })
          createRebootCountDown()
        }
      })
    })
    .catch(() => {})
}
const reset = () => {
  startReset().then(({ data }) => {
    const status = data.status
    if (status === Status.doing) {
      loading.open({
        tip: t('trans0617'),
      })
      createResetCountDown()
    }
  })
}
const checkRebootStatus = () => {
  rebootStatus().then(({ data }) => {
    const status = data.status
    if (status === Status.done || status === Status.fail) {
      cleanRebootCountDown()
    }
  })
}
const checkResetStatus = () => {
  resetStatus().then(({ data }) => {
    const status = data.status
    if (status === Status.done || status === Status.fail) {
      cleanResetCountDown()
    }
  })
}
const resetDefaults = () => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0225'),
    })
    .then(() => {
      reset()
    })
    .catch(() => {})
}
const getBackupFile = () => {
  loading.open()
  backup().then(({ data }) => {
    loading.close()
    window.location.href = `${import.meta.env.DEV ? `http://${lanIp.value}` : location.origin}/${data.cfg_name}`
  })
}
const backConfig = () => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0228'),
    })
    .then(() => {
      getBackupFile()
    })
    .catch(() => {})
}
const handleUploadError = () => {
  saveBtnDisabled.value = true
}
const handleUploadsuccess = () => {
  saveBtnDisabled.value = false
}
const handleUploadcancel = () => {
  saveBtnDisabled.value = false
}
const save = () => {
  if (!uploader.value.files.length) {
    toast(t('trans0222'), 3000, 'error')
    return
  }
  loading.open({
    tip: t('trans0635'),
  })
  const fd = new FormData()
  fd.append('file', uploader.value.files[0])
  uploadConfig(fd, (progressEvent) => {
    const { loaded, total, lengthComputable } = progressEvent
    if (lengthComputable) {
      uploader.value.uploadPercentage = Math.floor((loaded / total) * 100)
      if (loaded >= total) {
        uploader.value.status = uploader.value.UploadStatus.success
      } else {
        uploader.value.status = uploader.value.UploadStatus.uploading
      }
    }
  })
    .then(() => {
      createRebootCountDown()
    })
    .catch(() => {
      uploader.value.status = uploader.value.UploadStatus.fail
    })
    .finally(() => {
      loading.close()
    })
}
function getLanData() {
  getLan().then(({ data }) => {
    const { lan } = data
    const { ip } = lan
    lanIp.value = ip
  })
}
const { createCountDown: createRebootCountDown, cleanCountDown: cleanRebootCountDown } =
  useCountDown(timeout, interval, doingRebootHandle, doneRebootHandle)
const { createCountDown: createResetCountDown, cleanCountDown: cleanResetCountDown } = useCountDown(
  timeout,
  interval,
  doingResetHandle,
  doneResetHandle,
)
onMounted(() => {
  createRebootCountDown()
  createResetCountDown()
  getLanData()
})
</script>
