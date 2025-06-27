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
            :disabled="saveBtnDisabled"
            :on-error="handleUploadError"
            :on-success="handleUploadsuccess"
            :on-cancel="handleUploadcancel"
            :before-upload="beforeUpload"
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
const upgrade = inject('upgrade')
const uploader = useTemplateRef('uploader')

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
  startReboot().then(({ data }) => {
    const status = data.status
    if (status === Status.doing) {
      loading.open()
      createRebootCountDown()
    }
  })
}
const reset = () => {
  startReset().then(({ data }) => {
    const status = data.status
    if (status === Status.doing) {
      loading.open()
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
    window.location.href = `${location.origin}/${data.cfg_name}`
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
const beforeUpload = (files) => {
  if (!files.length) {
    return false
  }
  const isValidFileName = !!files.find((file) => {
    return true // file.name.split('_')[0] === this.uploadFileName // eg: file name: FTG6214X-B4I_V1.0.0-rc.1.bin
  })
  if (!isValidFileName) {
    toast(t('trans0366'))
  }
  return isValidFileName
}
const save = () => {
  const fd = new FormData()
  fd.append('file', uploader.value.files[0])
  uploadConfig(fd, (progressEvent) => {
    const { loaded, total, lengthComputable } = progressEvent
    if (lengthComputable) {
      uploader.value.percentage = Math.floor((loaded / total) * 100)
      if (loaded >= total) {
        uploader.value.status = uploader.value.UploadStatus.success
      } else {
        uploader.value.status = uploader.value.UploadStatus.uploading
      }
    }
  })
    .then(() => {
      // upgrading(t('trans0635'))
    })
    .catch(() => {
      uploader.value.status = uploader.value.UploadStatus.fail
    })
}
const upgrading = (tip) => {
  upgrade.open({
    timeout,
    title: t('trans0468'),
    tip,
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
})
</script>
