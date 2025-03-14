<template>
  <div class="upload">
    <div class="upload__box">
      <fh-upload-dragger v-if="dragable" :disabled="uploadDisabled" @file="uploadDragFiles">
        <svg
          class="upload__icon"
          :class="uploadDisabled ? 'is-upload-loading' : ''"
          viewBox="0 0 1536 1024"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1241.6 378.24C1196.8 163.936 1004.8 0 768 0c-185.6 0-345.6 100.864-422.4 252.16C147.2 277.44 0 435.04 0 630.464c0 208.064 172.8 378.272 384 378.272h832c179.2 0 320-138.688 320-315.2 0-163.936-134.4-302.624-294.4-315.232zM896 567.424v252.16h-256v-252.16h-192l320-315.2 320 315.2h-192z"
            fill="#D6001C"
          ></path>
        </svg>
        <p class="upload__text">
          {{ $t('trans0205') }}
        </p>
        <fh-button class="fileinput-button" :disabled="uploadDisabled" @click="click" size="small">
          <label>{{ labelText }}</label>
        </fh-button>
      </fh-upload-dragger>
      <template v-else>
        <fh-button class="fileinput-button" :disabled="uploadDisabled" @click="click" size="small">
          <label>{{ labelText }}</label>
        </fh-button>
      </template>
      <input
        type="file"
        @change="handleChange"
        ref="upload"
        :multiple="multiple"
        :accept="accept"
        :name="name"
        :disabled="uploadDisabled"
        hidden="hidden"
      />
    </div>
    <div class="upload__files" v-if="files.length">
      <div class="file" v-for="file in files" :key="file.lastModified">
        <div class="file__info">
          <div class="icon-wrap">
            <img :src="fileIcon" />
          </div>
          <div class="des-cnt">
            <div class="description">
              <div class="fileinfo">
                <div class="fileinfo__wrap">
                  <span class="fileinfo__name single-line-text-omitted">
                    {{ file.name }}
                  </span>
                  <span class="fileinfo__size">{{ getSize(file) }}</span>
                </div>
                <!-- <div v-if="uploadLoading"
                     class="fileinfo__upload-percent">{{width}}</div> -->
              </div>
              <div
                class="packageinfo"
                v-if="uploadSuccess && packageInfo && packageInfo.product && packageInfo.version"
              >
                <div class="packageinfo__product">
                  <span class="single-line-text-omitted">{{ packageInfo.product }}</span>
                </div>
                <div class="packageinfo__version">
                  <span class="single-line-text-omitted">{{ packageInfo.version }}</span>
                </div>
              </div>
              <div class="filesize">{{ getSize(file) }}</div>
            </div>
            <!-- <div class="line"
                 v-if="!uploadSuccess">
              <span :class="{'loading':uploadLoading,'fail':uploadFail}"
                    :style="{'width':width}"></span>
            </div> -->
          </div>
          <div class="delete-wrap">
            <img
              src="@/assets/images/ic_delete.png"
              alt=""
              width="24"
              v-if="!uploadDisabled"
              @click="cancel(file)"
            />
          </div>
        </div>
        <div class="file__error" v-if="uploadFail">{{ err || $t('trans0206') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import FhUploadDragger from './upload-dragger.vue'
import { UploadStatus } from '@/util/constant'
import { toLocaleNumber } from '@/i18n/index'
import { getFileExtendName } from '@/util/tool'
import IcFolderError from '@/assets/images/ic_folder_error.png'
import IcFolder from '@/assets/images/ic_folder.png'

export default {
  components: {
    FhUploadDragger,
  },
  inject: {
    form: {
      default: '',
    },
    formItem: {
      default: '',
    },
  },
  props: {
    onSuccess: { type: Function },
    onError: { type: Function },
    onChange: { Function },
    onCancel: { type: Function },
    label: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: '',
    },
    request: { type: Function },
    beforeUpload: { type: Function },
    packageInfo: {},
    dragable: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 500 * 1000 * 1000,
    },
    isFormUpload: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: String,
  },
  data() {
    return {
      files: [],
      draggerFiles: [],
      percentage: 0,
      status: UploadStatus.ready,
      err: '',
    }
  },
  computed: {
    uploadDisabled() {
      return this.disabled || (this.form || {}).disabled || this.uploadLoading
    },
    uploadSuccess() {
      return this.status === UploadStatus.success
    },
    uploadLoading() {
      return this.status === UploadStatus.uploading
    },
    uploadFail() {
      return this.status === UploadStatus.fail
    },
    percent() {
      return Math.min(this.percentage, 100)
    },
    width() {
      return `${this.percent}%`
    },
    fileIcon() {
      return this.uploadFail ? IcFolderError : IcFolder
    },
    labelText() {
      return this.label
        ? this.label
        : this.accept
          ? this.$t('trans0209').format(this.accept)
          : '导入文件'
    },
  },
  methods: {
    uploadDragFiles(files) {
      if (files && !files.length) return
      this.draggerFiles = files
      let postFiles = [].slice.call(files)
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1)
      }
      this.files = postFiles
      this.validateFileFormat()
    },
    getSize(file) {
      return `${toLocaleNumber(file.size / 1000 / 1000, this.$i18n.locale, 2, 2)}MB`
    },
    click() {
      this.initUploadStatus()
      this.$refs.upload.click()
    },
    initUploadStatus() {
      this.files = []
      this.err = ''
      this.percentage = 0
      this.status = UploadStatus.ready
      this.$refs.upload.value = null
      this.onChange && this.onChange()
    },
    validateFileFormat() {
      const isZeroSize = !!this.files.find((file) => file.size === 0)
      let flag = true
      if (isZeroSize) {
        this.status = UploadStatus.fail
        this.err = this.$t('trans0206')
        flag = false
      }
      const isLimitOver = !!this.files.find((file) => file.size >= this.limit)
      if (isLimitOver) {
        this.status = UploadStatus.fail
        this.err = this.$t('trans0211')
        flag = false
      }
      if (this.accept) {
        const reg = new RegExp(`^${this.accept.slice(1)}$`, 'i')
        const isInvalidFile = !!this.files.find((file) => {
          const entendName = getFileExtendName(file)
          return !reg.test(entendName)
        })
        if (isInvalidFile) {
          this.status = UploadStatus.fail
          this.err = this.$t('trans0208').format(this.accept)
          flag = false
        }
      }
      if (this.beforeUpload && !this.beforeUpload(this.files)) {
        this.status = UploadStatus.fail
        flag = false
      }
      if (!flag && this.onError) {
        this.onError()
        return
      }
      if (this.isFormUpload) {
        this.status = UploadStatus.success
        if (this.onSuccess) {
          this.onSuccess()
        }
      } else {
        this.upload()
      }
    },
    handleChange(ev) {
      const { files } = ev.target
      if (files && !files.length) return
      let postFiles = Array.prototype.slice.call(files)
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1)
      }
      this.files = postFiles
      this.validateFileFormat()
    },
    upload() {
      if (!this.request) {
        // 组件内部实现自己的上传逻辑
      } else {
        // 外部上传
        this.request(this.files)
      }
      return true
    },
    cancel(file) {
      // 组件内部的取消逻辑
      this.files = this.files.filter((v) => v.name !== file.name)
      this.$refs.upload.value = null
      this.status = UploadStatus.ready
      this.onCancel && this.onCancel(file)
    },
  },
}
</script>
