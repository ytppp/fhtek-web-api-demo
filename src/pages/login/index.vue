<template>
  <div class="signin">
    <div class="signin-form">
      <div style="text-align: center">
        <!-- <img class="signin-form__img" src="@/assets/customer-conf/fhtek/images/logo.png" alt="" /> -->
        {{ getUrl(VITE_CUSTOMER_CONFIG.logo) }}
        <img class="signin-form__img" :src="getUrl(VITE_CUSTOMER_CONFIG.logo)" alt="" />
      </div>
      <fh-form
        ref="form"
        id="loginForm"
        method="post"
        :disabled="formDisabled"
        :model="userinfo"
        :rules="rules"
      >
        <fh-form-item prop="username">
          <fh-input :placeholder="$t('trans0621')" v-model="userinfo.username" name="username">
            <template v-slot:prefix>
              <fh-icon name="icon-user" class="input__icon"></fh-icon>
            </template>
          </fh-input>
        </fh-form-item>
        <fh-form-item prop="password">
          <fh-input
            type="password"
            :placeholder="$t('trans0622')"
            v-model="userinfo.password"
            name="password"
            show-password
          >
            <template v-slot:prefix>
              <fh-icon name="icon-lock" class="input__icon"></fh-icon>
            </template>
          </fh-input>
        </fh-form-item>
        <fh-form-item class="signin-form__action">
          <fh-button id="loginbutton" block @click="login" :plain="false">{{
            $t('trans0616')
          }}</fh-button>
          <div class="signin-form__forget">
            <fh-button type="text" @click="() => toggleModalVisible(true)">
              {{ $t('trans0623') }}
            </fh-button>
          </div>
        </fh-form-item>
        <fh-form-item v-show="alert">
          <fh-alert :title="alert" type="error"> </fh-alert>
        </fh-form-item>
      </fh-form>
      <fh-modal class="signin-modal" v-model:visible="visible" width="25%">
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
import { specialChar, getUrl } from '@/util/tool'

export default {
  data() {
    return {
      visible: false,
      delayTime: 60,
      filt_lock_timer: null,
      alert: '',
      formDisabled: false,
      VITE_CUSTOMER_CONFIG: VITE_CUSTOMER_CONFIG,
      logoSrc: getUrl(VITE_CUSTOMER_CONFIG.logo),
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
    getUrl(url) {
      return getUrl(url)
    },
    getsec(str) {
      const str1 = str.substring(1, str.length) * 1
      const str2 = str.substring(0, 1)
      if (str2 == 's') {
        return str1 * 1000
      } else if (str2 == 'h') {
        return str1 * 60 * 60 * 1000
      } else if (str2 == 'd') {
        return str1 * 24 * 60 * 60 * 1000
      }
    },
    SET_C_T(name, value, time) {
      const strsec = this.getsec(time)
      const exp = new Date()
      exp.setTime(exp.getTime() + strsec * 1)
      document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/;'
    },
    SET_C(name, value) {
      document.cookie = name + '=' + escape(value) + ';path=/;'
    },
    DEL_C(name) {
      const exp = new Date()
      exp.setTime(exp.getTime() - 10000)
      document.cookie = name + '=del;expires=' + exp.toGMTString()
      document.cookie = name + '=del;expires=' + exp.toGMTString() + ';path=/;'
    },
    toggleModalVisible(visible) {
      this.visible = visible
    },
    filt_lock_time() {
      this.filt_lock_timer = setInterval(() => {
        this.alert = this.$t('trans0010').format(this.delayTime)
        if (this.delayTime > 0) {
          this.delayTime--
        } else {
          clearTimeout(this.filt_lock_timer)
          this.filt_lock_timer = null
          this.formDisabled = false
          this.alert = ''
          window.location.href = '/cgi-bin/login.asp'
        }
      }, 1000)
    },
    login() {
      if (this.$refs.form.validate()) {
        const form = $('#loginForm')
        $.ajax({
          url: '/cgi-bin/check_auth.json',
          type: form.attr('method'),
          data: form.serialize(),
          dataType: 'json',
          beforeSend: () => {
            this.formDisabled = true
          },
          error: () => {
            this.formDisabled = false
          },
          success: (result) => {
            if ('1' == result.Locked) {
              // Login fail three times, webpage locked for 60s
              this.delayTime = delayTime
              this.formDisabled = true
              this.alert = this.$t('trans0011').format(3)
              this.filt_lock_time()
            } else if ('1' == result.Logged) {
              // Fhtek account is login!
              this.formDisabled = false
              this.alert = this.$t('trans0012')
            } else if ('2' == result.Logged) {
              // User account is already login!
              this.formDisabled = false
              this.alert = this.$t('trans0012')
            } else if ('0' == result.Privilege) {
              // Login fail
              this.formDisabled = false
              this.alert = this.$t('trans0011').format(Number(result.Logintimes))
            } else if ('1' == result.Privilege || '2' == result.Privilege) {
              // Login success
              this.formDisabled = false
              const role = Role.super
              sessionStorage.setItem('role', role)
              sessionStorage.setItem('meshRole', meshRole)
              this.SET_C('ecntToken', result.ecntToken)
              localStorage.setItem('loginusername', this.userinfo.username)
              window.location.href = '/cgi-bin/home.asp'
            }
          },
        })
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
    .signin-form__forget {
      width: 100%;
      text-align: right;
      margin-top: 5px;
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
