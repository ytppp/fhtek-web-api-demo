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
          <fh-upload dragable ref="uploader" />
          <!-- :accept="accept"
            :before-upload="beforeUpload"
            :on-error="handleUploadError"
            :on-success="handleUploadsuccess"
            :on-cancel="handleUploadcancel" -->
        </fh-form-item>
        <fh-form-item>
          <fh-button @click="save" block :disabled="saveBtnDisabled">
            {{ $t('trans0634') }}
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
export default {
  data() {
    return {
      form: {
        type: '',
        postflag: '1',
        HTML_HEADER_TYPE: '2',
      },
      alert: '',
      saveBtnDisabled: false,
    }
  },
  methods: {
    reboot() {},
    resetDefaults() {
      dialog
        .confirm({
          okText: this.$t('trans0019'),
          cancelText: this.$t('trans0020'),
          message: this.$t('trans0225'),
          callback: {
            ok: () => {},
            cancel: () => {},
          },
        })
        .then(() => {})
        .catch(() => {})
    },
    backConfig() {
      dialog
        .confirm({
          okText: this.$t('trans0019'),
          cancelText: this.$t('trans0020'),
          message: this.$t('trans0228'),
        })
        .then(() => {})
        .catch(() => {})
    },
    save() {},
  },
}
</script>
