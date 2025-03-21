<template>
  <div class="signin">
    <div class="signin-form">
      <div style="text-align: center">
        <img class="signin-form__img" :src="logoSrc" alt="" />
      </div>
      <fh-form ref="form" :disabled="formDisabled" :model="userinfo" :rules="rules">
        <fh-form-item prop="username">
          <fh-input :placeholder="$t('trans0621')" v-model="userinfo.username" clearable>
            <template #prefix>
              <fh-icon name="icon-user" class="input__icon"></fh-icon>
            </template>
          </fh-input>
        </fh-form-item>
        <fh-form-item prop="password">
          <fh-input
            type="password"
            :placeholder="$t('trans0622')"
            v-model="userinfo.password"
            show-password
          >
            <template #prefix>
              <fh-icon name="icon-lock" class="input__icon"></fh-icon>
            </template>
          </fh-input>
        </fh-form-item>
        <fh-form-item class="signin-form__action">
          <fh-button block @click="login" :plain="false">{{ $t('trans0616') }}</fh-button>
        </fh-form-item>
      </fh-form>
      <div class="signin__forget">
        <fh-button type="text" @click="() => toggleModalVisible(true)">
          {{ $t('trans0623') }}
        </fh-button>
      </div>
      <fh-modal class="signin-modal" v-model="visible" width="25%">
        <template #body>
          <h2 class="signin-modal__title">{{ $t('trans0624') }}</h2>
          <p class="signin-modal__content">{{ $t('trans0625') }}</p>
        </template>
        <template #footer>
          <div class="signin-modal__action">
            <fh-button type="text" @click="() => toggleModalVisible(false)">
              {{ $t('trans0626') }}
            </fh-button>
          </div>
        </template>
      </fh-modal>
    </div>
  </div>
</template>

<script>
import {
  getPublicFile,
  isValidLength,
  isValidSymbol,
  getStringByte,
  specialChar,
} from '@/util/tool'
import { login } from '@/http/api'

export default {
  data() {
    return {
      visible: false,
      delayTime: 60,
      filt_lock_timer: null,
      formDisabled: false,
      logoSrc: getPublicFile(VITE_CUSTOMER_CONFIG.logo),
      userinfo: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => getStringByte(value) <= 64,
            message: this.$t('trans0005').format(this.$t('trans0053')),
          },
        ],
        password: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidLength(value, 8, 64),
            message: this.$t('trans0003').format(this.$t('trans0196'), 8, 64),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: this.$t('trans0013').format(
              this.$t('trans0196'),
              this.$t('trans0042').format(specialChar),
            ),
          },
        ],
      },
    }
  },
  computed: {
    footerInfo() {
      return `&copy;&nbsp;${this.$t('trans0009')}&nbsp;${this.$t('trans0008')}`
    },
  },
  methods: {
    toggleModalVisible(visible) {
      this.visible = visible
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    login() {
      if (this.$refs.form.validate()) {
        this.formDisabled = true
        login(this.userinfo)
          .then(() => {
            this.$router.push('/home')
          })
          .finally(() => {
            this.formDisabled = false
          })
      }
    },
    onKeyDown(e, el, fn) {
      if (typeof fn !== 'function') {
        return
      }
      let key = 0
      if (window.event) {
        key = window.event.keyCode
      } else if (e) {
        key = e.which
      }
      if (key == 13 && document.activeElement.id != el) {
        fn()
      }
    },
  },
  created() {},
  mounted() {
    document.onkeypress = (e) => this.onKeyDown(e, 'loginbutton', this.login)
  },
  beforeUnmount() {},
}
</script>

<style lang="less">
.signin {
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    margin-top: 20%;
  }
  .signin-form {
    width: 350px;
    padding: 25px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.075);
    .signin-form__img {
      display: inline-block;
      width: 200px;
    }
    .signin-form__action {
      .form-item__content {
        flex-direction: column;
      }
    }
    .input,
    .btn {
      max-width: 100% !important;
    }
    @media screen and (max-width: 768px) {
      border: none;
      box-shadow: none;
      padding: 0;
    }
  }
  .signin__forget {
    width: 100%;
    text-align: right;
    margin-top: 5px;
  }
}
.signin-modal {
  .signin-modal__title {
    text-align: center;
    font-size: 22px;
  }
  .signin-modal__content {
    margin: 0;
    padding: 0;
    margin-top: 30px;
    font-size: 16px;
  }
  .signin-modal__action {
    width: 100%;
    text-align: right;
  }
}
</style>
@/http/v1.index.js
