<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0553') }}</h1>
    </div>
    <div class="page__content page__content--padding-small">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0554') }}</h2>
      </div>
      <fh-form
        class="form form--padding"
        ref="pingForm"
        :model="pingForm"
        name="pingForm"
        method="post"
        :rules="rules"
        :disabled="pingFormDisabled"
      >
        <input type="hidden" name="ping_commitflag" v-model="ping_commitflag" />
        <input type="hidden" name="interface" v-model="interface" />
        <input type="hidden" name="ping_test" v-model="pingForm.ping_test" />
        <fh-form-item prop="repetitions" :label="$t('trans0555')">
          <fh-input name="repetitions" v-model="pingForm.repetitions"></fh-input>
          <template #extra>
            {{ repetitionsTips }}
          </template>
        </fh-form-item>
        <fh-form-item prop="destination" :label="$t('trans0556')">
          <fh-input name="destination" v-model="pingForm.destination"></fh-input>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="startPing" block>
            {{ $t('trans0557') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div v-if="pingResult" style="padding: 20px">
        <iframe
          v-if="isPingPass"
          src="/cgi-bin/getPingResult.cgi"
          frameborder="0"
          width="100%"
          height="300px"
        ></iframe>
        <fh-alert v-else :title="$t('trans0558')" type="error"> </fh-alert>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0560') }}</h2>
      </div>
      <fh-form
        class="form form--padding"
        ref="tracerouteForm"
        :model="tracerouteForm"
        name="tracerouteForm"
        method="post"
        :rules="rules"
        :disabled="tracerouteFormDisabled"
      >
        <input type="hidden" name="tracert_commitflag" v-model="tracert_commitflag" />
        <input type="hidden" name="interface" v-model="interface" />
        <input type="hidden" name="tracer_test" v-model="tracerouteForm.tracer_test" />
        <fh-form-item prop="destination" :label="$t('trans0556')">
          <fh-input name="destination" v-model="tracerouteForm.destination"></fh-input>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="startTraceroute" block>
            {{ $t('trans0557') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div style="padding: 20px" v-if="tracertResult">
        <iframe
          v-if="isTracertPass"
          src="/cgi-bin/getTracentResult.cgi"
          frameborder="0"
          width="100%"
          height="300px"
        ></iframe>
        <fh-alert v-else :title="$t('trans0561')" type="error"> </fh-alert>
      </div>
    </div>
  </div>
</template>

<script>
import { IP } from '@/util/constant'
import { isIP, isValidInteger, isValidDomain } from '@/util/tool'

const FormDataRange = {
  repetitions: {
    min: 1,
    max: 10,
    default: '',
    unit: 'trans0563',
    label: 'trans0555',
  },
}
const FormType = {
  pingForm: 'pingForm',
  tracerouteForm: 'tracerouteForm',
}
const Result = {
  pass: 'PASS',
  fail: 'Fail',
}
const Status = {
  start: 1,
  testing: 2,
  done: 3,
}
const PingPageStatus = 'DiagnosticPingPageStatus='
const TracertPageStatus = 'DiagnosticTracertPageStatus='
export default {
  name: 'DiagnoseInternet',
  data() {
    return {
      pingResult: '',
      tracertResult: '',
      doManaulRep: 0,
      interface: '',
      pingForm: {
        repetitions: '',
        destination: '',
        ping_test: 0,
      },
      pingFormDisabled: false,
      tracerouteForm: {
        destination: '',
        tracer_test: 0,
      },
      tracerouteFormDisabled: false,
      rules: {
        repetitions: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) =>
              isValidInteger(value, FormDataRange.repetitions.min, FormDataRange.repetitions.max),
            message: this.$t('trans0388').format(
              `'${this.$t(FormDataRange.repetitions.label)}'`,
              FormDataRange.repetitions.min,
              FormDataRange.repetitions.max,
            ),
          },
        ],
        destination: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isIP(value) || isIP(value, IP.IPv6) || isValidDomain(value),
            message: this.$t('trans0397'),
          },
        ],
      },
    }
  },
  computed: {
    repetitionsTips() {
      let tipsText = ''
      const unit = FormDataRange.repetitions.unit
        ? this.$t(FormDataRange.repetitions.unit)
        : this.defaultVal
      const defaultVal = FormDataRange.repetitions.default || this.defaultVal
      if (FormDataRange.repetitions.min && FormDataRange.repetitions.max) {
        tipsText += `${this.$t('trans0380')}: ${FormDataRange.repetitions.min} - ${FormDataRange.repetitions.max}`
      }
      if (FormDataRange.repetitions.default) {
        tipsText += `; ${this.$t('trans0632')}: ${FormDataRange.repetitions.default}`
      }
      if (FormDataRange.repetitions.unit) {
        tipsText += `; ${this.$t('trans0498')}: ${this.$t(FormDataRange.repetitions.unit)}`
      }
      return tipsText
    },
    isPingPass() {
      return this.pingResult === Result.pass
    },
    isTracertPass() {
      return this.tracertResult === Result.pass
    },
  },
  methods: {
    refreshPage(formType, type) {
      if (formType === FormType.pingForm) {
        this.ping(type)
      } else if (formType === FormType.tracerouteForm) {
        this.traceroute(type)
      }
    },
    setCookie(key, val) {
      document.cookie = `${key}${val}`
    },
    getCookie(key) {
      if (document.cookie.length > 0) {
        let tstart = document.cookie.indexOf(`${key}`)
        if (tstart != -1) {
          tstart += key.length
          let tend = document.cookie.indexOf(';', tstart)
          if (tend == -1) tend = document.cookie.length
          return document.cookie.substring(tstart, tend)
        }
      }
    },
    submit(formType = FormType.form) {
      this.$nextTick(() => {
        let form = null
        switch (formType) {
          case FormType.pingForm:
            form = document.pingForm
            break
          case FormType.tracerouteForm:
            form = document.tracerouteForm
            break
          default:
            form = document.pingForm
        }
        if (setEBooValueCookie(form)) {
          form.submit()
        }
      })
    },
    ping(status) {
      this.setCookie(PingPageStatus, status)
      this.ping_commitflag = 1
      this.submit('pingForm')
    },
    traceroute(status) {
      this.setCookie(TracertPageStatus, status)
      this.tracert_commitflag = 1
      this.submit('tracerouteForm')
    },
    startPing() {
      if (this.$refs.pingForm.validate()) {
        this.pingForm.ping_test = 1
        this.ping(Status.start)
      }
    },
    startTraceroute() {
      if (this.$refs.tracerouteForm.validate()) {
        this.tracerouteForm.tracer_test = 1
        this.traceroute(Status.start)
      }
    },
  },
  created() {
    // this.interface = interface
    // this.doManaulRep = doManaulRep || 0
  },
  mounted() {
    // const testingTime = 15000
    // let status = this.getCookie(PingPageStatus)
    // if (this.doManaulRep) {
    //   this.cleanDataObj(pingForm)
    //   this.pingForm = pingForm
    //   if (status == Status.start) {
    //     this.pingFormDisabled = true
    //     loading.open({
    //       tip: this.$t('trans0559'),
    //     })
    //     setTimeout(() => {
    //       loading.close()
    //       this.refreshPage(FormType.pingForm, Status.testing)
    //     }, testingTime)
    //   } else if (status == Status.testing) {
    //     this.pingResult = pingResult
    //     this.setCookie(PingPageStatus, Status.done)
    //   }
    // }
    // status = this.getCookie(TracertPageStatus)
    // if (this.doManaulRep) {
    //   this.cleanDataObj(tracerouteForm)
    //   this.tracerouteForm = tracerouteForm
    //   if (status == Status.start) {
    //     this.tracerouteFormDisabled = true
    //     loading.open({
    //       tip: this.$t('trans0562'),
    //     })
    //     setTimeout(() => {
    //       loading.close()
    //       this.refreshPage(FormType.tracerouteForm, Status.testing)
    //     }, testingTime)
    //   } else if (status == Status.testing) {
    //     this.tracertResult = tracertResult
    //     this.setCookie(TracertPageStatus, Status.done)
    //   }
    // }
  },
}
</script>
