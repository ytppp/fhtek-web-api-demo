<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0247') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0275')">
          <fh-switch v-model="form.enable"></fh-switch>
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0276')" v-if="systemTime">
            {{ systemTime }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0277')">
            <fh-select v-model="form.masterSntpServer" :options="ntpServerList"> </fh-select>
          </fh-form-item>
          <fh-form-item prop="otherMasterSntpServer" v-if="isOtherMaster">
            <fh-input
              v-model="form.otherMasterSntpServer"
              :placeholder="$t('trans0356')"
            ></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0278')">
            <fh-select v-model="form.slaveSntpServer" :options="slaveNtpServerList"> </fh-select>
          </fh-form-item>
          <fh-form-item prop="otherSlaveSntpServer" v-if="isOtherSlave">
            <fh-input v-model="form.otherSlaveSntpServer" :placeholder="$t('trans0356')"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0279')">
            <fh-select v-model="form.timezone" :options="timezoneList"> </fh-select>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item>
          <fh-alert type="info" :title="$t('trans0121')" show-icon :center="false" />
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
import { translate } from '@/i18n/index'
import timezoneArr from '@/i18n/locales/timezone'

const ntpServers = [
  'clock.fmt.he.net',
  'clock.nyc.he.net',
  'clock.sjc.he.net',
  'clock.via.net',
  'ntp1.tummy.com',
  'time.cachenetworks.com',
  'time.nist.gov',
]
const other = 'Other'
const none = 'None'
const ntpServerList = ntpServers.map((val) => ({
  value: val,
  text: val,
}))
ntpServerList.push({
  value: other,
  text: translate('trans0355'),
})
const timezoneObj = {
  last: '', // 上一个时区,
  index: 0, // 序号,相同时区时需要加上
}
const timezoneList = Object.entries(timezoneArr).map(([coutry, timezone]) => {
  let value = ''
  if (timezoneObj.last && timezoneObj.last === timezone) {
    timezoneObj.index += 1
    value = `${timezone}-${timezoneObj.index}`
  } else {
    timezoneObj.last = timezone
    timezoneObj.index = 0
    value = timezone
  }
  return {
    value,
    text: `(${timezone}) ${translate(coutry)}`,
  }
})
const SntpServerType = {
  master: 'master',
  slave: 'slave',
}
export default {
  name: 'TimePage',
  data() {
    return {
      form: {
        enable: false,
        masterSntpServer: ntpServerList[0].value,
        otherMasterSntpServer: '',
        slaveSntpServer: ntpServerList[0].value,
        otherSlaveSntpServer: '',
        timezone: timezoneList[0].value,
      },
      systemTime: '',
      timer: null,
      SntpServerType,
      timezoneList,
      ntpServerList,
      rules: {
        otherMasterSntpServer: [
          {
            rule: (value) => {
              if (this.isOtherMaster) {
                return value
              } else {
                return true
              }
            },
            message: this.$t('trans0004'),
          },
        ],
        otherSlaveSntpServer: [
          {
            rule: (value) => {
              if (this.isOtherSlave) {
                return value
              } else {
                return true
              }
            },
            message: this.$t('trans0004'),
          },
        ],
      },
      currTime: '',
    }
  },
  computed: {
    isOtherMaster() {
      return this.form.masterSntpServer === other
    },
    isOtherSlave() {
      return this.form.slaveSntpServer === other
    },
    slaveNtpServerList() {
      return [
        {
          value: none,
          text: this.$t('trans0357'),
        },
        ...ntpServerList,
      ]
    },
  },
  watch: {
    'form.enable': function (val) {
      this.form.autotimeFlag = val ? '0' : '2'
    },
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        if (this.isOtherMaster) {
          this.form.ntpServerOther1Flag = this.form.otherMasterSntpServer
        } else {
          this.form.ntpServerOther1Flag = this.form.masterSntpServer
        }
        if (this.isOtherSlave) {
          this.form.ntpServerOther2Flag = this.form.otherSlaveSntpServer
        } else {
          this.form.ntpServerOther2Flag = this.form.slaveSntpServer
        }
        this.form.SaveFlag = '1'
        this.loadingBeforeAction(() => {
          this.submit('form')
        })
      }
    },
  },
  created() {
    this.form.enable = true
    // this.form.timezone = ''
    // let isExist = false
    // isExist = !!this.ntpServerList.find((item) => item.value === ntpServerOther1Flag)
    // if (isExist) {
    //   this.form.masterSntpServer = ntpServerOther1Flag
    // } else {
    //   this.form.masterSntpServer = other
    //   this.form.otherMasterSntpServer = ntpServerOther1Flag
    // }
    // isExist = !!this.slaveNtpServerList.find((item) => item.value === ntpServerOther2Flag)
    // if (isExist) {
    //   this.form.slaveSntpServer = ntpServerOther2Flag
    // } else {
    //   this.form.slaveSntpServer = other
    //   this.form.otherSlaveSntpServer = ntpServerOther2Flag
    // }
    // this.currTime = new Date(currTime)
    // this.systemTime = this.formatTime(this.currTime)
    // this.timer = setInterval(() => {
    //   this.currTime = new Date(this.currTime.getTime() + 1000)
    //   this.systemTime = this.formatTime(this.currTime)
    // }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>
