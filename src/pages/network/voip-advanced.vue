<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0579') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form" :rules="rules" v-if="hasVoipWan">
        <div class="voip-form__box">
          <span class="voip-form__title">{{ $t('trans0924') }}</span>
          <fh-form-item :label="$t('trans0842')" prop="registrationExpireTimer">
            <fh-input v-model="form.registrationExpireTimer"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0843')" prop="maxStartDelay">
            <fh-input v-model="form.maxStartDelay"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0844')" prop="registerRetryInterval">
            <fh-input v-model="form.registerRetryInterval"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0845')" prop="dmStartTime">
            <fh-input v-model="form.dmStartTime"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0846')" prop="dmShortTime">
            <fh-input v-model="form.dmShortTime"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0847')" prop="dmLongTime">
            <fh-input v-model="form.dmLongTime"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0848')" prop="dmTTime">
            <fh-input v-model="form.dmTTime"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0849')" prop="busytonetimer">
            <fh-input v-model="form.busytonetimer"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0850')" prop="hangingremindertimer">
            <fh-input v-model="form.hangingremindertimer"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0851')" prop="noanswertimer">
            <fh-input v-model="form.noanswertimer"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0852')">
            <fh-select v-model="form.dmTMode" :options="dmTModeOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0853')">
            <fh-select v-model="form.dtmfRelay" :options="dtmfRelayOpts"></fh-select>
          </fh-form-item>
          <fh-form-item
            :label="$t('trans0908')"
            prop="telEventPayloadType"
            v-if="form.dtmfRelay === DtmfRelay.rfc2833"
          >
            <fh-input v-model="form.telEventPayloadType"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0854')">
            <fh-select v-model="form.faxctrlMode" :options="faxctrlModeOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0855')">
            <fh-select v-model="form.faxpassthru" :options="faxpassthruOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0856')">
            <fh-select
              v-model="form.hotLineImplementStyle"
              :options="hotLineImplementStyleOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0857')">
            <fh-switch v-model="form.msgIfContainsUserPhone"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0858')">
            <fh-switch v-model="form.supportTransferHash"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0859')">
            <fh-switch v-model="form.supportTransferAt"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0860')">
            <fh-switch v-model="form.supportT38"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0861')">
            <fh-switch v-model="form.enableComfortnoise"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0862')">
            <fh-switch v-model="form.enableSilenceCompression"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0863')">
            <fh-switch v-model="form.ifSendUnregisterMsg"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0864')">
            <fh-switch v-model="form.enableEchoCancel"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0865')">
            <fh-select
              v-model="form.enableLowSpeedFaxEchoCancel"
              :options="enableLowSpeedFaxEchoCancelOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0866')">
            <fh-switch v-model="form.enableAdaptiveJitterBuffer"></fh-switch>
          </fh-form-item>
          <fh-form-item
            :label="$t('trans0867')"
            prop="jitterBufferMax"
            v-if="form.enableAdaptiveJitterBuffer"
          >
            <fh-input v-model="form.jitterBufferMax"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0868')">
            <fh-select v-model="form.g723Speed" :options="g723SpeedOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0869')">
            {{ form.line }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0868')">
            <fh-select v-model="form.g722" :options="numOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0871')">
            <fh-select v-model="form.g711ALaw" :options="numOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0872')">
            <fh-select v-model="form.g711ULaw" :options="numOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0873')">
            <fh-select v-model="form.g729" :options="numOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0874')">
            <fh-select v-model="form.g723" :options="numOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0875')">
            <fh-select v-model="form.ptimeSetup" :options="ptimeSetupOpts"></fh-select>
          </fh-form-item>
        </div>
        <!-- volume setup(db) start -->
        <div class="voip-form__box">
          <span class="voip-form__title">{{ $t('trans0896') }}</span>
          <fh-form-item :label="$t('trans0869')">
            {{ form.volume.line }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0876')" prop="volume.send">
            <fh-input v-model="form.volume.send"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0877')" prop="volume.receive">
            <fh-input v-model="form.volume.receive"> </fh-input>
          </fh-form-item>
        </div>
        <!-- volume setup(db) end -->
        <!-- new table for complement service start -->
        <div class="voip-form__box">
          <span class="voip-form__title">{{ $t('trans0897') }}</span>
          <fh-form-item :label="$t('trans0869')">
            {{ form.complementServiceLine }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0878')">
            <fh-switch v-model="form.warmLine"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0879')" prop="warmLineNumber">
            <fh-input v-model="form.warmLineNumber"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0880')" prop="warmLineTimeout">
            <fh-input v-model="form.warmLineTimeout"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0881')">
            <fh-switch v-model="form.callwaiting"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0882')">
            <fh-switch v-model="form.calltransfer"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0883')" prop="callforwardingNumber">
            <fh-input v-model="form.callforwardingNumber"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0922')">
            <fh-select
              v-model="form.callForwardingMode"
              :options="callForwardingModeOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0883')" prop="callforwardingNumber">
            <fh-input v-model="form.callforwardingNumber"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0887')" prop="callForwardingOnNoAnswerTime">
            <fh-input v-model="form.callForwardingOnNoAnswerTime"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0888')">
            <fh-switch v-model="form.threePartyService"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0889')">
            <fh-switch v-model="form.enableServerMix"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0890')" prop="threePartyMeetingResourceAccessCode">
            <fh-input v-model="form.threePartyMeetingResourceAccessCode"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0891')">
            <fh-select v-model="form.callerIdMode" :options="callerIdModeOpts"></fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0892')" prop="minFlashHookTimeInterval">
            <fh-input v-model="form.minFlashHookTimeInterval"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0893')" prop="maxFlashHookTimeInterval">
            <fh-input v-model="form.maxFlashHookTimeInterval"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0894')" prop="minFlashHookTimeRelease">
            <fh-input v-model="form.minFlashHookTimeRelease"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0895')">
            <fh-switch v-model="form.syncPhoneDateTime"></fh-switch>
          </fh-form-item>
        </div>
        <!-- new table for complement service end -->
        <!-- Digimap Setup start -->
        <div class="voip-form__box">
          <span class="voip-form__title">{{ $t('trans0898') }}</span>
          <fh-form-item :label="$t('trans0899')">
            <fh-switch v-model="form.enableDigitMap"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0902')" prop="digitMap" v-if="form.enableDigitMap">
            <fh-input v-model="form.digitMap"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0900')">
            <fh-switch v-model="form.enableDigitMapSpecial"></fh-switch>
          </fh-form-item>
          <fh-form-item
            :label="$t('trans0903')"
            prop="digitMapSpecial"
            v-if="form.enableDigitMapSpecial"
          >
            <fh-input v-model="form.digitMapSpecial"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0901')">
            <fh-switch v-model="form.enablePBXPrefix"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0904')" prop="pbxPrefix" v-if="form.enablePBXPrefix">
            <fh-input v-model="form.pbxPrefix"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0905')">
            <fh-switch v-model="form.enablePBXDialSecondary"></fh-switch>
          </fh-form-item>
        </div>
        <!-- Digimap Setup end -->
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0604') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getIpBefore,
  getIpAfter,
  isIP,
  ip2int,
  isMulticast,
  isLoopback,
  isNetworkIP,
  isBoardcastIP,
  isValidGatewayIP,
  getSubNetwork,
} from '@/util/tool'
import { getLan, setLan } from '@/http/api'

defineOptions({
  name: 'VoipAdvancedPage',
})

enum DmTMode {
  dmShortTimer = '0',
  dmLongTimer = '1',
  dmTTimer = '2',
}
enum DtmfRelay {
  sipInfo = '0',
  rfc2833 = '1',
  inBand = '2',
}
enum FaxctrlMode {
  passThru = '0',
  t30fullcontrol = '1',
}
enum Faxpassthru {
  pcmu = '0',
  pcma = '1',
}
enum HotLineImplementStyle {
  reportUserNumber = '0',
  reportNoDial = '1',
  reportActivationCode = '2',
}
enum EnableLowSpeedFaxEchoCancel {
  close = '0',
  open = '1',
  auto = '2',
}
enum CallForwardingMode {
  unconditionally = '0',
  busy = '1',
  noAnswer = '2',
}
enum CallerIdMode {
  fsk = '0',
  dtmf = '1',
}

const generateNumberOpts = (max: number, start: number, step: number) => {
  const arr = []
  for (let i = start; i <= max; i += step) {
    arr.push({ value: i, text: i })
  }
  return arr
}

const { t } = useI18n()
const formRef = ref(null)
const hasVoipWan = ref(true)
const dmTModeOpts = [
  {
    value: DmTMode.dmShortTimer,
    text: t('trans0909'),
  },
  {
    value: DmTMode.dmLongTimer,
    text: t('trans0910'),
  },
  {
    value: DmTMode.dmTTimer,
    text: t('trans0911'),
  },
]
const dtmfRelayOpts = [
  {
    value: DtmfRelay.sipInfo,
    text: t('trans0911'),
  },
  {
    value: DtmfRelay.rfc2833,
    text: t('trans0912'),
  },
  {
    value: DtmfRelay.inBand,
    text: t('trans0913'),
  },
]
const faxctrlModeOpts = [
  {
    value: FaxctrlMode.passThru,
    text: t('trans0920'),
  },
  {
    value: FaxctrlMode.t30fullcontrol,
    text: t('trans0921'),
  },
]
const faxpassthruOpts = [
  {
    value: Faxpassthru.pcmu,
    text: t('trans0915'),
  },
  {
    value: Faxpassthru.pcma,
    text: t('trans0916'),
  },
]
const hotLineImplementStyleOpts = [
  {
    value: HotLineImplementStyle.reportUserNumber,
    text: t('trans0915'),
  },
  {
    value: HotLineImplementStyle.reportNoDial,
    text: t('trans0916'),
  },
  {
    value: HotLineImplementStyle.reportActivationCode,
    text: t('trans0916'),
  },
]
const enableLowSpeedFaxEchoCancelOpts = [
  {
    value: EnableLowSpeedFaxEchoCancel.close,
    text: t('trans0054'),
  },
  {
    value: EnableLowSpeedFaxEchoCancel.open,
    text: t('trans0103'),
  },
  {
    value: EnableLowSpeedFaxEchoCancel.auto,
    text: t('trans0571'),
  },
]
const g723SpeedMin = 5.3
const numMin = 0
const ptimeSetupMin = 10
const g723SpeedOpts = generateNumberOpts(6.3, g723SpeedMin, 1)
const numOpts = generateNumberOpts(7, numMin, 1)
const ptimeSetupOpts = generateNumberOpts(30, ptimeSetupMin, 10)
const callForwardingModeOpts = [
  {
    value: CallForwardingMode.unconditionally,
    text: t('trans0884'),
  },
  {
    value: CallForwardingMode.busy,
    text: t('trans0885'),
  },
  {
    value: CallForwardingMode.noAnswer,
    text: t('trans0886'),
  },
]
const callerIdModeOpts = [
  {
    value: CallerIdMode.fsk,
    text: t('trans0906'),
  },
  {
    value: CallerIdMode.dtmf,
    text: t('trans0907'),
  },
]
const form = reactive({
  registrationExpireTimer: '',
  maxStartDelay: '',
  registerRetryInterval: '',
  dmStartTime: '',
  dmShortTime: '',
  dmLongTime: '',
  dmTTime: '',
  busytonetimer: '',
  hangingremindertimer: '',
  noanswertimer: '',
  dmTMode: DmTMode.dmShortTimer,
  dtmfRelay: DtmfRelay.sipInfo,
  telEventPayloadType: '',
  faxctrlMode: FaxctrlMode.passThru,
  faxpassthru: Faxpassthru.pcmu,
  hotLineImplementStyle: HotLineImplementStyle.reportUserNumber,
  msgIfContainsUserPhone: true,
  supportTransferHash: true, // #
  supportTransferAt: true, // @
  supportT38: true,
  enableComfortnoise: true,
  enableSilenceCompression: true,
  ifSendUnregisterMsg: true,
  enableEchoCancel: true,
  enableLowSpeedFaxEchoCancel: EnableLowSpeedFaxEchoCancel.close,
  enableAdaptiveJitterBuffer: true,
  jitterBufferMax: '',
  g723Speed: g723SpeedMin,
  line: '',
  g722: numMin,
  g711ALaw: numMin,
  g711ULaw: numMin,
  g729: numMin,
  g723: numMin,
  ptimeSetup: ptimeSetupMin,
  volume: {
    line: '',
    send: '',
    receive: '',
  },
  complementServiceLine: '',
  warmLine: true,
  warmLineNumber: '',
  warmLineTimeout: '',
  callwaiting: true,
  calltransfer: true,
  callforwardingNumber: '',
  callForwardingMode: CallForwardingMode.unconditionally,
  callForwardingOnNoAnswerTime: '',
  threePartyService: true,
  enableServerMix: true,
  threePartyMeetingResourceAccessCode: '',
  callerIdMode: CallerIdMode.fsk,
  minFlashHookTimeInterval: '',
  maxFlashHookTimeInterval: '',
  minFlashHookTimeRelease: '',
  syncPhoneDateTime: true,
  enableDigitMap: true,
  digitMap: '',
  enableDigitMapSpecial: true,
  digitMapSpecial: '',
  enablePBXPrefix: true,
  pbxPrefix: '',
  enablePBXDialSecondary: true,
})
const rules = reactive({
  registrationExpireTimer: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  maxStartDelay: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  registerRetryInterval: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  dmStartTime: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  dmShortTime: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  dmLongTime: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  dmTTime: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  busytonetimer: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  hangingremindertimer: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  noanswertimer: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  telEventPayloadType: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  jitterBufferMax: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'volume.send': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'volume.receive': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  warmLineNumber: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  warmLineTimeout: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  callforwardingNumber: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  callForwardingOnNoAnswerTime: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  threePartyMeetingResourceAccessCode: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  minFlashHookTimeInterval: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  maxFlashHookTimeInterval: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  minFlashHookTimeRelease: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  digitMap: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  digitMapSpecial: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  pbxPrefix: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
})
const save = () => {
  formRef.value.validate().then(() => {
    // todo
  })
}
</script>

<style lang="less">
.voip-form__box {
  margin-top: 20px;
  border: 1px dashed #e1e1e1;
  padding: 8px;
  position: relative;
}
.voip-form__title {
  position: absolute;
  top: -6px;
  left: 0px;
  color: #e1e1e1;
}
</style>
