<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0184') }}</h1>
    </div>
    <div class="page__content">
      <fh-form
        class="form"
        ref="form"
        :model="form"
        :rules="rules"
        name="form"
        method="post"
        action="/cgi-bin/user.asp"
      >
        <input type="hidden" name="accountflg" v-model="form.accountflg" />
        <fh-form-item :label="$t('trans0053')">
          <fh-select v-model="form.username" :options="userList" name="oldUsername"> </fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0185')" prop="pwd">
          <fh-input v-model="form.pwd" type="password" show-password @blur="changePwd"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0186')" prop="confirmPwd" ref="confirmPwd">
          <fh-input v-model="form.confirmPwd" type="password" show-password name="cfmPassword">
          </fh-input>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button id="submitbutton" @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
import { isValidLength, isValidSymbol, specialChar } from '@/util/tool'
const User = {
  super: 'super',
  admin: 'admin',
  // user: user2
}
export default {
  data() {
    return {
      timeout: 1 * 1000,
      usernameStoraged: '',
      form: {
        username: '',
        pwd: '',
        confirmPwd: '',
      },
      rules: {
        pwd: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidLength(value, 8, 64),
            message: this.$t('trans0003').format(this.$t('trans0185'), 8, 64),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: this.$t('trans0013').format(
              this.$t('trans0185'),
              this.$t('trans0042').format(specialChar),
            ),
          },
        ],
        confirmPwd: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidLength(value, 8, 64),
            message: this.$t('trans0003').format(this.$t('trans0186'), 8, 64),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: this.$t('trans0013').format(
              this.$t('trans0186'),
              this.$t('trans0042').format(specialChar),
            ),
          },
          {
            rule: () => this.validatePwd(),
            message: this.$t('trans0195'),
          },
        ],
      },
    }
  },
  computed: {
    userList() {
      const superUser = {
        value: User.super,
        text: User.super,
      }
      const admin = {
        value: User.admin,
        text: User.admin,
      }
      let list = []
      if (this.usernameStoraged === User.super) {
        list = [superUser, admin]
      }
      if (this.usernameStoraged === User.admin) {
        list = [admin]
      }
      return list
    },
  },
  methods: {
    changePwd() {
      if (this.$refs.confirmPwd && this.form.confirmPwd) {
        this.$refs.confirmPwd.extraValidate(this.validatePwd, this.$t('trans0195'))
      }
    },
    validatePwd() {
      if (this.form.pwd) {
        return this.form.pwd === this.form.confirmPwd
      }
      return true
    },
    save() {
      if (this.$refs.form.validate()) {
        // todo
      }
    },
  },
  created() {
    this.form.username = this.usernameStoraged = localStorage.getItem('loginusername') // Get the logged-in user
  },
}
</script>
