<template>
  <div class="page upgrade-page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0187') }}</h1>
    </div>
    <div class="page__content">
      <fh-form
        class="form"
        ref="form"
        :disabled="formDisabled"
        :model="form"
        name="form"
        method="post"
      >
        <fh-form-item>
          <fh-upload
            dragable
            ref="uploader"
            :before-upload="beforeUpload"
            :on-error="handleUploadError"
            :on-success="handleUploadsuccess"
            :on-cancel="handleUploadcancel"
            :request="getFile"
          />
        </fh-form-item>
        <fh-form-item>
          <fh-button @click="save" block :disabled="saveBtnDisabled">
            {{ $t('trans0187') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item v-show="alert">
          <fh-alert :title="alert" type="success"> </fh-alert>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
import { upload } from '@/http/api'

export default {
  data() {
    return {
      uploadFileName: '',
      isSuccess: false,
      alert: '',
      formDisabled: false,
      saveBtnDisabled: false,
      successFlag: 'SUCCESS',
      form: {},
      isHasfile: false,
      time: 120,
      isStopRefresh: false,
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
    getFile(file) {
      this.file = file
    },
    save() {
      // if (this.$refs.form.validate()) {
      //   if (!this.isHasfile) {
      //     toast(this.$t('trans0222'), 3000, 'error')
      //     return
      //   }
      //   this.$nextTick(() => {
      //     const form = document.form
      //     form.submit()
      //     this.alert = this.$t('trans0223')
      //     this.formDisabled = true
      //   })
      // }
      const fd = new FormData()
      fd.append('file', this.file[0])
      upload(fd).then(() => {
        console.log('123')
      })
    },
    upgrading() {
      // this.isStopRefresh = true
      // upgrade.open({
      //   timeout: this.time,
      //   progressVisible: true,
      //   // title: this.$t('trans0468'),
      //   tip: this.isFirmware ? this.$t('trans0203') : this.$t('trans0635'),
      // })
      // setTimeout(() => {
      //   upgrade.close()
      //   window.location.href = '/cgi-bin/logout.cgi'
      // }, this.time * 1000)
    },
    beforeUpload(files) {
      // this.isHasfile = files.length > 0
      // const isValidFileName = !!files.find((file) => {
      //   return file.name.split('_')[0] === this.uploadFileName // eg: file name: FTG6214X-B4I_V1.0.0-rc.1.bin
      // })
      // if (!isValidFileName) {
      //  toast(this.$t('trans0366'), 3000, 'error')
      // }
      // return isValidFileName
      return true
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
