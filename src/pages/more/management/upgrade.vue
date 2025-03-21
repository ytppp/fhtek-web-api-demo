<template>
  <div class="page upgrade-page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0187') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :disabled="formDisabled" :model="form">
        <fh-form-item>
          <fh-upload
            dragable
            ref="uploader"
            :before-upload="beforeUpload"
            :on-error="handleUploadError"
            :on-success="handleUploadsuccess"
            :on-cancel="handleUploadcancel"
            :request="upload"
          />
        </fh-form-item>
        <fh-form-item>
          <fh-button @click="save" block :disabled="saveBtnDisabled">
            {{ $t('trans0187') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
import { upload } from '@/http/api'
import { UploadStatus } from '@/util/constant'

export default {
  data() {
    return {
      uploadFileName: '',
      isSuccess: false,
      accept: '.bin',
      formDisabled: false,
      saveBtnDisabled: false,
      successFlag: 'SUCCESS',
      form: {},
      isHasfile: false,
      time: 120,
      file: '',
    }
  },
  methods: {
    handleUploadError() {
      this.saveBtnDisabled = true
    },
    handleUploadsuccess() {
      this.saveBtnDisabled = false
    },
    handleUploadcancel() {
      this.saveBtnDisabled = false
    },
    upload(file) {
      this.file = file
    },
    save() {
      const fd = new FormData()
      fd.append('file', this.file[0])
      upload(fd, (progressEvent) => {
        console.log(progressEvent)
        const { loaded, total, lengthComputable } = progressEvent
        if (lengthComputable) {
          this.$refs.uploader.percentage = Math.floor((loaded / total) * 100)
          if (loaded >= total) {
            this.$refs.uploader.status = UploadStatus.success
          } else {
            this.$refs.uploader.status = UploadStatus.uploading
          }
        }
      })
        .then(() => {
          this.upgrading()
        })
        .catch(() => {
          this.$refs.uploader.status = UploadStatus.fail
        })
    },
    upgrading() {
      this.$upgrade.open({
        timeout: this.time,
        title: this.$t('trans0468'),
        tip: this.$t('trans0203'),
      })
    },
    beforeUpload(files) {
      this.isHasfile = files.length > 0
      const isValidFileName = !!files.find((file) => {
        return true // file.name.split('_')[0] === this.uploadFileName // eg: file name: FTG6214X-B4I_V1.0.0-rc.1.bin
      })
      if (!isValidFileName) {
        this.$toast({ text: this.$t('trans0366') })
      }
      return isValidFileName
    },
  },
}
</script>

<style lang="less">
.upgrade-page .button {
  width: 350px;
}
</style>
@/http/v1.index.js
