<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0227') }}</h1>
    </div>
    <div class="page__content page__content--padding-small">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0224') }}</h2>
      </div>
      <fh-form class="form form--padding" :model="resetForm" name="resetForm" method="post">
        <input type="hidden" id="defaultflag" name="defaultflag" v-model="resetForm.defaultflag" />
        <input
          type="hidden"
          id="restoreflag2"
          name="restoreflag2"
          v-model="resetForm.restoreflag2"
        />
        <fh-form-item>
          <fh-button @click="resetDefaults" block>
            {{ $t('trans0224') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0224') }}</h2>
      </div>
      <fh-form class="form form--padding" :model="resetForm" name="resetForm" method="post">
        <input type="hidden" id="defaultflag" name="defaultflag" v-model="resetForm.defaultflag" />
        <input
          type="hidden"
          id="restoreflag2"
          name="restoreflag2"
          v-model="resetForm.restoreflag2"
        />
        <fh-form-item>
          <fh-button @click="resetDefaults" block>
            {{ $t('trans0224') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0643') }}</h2>
      </div>
      <fh-form
        class="form form--padding"
        enctype="multipart/form-data"
        ref="form"
        :disabled="formDisabled"
        :model="form"
        name="form"
        method="post"
      >
        <input type="hidden" name="postflag" v-model="form.postflag" />
        <input type="hidden" name="HTML_HEADER_TYPE" v-model="form.HTML_HEADER_TYPE" />
        <input type="hidden" name="upload_type" v-model="form.type" />
        <fh-form-item :label="$t('trans0226')">
          <fh-button @click="backConfig" block>
            {{ $t('trans0226') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item :label="$t('trans0634')">
          <fh-upload dragable ref="uploader" name="FW_UploadFile" />
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
      tip: true,
      isReset: false,
      resetForm: {
        defaultflag: '0',
        restoreflag2: '0',
      },
      form: {
        type: '',
        postflag: '1',
        HTML_HEADER_TYPE: '2',
      },
    }
  },
  computed: {},
  methods: {
    resetDefaults() {
      dialog.confirm({
        okText: this.$t('trans0019'),
        cancelText: this.$t('trans0020'),
        message: this.$t('trans0225'),
        callback: {
          ok: () => {},
          cancel: () => {},
        },
      })
    },
    backConfig() {
      dialog.confirm({
        okText: this.$t('trans0019'),
        cancelText: this.$t('trans0020'),
        message: this.$t('trans0228'),
        callback: {
          ok: () => {},
          cancel: () => {},
        },
      })
    },
    reseting() {
      this.isStopRefresh = true
      loading.open({
        tip: this.$t('trans0617'),
      })
      setTimeout(() => {
        loading.close()
      }, 1000)
    },
  },
}
</script>
