<template>
  <div class="page diagnose">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0553') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0554') }}</h2>
      </div>
      <fh-form
        class="form form--padding"
        ref="pingRef"
        :model="pingForm"
        name="pingForm"
        method="post"
        :rules="rules"
        :disabled="pingFormDisabled"
      >
        <fh-form-item :label="$t('trans0140')">
          <fh-select name="interface" v-model="pingForm.interface" :options="wanList"></fh-select>
        </fh-form-item>
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
          <fh-button @click="ping" block>
            {{ $t('trans0557') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item v-if="pingResult && !pingSuccessFlag">
          <fh-alert :title="pingResult" type="error"> </fh-alert>
        </fh-form-item>
      </fh-form>
      <div class="diagnose__result" v-if="pingResult && pingSuccessFlag">
        <pre>{{ pingResult }}</pre>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0560') }}</h2>
      </div>
      <fh-form
        class="form form--padding"
        ref="tracerouteRef"
        :model="tracerouteForm"
        name="tracerouteForm"
        :rules="rules"
        :disabled="tracerouteFormDisabled"
      >
        <fh-form-item :label="$t('trans0140')">
          <fh-select
            name="interface"
            v-model="tracerouteForm.interface"
            :options="wanList"
          ></fh-select>
        </fh-form-item>
        <fh-form-item prop="destination" :label="$t('trans0556')">
          <fh-input name="destination" v-model="tracerouteForm.destination"></fh-input>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="traceroute" block>
            {{ $t('trans0557') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item v-if="tracerouteResult && !tracerouteSuccessFlag">
          <fh-alert :title="tracerouteResult" type="error"> </fh-alert>
        </fh-form-item>
      </fh-form>
      <div class="diagnose__result" v-if="tracerouteResult && tracerouteSuccessFlag">
        <pre>{{ tracerouteResult }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, useTemplateRef, ref, inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IP, NetType } from '@/util/constant'
import { isIP, isValidInteger, isValidDomain } from '@/util/tool'
import { useDataClean } from '@/hooks/data-clean'
import { useCountDown } from '@/hooks/countdown'
import {
  startPing,
  pingStatus,
  getPingResults,
  startTraceroute,
  tracerouteStatus,
  getTracerouteResults,
  getWanInfo,
} from '@/http/api'

type OperateType = 'ping' | 'traceroute'

enum Order {
  start = '1',
  stop = '2',
}
enum Status {
  testing = '1',
  done = '2',
  idle = '3',
}

const { t } = useI18n()
const { defaultVal } = useDataClean()
const loading = inject('loading')
const timeout = 1000 * 60 * 2 // 2 minutes
const interval = 5000 // 5 second
const FormDataRange = {
  repetitions: {
    min: 1,
    max: 10,
    default: '',
    unit: 'trans0563',
    label: 'trans0555',
  },
}
const wanList = reactive([])
const rules = reactive({
  repetitions: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) =>
        isValidInteger(value, FormDataRange.repetitions.min, FormDataRange.repetitions.max),
      message: t('trans0388').format(
        `'${t(FormDataRange.repetitions.label)}'`,
        FormDataRange.repetitions.min,
        FormDataRange.repetitions.max,
      ),
    },
  ],
  destination: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value) || isIP(value, IP.IPv6) || isValidDomain(value),
      message: t('trans0397'),
    },
  ],
})

function createDoingHandle(checkStatus: () => Promise<string>, cleanCountDown: () => void) {
  return () => {
    checkStatus().then((status) => {
      if (status === Status.done) {
        cleanCountDown()
      }
    })
  }
}
function createDoneHandle(key: OperateType, getResults: () => void) {
  return () => {
    sessionStorage.setItem(key, '0')
    loading.close()
    getResults()
  }
}

const getWanData = () => {
  getWanInfo().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const thisWanList = [
      {
        value: '',
        text: t('trans0487'),
      },
    ]
    items.forEach((item) => {
      if (item.protocol !== NetType.bridge) {
        thisWanList.push({
          value: item.device,
          text: `${item.wanname}(${item.interface})`,
        })
      }
    })
    Object.assign(wanList, thisWanList)
  })
}

const pingResult = ref('')
const pingRef = useTemplateRef('pingRef')
const pingFormDisabled = ref(false)
const pingSuccessFlag = ref(false)
const pingForm = reactive({
  interface: '',
  repetitions: '',
  destination: '',
})
const repetitionsTips = computed(() => {
  let tipsText = ''
  const unitText = FormDataRange.repetitions.unit ? t(FormDataRange.repetitions.unit) : defaultVal
  const defaultText = FormDataRange.repetitions.default || defaultVal
  if (FormDataRange.repetitions.min && FormDataRange.repetitions.max) {
    tipsText += `${t('trans0380')}: ${FormDataRange.repetitions.min} - ${FormDataRange.repetitions.max}`
  }
  if (FormDataRange.repetitions.default) {
    tipsText += `; ${t('trans0632')}: ${defaultText}`
  }
  if (FormDataRange.repetitions.unit) {
    tipsText += `; ${t('trans0498')}: ${unitText}`
  }
  return tipsText
})
let cleanPingCountDown: () => void
const checkPingStatus = () => pingStatus().then(({ data }) => data.status)
const doingPingHandle = createDoingHandle(checkPingStatus, () => cleanPingCountDown())
const donePingHandle = createDoneHandle('ping', () =>
  getPingResults()
    .then(({ data }) => {
      pingResult.value = data.result
      pingSuccessFlag.value = true
    })
    .catch(() => {
      pingResult.value = t('trans0558')
      pingSuccessFlag.value = false
    }),
)
const { createCountDown: createPingCountDown, cleanCountDown: _cleanPingCountDown } = useCountDown(
  timeout,
  interval,
  doingPingHandle,
  donePingHandle,
)
cleanPingCountDown = _cleanPingCountDown
const ping = () => {
  if (!pingRef.value.validate()) return
  startPing({
    interface: pingForm.interface,
    order: Order.start,
    repetitions: pingForm.repetitions,
    destination: pingForm.destination,
  }).then(({ data }) => {
    const status = data.status
    if (status === Status.testing) {
      handlePing()
    }
  })
}
const handlePing = () => {
  loading.open({
    tip: t('trans0559'),
  })
  sessionStorage.setItem('ping', '1')
  createPingCountDown()
}

const tracerouteResult = ref('')
const tracerouteRef = useTemplateRef('tracerouteRef')
const tracerouteFormDisabled = ref(false)
const tracerouteSuccessFlag = ref(false)
const tracerouteForm = reactive({
  interface: '',
  destination: '',
})
let cleanTracerouteCountDown: () => void
const checkTracerouteStatus = () => tracerouteStatus().then(({ data }) => data.status)
const doingTracerouteHandle = createDoingHandle(checkTracerouteStatus, () =>
  cleanTracerouteCountDown(),
)
const doneTracerouteHandle = createDoneHandle('traceroute', () =>
  getTracerouteResults()
    .then(({ data }) => {
      tracerouteResult.value = data.result
      tracerouteSuccessFlag.value = true
    })
    .catch(() => {
      tracerouteResult.value = t('trans0561')
      tracerouteSuccessFlag.value = false
    }),
)
const { createCountDown: createTracerouteCountDown, cleanCountDown: _cleanTracerouteCountDown } =
  useCountDown(timeout, interval, doingTracerouteHandle, doneTracerouteHandle)
cleanTracerouteCountDown = _cleanTracerouteCountDown
const traceroute = () => {
  if (!tracerouteRef.value.validate()) return
  startTraceroute({
    interface: tracerouteForm.interface,
    order: Order.start,
    destination: tracerouteForm.destination,
  }).then(({ data }) => {
    const status = data.status
    if (status === Status.testing) {
      handleTraceroute()
    }
  })
}
const handleTraceroute = () => {
  loading.open({
    tip: t('trans0562'),
  })
  sessionStorage.setItem('traceroute', '1')
  createTracerouteCountDown()
}

onMounted(() => {
  getWanData()
  if (sessionStorage.getItem('ping') === '1') {
    loading.open({
      tip: t('trans0559'),
    })
    checkPingStatus().then((status) => {
      if (status === Status.testing) {
        createPingCountDown()
      } else if (status === Status.done || status === Status.idle) {
        donePingHandle()
      }
    })
  }
  if (sessionStorage.getItem('traceroute') === '1') {
    loading.open({
      tip: t('trans0562'),
    })
    checkTracerouteStatus().then((status) => {
      if (status === Status.testing) {
        createTracerouteCountDown()
      } else if (status === Status.done || status === Status.idle) {
        doneTracerouteHandle()
      }
    })
  }
})
</script>

<style lang="less">
.diagnose {
  .diagnose__result {
    margin-top: 20px;
    border-radius: 4px;
    border: solid 1px #bdbdbd;
    padding: 10px;
    max-height: 600px;
    overflow-x: hidden;
    font-size: 14px;
    pre {
      font-family: 'Courier New', Courier, monospace;
      color: #000;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
</style>
