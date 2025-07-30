<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0579') }}</h1>
    </div>
    <div class="page__content">
      <fh-form
        class="form form--small"
        ref="formRef"
        :rules="rules"
        :model="form"
        v-if="hasVoipWan"
      >
        <fh-form-item :label="$t('trans0842')" prop="registrationExpireTimer">
          <fh-input v-model="form.registrationExpireTimer"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0843')" prop="maxStartDelay">
          <fh-input v-model="form.maxStartDelay"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0844')" prop="registerRetryInterval">
          <fh-input v-model="form.registerRetryInterval"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0853')">
          <fh-select v-model="form.dtmfRelay" :options="dtmfRelayOpts"></fh-select>
        </fh-form-item>
        <fh-form-item label="Heartbeat Options mode">
          <fh-select v-model="form.optionsSericeMode" :options="optionsSericeModeOpts"></fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0854')">
          <fh-select v-model="form.faxCtrlMode" :options="faxctrlModeOpts"></fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0855')">
          <fh-select v-model="form.faxpassthru" :options="faxpassthruOpts"></fh-select>
        </fh-form-item>
        <fh-form-item label="RTP Redundancy">
          <fh-switch v-model="form.rtpRedundantEnable"></fh-switch>
        </fh-form-item>
        <fh-form-item label="RTP Paylod Type" prop="rtpRedundantPT">
          <fh-input v-model="form.rtpRedundantPT" placeholder="96-127"> </fh-input>
        </fh-form-item>
        <fh-form-item label="Message Contains User=phone Or Not">
          <fh-select v-model="form.msgWithUserEnable" :options="msgWithUserOpts"></fh-select>
        </fh-form-item>
        <fh-form-item label="Voice Codec Priority Control">
          <fh-select
            v-model="form.voiceCodecPriorityCtrl"
            :options="voiceCodecPriorityCtrlOpts"
          ></fh-select>
        </fh-form-item>
        <fh-form-item label="Number Match Mode">
          <fh-select v-model="form.numberMatchMode" :options="numberMatchModeOpts"></fh-select>
        </fh-form-item>
        <fh-form-item label="Div Supplement Service Type">
          <fh-select
            v-model="form.actLocalSupplementService"
            :options="actLocalSupplementServiceOpts"
          ></fh-select>
        </fh-form-item>
        <fh-form-item label="End Character Handle Mode">
          <fh-select v-model="form.endCharHandleMode" :options="endCharHandleModeOpts"></fh-select>
        </fh-form-item>
        <fh-form-item label="Support#transfer%23">
          <fh-switch v-model="form.supportTransferHash"></fh-switch>
        </fh-form-item>
        <fh-form-item label="Support@transfer%40">
          <fh-switch v-model="form.supportTransferAt"></fh-switch>
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
        <fh-form-item label="Auto Synchronize Phone Date Switch">
          <fh-switch v-model="form.callSynEnAutoSwitch"></fh-switch>
        </fh-form-item>
        <fh-form-item label="If Synchronize System Date">
          <fh-switch v-model="form.syncSysTimeEnable"></fh-switch>
        </fh-form-item>
        <!-- basic_common start -->
        <div class="page__sub-header">
          <h2 class="page__title">Basic Common Setting</h2>
        </div>
        <fh-form-item
          label="Telephone Event Payload Type"
          prop="basic_common.TelephoneEventPayloadType"
        >
          <fh-input v-model="form.basic_common.TelephoneEventPayloadType"> </fh-input>
        </fh-form-item>
        <fh-form-item label="Nat Keep Alive Message">
          <fh-switch v-model="form.basic_common.HeartbeatSwitch"></fh-switch>
        </fh-form-item>
        <fh-form-item label="Nat Keep Alive Time(s)" prop="basic_common.HeartbeatCycle">
          <fh-input v-model="form.basic_common.HeartbeatCycle"> </fh-input>
        </fh-form-item>
        <fh-form-item label="Enable 802.1p">
          <fh-switch v-model="form.basic_common.VoIP8021PMarkEnable"></fh-switch>
        </fh-form-item>
        <template v-if="form.basic_common.VoIP8021PMarkEnable">
          <fh-form-item label="802.1p(SIP)[0-7]" prop="basic_common.SIP8021PMark">
            <fh-input v-model="form.basic_common.SIP8021PMark"> </fh-input>
          </fh-form-item>
          <fh-form-item label="802.1p(RTP)[0-7]" prop="basic_common.RTP8021PMark">
            <fh-input v-model="form.basic_common.RTP8021PMark"> </fh-input>
          </fh-form-item>
        </template>
        <fh-form-item label="Enable Session Timer">
          <fh-switch v-model="form.basic_common.SC_ACCT_SIP_SESSION_FLAG"></fh-switch>
        </fh-form-item>
        <template v-if="form.basic_common.SC_ACCT_SIP_SESSION_FLAG">
          <fh-form-item label="Session Timer(s)" prop="basic_common.SC_ACCT_SIP_SESSION_TIMER">
            <fh-input v-model="form.basic_common.SC_ACCT_SIP_SESSION_TIMER"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Min Session Timer(s)" prop="basic_common.SC_ACCT_SIP_SESSION_MIN_EXP">
            <fh-input v-model="form.basic_common.SC_ACCT_SIP_SESSION_MIN_EXP"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Session Refresher Rule">
            <fh-select
              v-model="form.basic_common.SC_ACCT_SIP_SESSION_REFRESHER"
              :options="sessionRefresherRuleOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="Session Update Method">
            <fh-select
              v-model="form.basic_common.SC_ACCT_SIP_SESSION_METHOD"
              :options="sessionUpdateMethodOpts"
            ></fh-select>
          </fh-form-item>
        </template>
        <fh-form-item :label="$t('trans0863')">
          <fh-switch v-model="form.basic_common.ifSendUnregisterMsg"></fh-switch>
        </fh-form-item>
        <fh-form-item label="TOS/DSCP Priority(SIP)" prop="basic_common.SIPDSCPMark">
          <fh-input v-model="form.basic_common.SIPDSCPMark"> </fh-input>
        </fh-form-item>
        <fh-form-item label="TOS/DSCP Priority(RTP)" prop="basic_common.RTPDSCPMark">
          <fh-input v-model="form.basic_common.RTPDSCPMark"> </fh-input>
        </fh-form-item>
        <fh-form-item label="Support Prack">
          <fh-switch v-model="form.basic_common.PRACKEnable"></fh-switch>
        </fh-form-item>
        <!-- basic_common end -->
        <!-- VoIPMedia_Common start -->
        <div class="page__sub-header">
          <h2 class="page__title">VoIP Media Common Setting</h2>
        </div>
        <fh-form-item label="Support T38">
          <fh-switch v-model="form.VoIPMedia_Common.FaxCodec"></fh-switch>
        </fh-form-item>
        <fh-form-item label="G.723 Speed">
          <fh-select
            v-model="form.VoIPMedia_Common.SC_ACCT_MEDIA_G723_RATE"
            :options="g723SpeedOpts"
          ></fh-select>
        </fh-form-item>
        <fh-form-item label="Low speed fax echo cancel enable">
          <fh-select
            v-model="form.VoIPMedia_Common.EchoCancellationLowSpeedFax"
            :options="lowSpeedFaxEchoCancelOpts"
          ></fh-select>
        </fh-form-item>
        <fh-form-item label="Rev Polarity Type">
          <fh-select
            v-model="form.polarityReversalMode"
            :options="polarityReversalModeOpts"
          ></fh-select>
        </fh-form-item>
        <fh-form-item label="Rev Cancel Type">
          <fh-switch v-model="form.VoIPMedia_Common.EchoCancellationEnable"></fh-switch>
        </fh-form-item>
        <!-- VoIPMedia_Common end -->
        <!-- Digimap Setup start -->
        <div class="page__sub-header">
          <h2 class="page__title">{{ $t('trans0898') }}</h2>
        </div>
        <fh-form-item label="Start Digit Timer(s)" prop="digit_map.StartDigitTimer">
          <fh-input v-model="form.digit_map.StartDigitTimer"> </fh-input>
        </fh-form-item>
        <fh-form-item label="Inter Digit Timer Short(s)" prop="digit_map.InterDigitTimerShort">
          <fh-input v-model="form.digit_map.InterDigitTimerShort"> </fh-input>
        </fh-form-item>
        <fh-form-item label="Inter Digit Timer Long(s)" prop="digit_map.InterDigitTimerLong">
          <fh-input v-model="form.digit_map.InterDigitTimerLong"> </fh-input>
        </fh-form-item>
        <fh-form-item label="Inter Digit Timer T(s)" prop="digit_map.InterDigitTimerT">
          <fh-input v-model="form.digit_map.InterDigitTimerT"> </fh-input>
        </fh-form-item>
        <fh-form-item label="Busy Tone Timer(s)" prop="digit_map.BusyToneTimer">
          <fh-input v-model="form.digit_map.BusyToneTimer"> </fh-input>
        </fh-form-item>
        <fh-form-item label="Hanging Reminder Tone Timer(s)" prop="digit_map.HangingReminderToneTimer">
          <fh-input v-model="form.digit_map.HangingReminderToneTimer"> </fh-input>
        </fh-form-item>
        <fh-form-item label="No Answer Timer(s)" prop="digit_map.NoAnswerTimer">
          <fh-input v-model="form.digit_map.NoAnswerTimer"> </fh-input>
        </fh-form-item>
        <fh-form-item label="DM TMode">
          <fh-select v-model="form.digit_map.TMode" :options="dmTModeOpts"></fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0899')">
          <fh-switch v-model="form.digit_map.enableDigitMap"></fh-switch>
        </fh-form-item>
        <fh-form-item
          :label="$t('trans0902')"
          prop="digit_map.digitMap"
          v-if="form.digit_map.enableDigitMap"
        >
          <fh-input v-model="form.digit_map.digitMap"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0900')">
          <fh-switch v-model="form.digit_map.enableDigitMapSpecial"></fh-switch>
        </fh-form-item>
        <fh-form-item
          :label="$t('trans0903')"
          prop="digit_map.digitMapSpecial"
          v-if="form.digit_map.enableDigitMapSpecial"
        >
          <fh-input v-model="form.digit_map.digitMapSpecial"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0901')">
          <fh-switch v-model="form.digit_map.enablePBXPrefix"></fh-switch>
        </fh-form-item>
        <fh-form-item
          :label="$t('trans0904')"
          prop="digit_map.pbxPrefix"
          v-if="form.digit_map.enablePBXPrefix"
        >
          <fh-input v-model="form.digit_map.pbxPrefix"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0905')">
          <fh-switch v-model="form.digit_map.enablePBXDialSecondary"></fh-switch>
        </fh-form-item>
        <!-- Digimap Setup end -->
        <!-- VoIPMedia_line1 start -->
        <template v-if="form.VoIPMedia_line1.active">
          <div class="page__sub-header">
            <h2 class="page__title">Line1 of VoIP Media</h2>
          </div>
          <fh-form-item label="Enable Comfortnoise">
            <fh-switch v-model="form.VoIPMedia_line1.VAD"></fh-switch>
          </fh-form-item>
          <fh-form-item label="Enable Silence Compression">
            <fh-switch v-model="form.VoIPMedia_line1.SilenceCompressionEnable"></fh-switch>
          </fh-form-item>
        </template>
        <!-- VoIPMedia_line1 end -->
        <!-- VoIPMedia_line2 start -->
        <template v-if="form.VoIPMedia_line2.active">
          <div class="page__sub-header">
            <h2 class="page__title">Line2 of VoIP Media</h2>
          </div>
          <fh-form-item label="Enable Comfortnoise">
            <fh-switch v-model="form.VoIPMedia_line2.VAD"></fh-switch>
          </fh-form-item>
          <fh-form-item label="Enable Silence Compression">
            <fh-switch v-model="form.VoIPMedia_line2.SilenceCompressionEnable"></fh-switch>
          </fh-form-item>
        </template>
        <!-- VoIPMedia_line2 end -->
        <!-- call_ctrl_line1 start -->
        <template v-if="form.call_ctrl_line1.active">
          <div class="page__sub-header">
            <h2 class="page__title">Line1 of Call Control</h2>
          </div>
          <fh-form-item label="Ptime Setup">
            <fh-select
              v-model="form.call_ctrl_line1.SIPPacketizationTime"
              :options="ptimeSetupOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="Send Volume(0.1db)" prop="call_ctrl_line1.VoiceVolumeSpeak">
            <fh-input v-model="form.call_ctrl_line1.VoiceVolumeSpeak"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Sreceive Volume(0.1db)" prop="call_ctrl_line1.VoiceVolumeListen">
            <fh-input v-model="form.call_ctrl_line1.VoiceVolumeListen"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Warm Line">
            <fh-switch v-model="form.call_ctrl_line1.HotLineEnable"></fh-switch>
          </fh-form-item>
          <fh-form-item label="Warm Line Number" prop="call_ctrl_line1.HotLineNumber">
            <fh-input v-model="form.call_ctrl_line1.HotLineNumber"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Warm Line Timeout(sec)" prop="call_ctrl_line1.HotLineDelayTime">
            <fh-input v-model="form.call_ctrl_line1.HotLineDelayTime"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Call Waiting">
            <fh-switch v-model="form.call_ctrl_line1.SIPCallWaitingEnable"> </fh-switch>
          </fh-form-item>
          <fh-form-item label="Call Transfer">
            <fh-switch v-model="form.call_ctrl_line1.SIPCallTransfer"> </fh-switch>
          </fh-form-item>
          <fh-form-item label="Three Party Service">
            <fh-switch v-model="form.call_ctrl_line1.SIP3wayConf"></fh-switch>
          </fh-form-item>
          <fh-form-item label="Enable Server Mix">
            <fh-switch v-model="form.call_ctrl_line1.SIP3wayConfServerMix"></fh-switch>
          </fh-form-item>
          <fh-form-item
            label="Three Party Meeting Resource Access Code"
            prop="call_ctrl_line1.SIP3wayConfServAddr"
          >
            <fh-input v-model="form.call_ctrl_line1.SIP3wayConfServAddr"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Caller Id Mode">
            <fh-select
              v-model="form.call_ctrl_line1.ComingCallDisplayMode"
              :options="comingCallDisplayModeOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="Subscribe Type">
            <fh-select
              v-model="form.call_ctrl_line1.SubscribeType"
              :options="subscribeTypeOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="Subscribe Expire(s)" prop="call_ctrl_line1.SubscribeExpire">
            <fh-input v-model="form.call_ctrl_line1.SubscribeExpire"> </fh-input>
          </fh-form-item>
          <fh-form-item
            label="Min Flash Hook Time Interval(ms)"
            prop="call_ctrl_line1.HookMinInterval"
          >
            <fh-input v-model="form.call_ctrl_line1.HookMinInterval"> </fh-input>
          </fh-form-item>
          <fh-form-item
            label="Max Flash Hook Time Interval(ms)"
            prop="call_ctrl_line1.HookMaxInterval"
          >
            <fh-input v-model="form.call_ctrl_line1.HookMaxInterval"> </fh-input>
          </fh-form-item>
          <fh-form-item
            label="Min Flash Hook Time Release(ms)"
            prop="call_ctrl_line1.HookReleaseMin"
          >
            <fh-input v-model="form.call_ctrl_line1.HookReleaseMin"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Synchronize Phone Date Time">
            <fh-switch v-model="form.call_ctrl_line1.SyncCallerTimeEnable"></fh-switch>
          </fh-form-item>
          <fh-form-item label="G.722 Priority">
            <fh-select
              v-model="form.call_ctrl_line1.G722.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="G.711a Priority">
            <fh-select
              v-model="form.call_ctrl_line1.G711a.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="G.711u Priority">
            <fh-select
              v-model="form.call_ctrl_line1.G711u.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="G.729 Priority">
            <fh-select
              v-model="form.call_ctrl_line1.G729.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="G.723 Priority">
            <fh-select
              v-model="form.call_ctrl_line1.G723.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
        </template>
        <!-- call_ctrl_line1 end -->
        <!-- call_ctrl_line2 start -->
        <template v-if="form.call_ctrl_line2.active">
          <div class="page__sub-header">
            <h2 class="page__title">Line2 of Call Control</h2>
          </div>
          <fh-form-item label="Ptime Setup">
            <fh-select
              v-model="form.call_ctrl_line2.SIPPacketizationTime"
              :options="ptimeSetupOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="Send Volume(0.1db)" prop="call_ctrl_line2.VoiceVolumeSpeak">
            <fh-input v-model="form.call_ctrl_line2.VoiceVolumeSpeak"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Sreceive Volume(0.1db)" prop="call_ctrl_line2.VoiceVolumeListen">
            <fh-input v-model="form.call_ctrl_line2.VoiceVolumeListen"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Warm Line">
            <fh-switch v-model="form.call_ctrl_line2.HotLineEnable"></fh-switch>
          </fh-form-item>
          <fh-form-item label="Warm Line Number" prop="call_ctrl_line2.HotLineNumber">
            <fh-input v-model="form.call_ctrl_line2.HotLineNumber"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Warm Line Timeout(sec)" prop="call_ctrl_line2.HotLineDelayTime">
            <fh-input v-model="form.call_ctrl_line2.HotLineDelayTime"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Call waiting">
            <fh-switch v-model="form.call_ctrl_line2.SIPCallWaitingEnable"> </fh-switch>
          </fh-form-item>
          <fh-form-item label="Call transfer">
            <fh-switch v-model="form.call_ctrl_line2.SIPCallTransfer"> </fh-switch>
          </fh-form-item>
          <fh-form-item label="Three party service">
            <fh-switch v-model="form.call_ctrl_line2.SIP3wayConf"></fh-switch>
          </fh-form-item>
          <fh-form-item label="Enable Server Mix">
            <fh-switch v-model="form.call_ctrl_line2.SIP3wayConfServerMix"></fh-switch>
          </fh-form-item>
          <fh-form-item
            label="Three Party Meeting Resource Access Code"
            prop="call_ctrl_line2.SIP3wayConfServAddr"
          >
            <fh-input v-model="form.call_ctrl_line2.SIP3wayConfServAddr"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Caller Id Mode">
            <fh-select
              v-model="form.call_ctrl_line2.ComingCallDisplayMode"
              :options="comingCallDisplayModeOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="Subscribe Type">
            <fh-select
              v-model="form.call_ctrl_line2.SubscribeType"
              :options="subscribeTypeOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="Subscribe Expire(s)" prop="call_ctrl_line2.SubscribeExpire">
            <fh-input v-model="form.call_ctrl_line2.SubscribeExpire"> </fh-input>
          </fh-form-item>
          <fh-form-item
            label="Min Flash Hook Time Interval(ms)"
            prop="call_ctrl_line2.HookMinInterval"
          >
            <fh-input v-model="form.call_ctrl_line2.HookMinInterval"> </fh-input>
          </fh-form-item>
          <fh-form-item
            label="Max Flash Hook Time Interval(ms)"
            prop="call_ctrl_line2.HookMaxInterval"
          >
            <fh-input v-model="form.call_ctrl_line2.HookMaxInterval"> </fh-input>
          </fh-form-item>
          <fh-form-item
            label="Min Flash Hook Time Release(ms)"
            prop="call_ctrl_line2.HookReleaseMin"
          >
            <fh-input v-model="form.call_ctrl_line2.HookReleaseMin"> </fh-input>
          </fh-form-item>
          <fh-form-item label="Synchronize Phone Date Time">
            <fh-switch v-model="form.call_ctrl_line2.SyncCallerTimeEnable"></fh-switch>
          </fh-form-item>
          <fh-form-item label="G.722 Priority">
            <fh-select
              v-model="form.call_ctrl_line2.G722.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="G.711a Priority">
            <fh-select
              v-model="form.call_ctrl_line2.G711a.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="G.711u Priority">
            <fh-select
              v-model="form.call_ctrl_line2.G711u.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="G.729 Priority">
            <fh-select
              v-model="form.call_ctrl_line2.G729.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
          <fh-form-item label="G.723 Priority">
            <fh-select
              v-model="form.call_ctrl_line2.G723.priority"
              :options="priorityOpts"
            ></fh-select>
          </fh-form-item>
        </template>
        <!-- call_ctrl_line2 end -->
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
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { isValidInteger } from '@/util/tool'
import { ServiceType } from '@/util/constant'
import { getWan, getVoipAdvancedSettings, setVoipBasicSettings } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

defineOptions({
  name: 'VoipAdvancedPage',
})

enum DmTMode {
  dmShortTimer = '0',
  dmLongTimer = '1',
  dmTTimer = '2',
}
enum DtmfRelay {
  sipInfo = 'SIPInfo',
  rfc2833 = 'RFC2833',
  inBand = 'InBand',
}
enum FaxctrlMode {
  passThru = 'other',
  t30fullcontrol = 'all',
}
enum Faxpassthru {
  pcmu = 'PCMA',
  pcma = 'PCMU',
}
enum CallerIdMode {
  fsk = '1',
  dtmf = '0',
}
enum OptionsSericeMode {
  register = '0',
  proxy = '1',
  outband = '2',
}

const generateNumberOpts = (max: number, start: number, step: number) => {
  const arr = []
  for (let i = start; i <= max; i += step) {
    arr.push({ value: `${i}`, text: `${i}` })
  }
  return arr
}

const { t } = useI18n()
const { convertBooleanStatus } = useDataClean()
const formRef = ref(null)
const hasVoipWan = ref(false)
const dmTModeOpts = [
  {
    value: DmTMode.dmShortTimer,
    text: 'Inter Digit Timer Short',
  },
  {
    value: DmTMode.dmLongTimer,
    text: 'Inter Digit Timer Long',
  },
  {
    value: DmTMode.dmTTimer,
    text: 'Inter Digit Timer T',
  },
]
const dtmfRelayOpts = [
  {
    value: DtmfRelay.sipInfo,
    text: 'SIPInfo',
  },
  {
    value: DtmfRelay.rfc2833,
    text: 'RFC2833',
  },
  {
    value: DtmfRelay.inBand,
    text: 'InBand',
  },
]
const optionsSericeModeOpts = [
  {
    value: OptionsSericeMode.register,
    text: 'Register Server Mode',
  },
  {
    value: OptionsSericeMode.proxy,
    text: 'Proxy Server Mode',
  },
  {
    value: OptionsSericeMode.outband,
    text: 'Outbound Mode',
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
const msgWithUserOpts = [
  {
    value: '0',
    text: 'Exclude user=phone',
  },
  {
    value: '1',
    text: 'Include user=phone',
  },
]
const voiceCodecPriorityCtrlOpts = [
  {
    value: '0',
    text: 'Calling Prefenence',
  },
  {
    value: '1',
    text: 'Local Preference',
  },
]
const numberMatchModeOpts = [
  {
    value: '0',
    text: 'Min Match',
  },
  {
    value: '1',
    text: 'Blur Max Match',
  },
  {
    value: '2',
    text: 'Max Match',
  },
]
const actLocalSupplementServiceOpts = [
  {
    value: '0',
    text: 'None',
  },
  {
    value: '1',
    text: 'Local',
  },
  {
    value: '2',
    text: 'INFO',
  },
  {
    value: '3',
    text: 'CTC_IMS',
  },
]
const endCharHandleModeOpts = [
  {
    value: '0',
    text: 'End Mode',
  },
  {
    value: '1',
    text: 'Rule Mode',
  },
]
const polarityReversalModeOpts = [
  {
    value: '0',
    text: 'Close',
  },
  {
    value: '1',
    text: 'Open',
  },
  {
    value: '2',
    text: 'Remote Control',
  },
]
const sessionRefresherRuleOpts = [
  {
    value: '0',
    text: 'none',
  },
  {
    value: '1',
    text: 'uac',
  },
  {
    value: '2',
    text: 'uas',
  },
]
const sessionUpdateMethodOpts = [
  {
    value: '0',
    text: 'UPDATE',
  },
  {
    value: '1',
    text: 'INVITE',
  },
]
const g723SpeedOpts = [
  {
    value: '0',
    text: '5.3',
  },
  {
    value: '1',
    text: '6.3',
  },
]
const lowSpeedFaxEchoCancelOpts = [
  {
    value: '0',
    text: 'Close',
  },
  {
    value: '1',
    text: 'Open',
  },
  {
    value: '2',
    text: 'Auto',
  },
]
const subscribeTypeOpts = [
  {
    value: '0',
    text: 'No Subscription',
  },
  {
    value: '1',
    text: 'Subscription Service',
  },
  {
    value: '2',
    text: 'Subscription Registration',
  },
  {
    value: '3',
    text: 'Subscription All',
  },
]
const comingCallDisplayModeOpts = [
  {
    value: CallerIdMode.fsk,
    text: 'FSK',
  },
  {
    value: CallerIdMode.dtmf,
    text: 'DTMF',
  },
]
const numMin = 1
const ptimeSetupMin = 10
const ptimeSetupOpts = generateNumberOpts(30, ptimeSetupMin, 10)
const priorityOpts = generateNumberOpts(5, numMin, 1)
// 每行注释解释，第一个向底层传递的参数，第二个是openwrt上显示的内容
const form = reactive({
  registrationExpireTimer: '', // registrationExpireTimer, RegistrationExpireTimer(s)
  maxStartDelay: '', // maxStartDelay MaxStartDelayTimer(s)
  registerRetryInterval: '', // registerRetryInterval RegisterRetryIntervalTimer(s)
  dtmfRelay: DtmfRelay.sipInfo, //  DTMFTransportMode, Dtmf Relay
  optionsSericeMode: OptionsSericeMode.register, // OptionsSericeMode, HeartbeatOPTIONSmode, 值：register=0;proxy=1;outband=2
  faxCtrlMode: FaxctrlMode.passThru, // FaxCtrlMode, Faxctrlmode, 值：Passthru:other;T30:all
  faxpassthru: Faxpassthru.pcmu, // FaxPassThruCodec Faxpassthru 值：PCMA:PCMU
  rtpRedundantEnable: true, // rtpRedundantEnable, RTP Redundancy 值：0:1
  rtpRedundantPT: '', // rtpRedundantPT, RTP paylod type, 值: 96~127
  msgWithUserEnable: '0', // MsgWithUserEnable, Message contains user=phone or not, 值: 1=include;0=exclude
  voiceCodecPriorityCtrl: '0', // VoiceCodecPriorityCtrl, VoiceCodecPriorityCtrl, 值: local=1;calling=0
  numberMatchMode: '0', // NumberMatchMode, NumberMatchMode, 值: min=0;blur=1;max=2
  actLocalSupplementService: '0', // ActLocalSupplementService, DivSupplementServiceType, 值: none=0:local=1:info=2:CTC_IMS=3
  endCharHandleMode: '0', // EndCharHandleMode, EndCharacterHandleMode, 值: 0=endmode:1=rulemode
  supportTransferHash: true, // SupportSpecCharTransfer, Support#transfer%23 即 #, 值: 0:1
  supportTransferAt: true, // SupReferSpecCharTrans, Support@transfer%40, 即 @, 值: 0:1
  enableAdaptiveJitterBuffer: true, // SC_SYS_VOICE_JB_TYPE, adaptive jitter buffer enable, 值: 1:enable;0:disable
  jitterBufferMax: '', // SC_SYS_VOICE_JB_LEN, jitter buffer max
  polarityReversalMode: '0', // PolarityReversalMode, Rev Polarity Type, 值: close= 0:open=1;reomte_contro=2
  callSynEnAutoSwitch: true, // CallSynEnAutoSwitch, autoSynPhoneDateSwitch, 值: 0:1
  syncSysTimeEnable: true, // SyncSysTimeEnable, if sync System Date, 值: 0:1
  digit_map: {
    InterDigitTimerShort: '', // InterDigitTimerShort, InterDigitTimerShort(s)
    StartDigitTimer: '', // StartDigitTimer, StartDigitTimer(s)
    InterDigitTimerLong: '', // InterDigitTimerLong, InterDigitTimerLong(s)
    InterDigitTimerT: '', // InterDigitTimerT, InterDigitTimerT(s)
    BusyToneTimer: '', // BusyToneTimer, BusyToneTimer(s)
    HangingReminderToneTimer: '', // HangingReminderToneTimer, HangingReminderToneTimer(s)
    NoAnswerTimer: '', // NoAnswerTimer, NoAnswerTimer(s)
    TMode: DmTMode.dmShortTimer, // TMode, DM TMode, 值: short:0/long:1/T:2
    enableDigitMap: true, // DigitMapEnable, DigitMapEnable, 值: 0:1
    digitMap: '', // DigitMap1
    enableDigitMapSpecial: true, // DigitMapSpecialEnable, DigitMapSpecialEnable, 值: 0:1
    digitMapSpecial: '', // DigitMapSpecial, DigitMapSpecial
    enablePBXPrefix: true, // PBXPrefixEnable, PBXPrefixEnable, 值: 0:1
    pbxPrefix: '', // PBXPrefix, PBXPrefix
    enablePBXDialSecondary: true, // PBXDialSecondaryEnable, PBXDialSecondaryEnable, 值: 0:1
  },
  basic_common: {
    TelephoneEventPayloadType: '', // TelephoneEventPayloadType, Telephone Event Payload Type
    HeartbeatSwitch: true, // HeartbeatSwitch, natKeepAliveMessage, 值: 1:0
    HeartbeatCycle: '', // HeartbeatCycle, natKeepAliveTime(s)
    VoIP8021PMarkEnable: true, // VoIP8021PMarkEnable, Enable 802.1p, 值: 0:1
    SIP8021PMark: '', // SIP8021PMark, 802.1p(SIP)[0-7]
    RTP8021PMark: '', // RTP8021PMark, 802.1p(RTP)[0-7]
    SC_ACCT_SIP_SESSION_FLAG: true, // SC_ACCT_SIP_SESSION_FLAG, sessiontimerEnable, 值: 0:1
    SC_ACCT_SIP_SESSION_TIMER: '', // SC_ACCT_SIP_SESSION_TIMER, sessionTimer(s)
    SC_ACCT_SIP_SESSION_MIN_EXP: '', // SC_ACCT_SIP_SESSION_MIN_EXP, MinsessionTimer(s)
    SC_ACCT_SIP_SESSION_REFRESHER: '0', // SC_ACCT_SIP_SESSION_REFRESHER, sessionRefresherrule, 值: 0:1:2
    SC_ACCT_SIP_SESSION_METHOD: '0', // SC_ACCT_SIP_SESSION_METHOD, sessionUpdateMethod, 值: 0:1
    ifSendUnregisterMsg: true, // LogOffMsgSendEnable, if send Unregister message, 值: 1:0
    SIPDSCPMark: '', // SIPDSCPMark, TOS/DSCP Priority(SIP)
    RTPDSCPMark: '', // RTPDSCPMark, TOS/DSCP Priority(RTP)
    PRACKEnable: true, // PRACKEnable, SupportPrack, 值: 0:1
  },
  VoIPMedia_Common: {
    FaxCodec: true, // FaxCodec, SupportT38, 值: 0:1
    SC_ACCT_MEDIA_G723_RATE: '0', // SC_ACCT_MEDIA_G723_RATE, G.723 Speed, 值: 6.3=1;5.3=0
    EchoCancellationLowSpeedFax: '0', // EchoCancellationLowSpeedFax, Low speed fax echo cancel, 值: enable:open='1';close='0';auto=''
    EchoCancellationEnable: true, // EchoCancellationEnable, Rev cancel Type, 值: 0:1
  },
  VoIPMedia_line1: {
    active: true, // 不传值, 不显示, 值: 1 UI显示，0 UI 隐藏
    VAD: true, // VAD, line 1 comfortnoiseEnable, 值: 0:1
    SilenceCompressionEnable: true, // SilenceCompressionEnable, line 1 SilenceCompressionEnable, 值: 0:1
  },
  VoIPMedia_line2: {
    active: true, // 不传值, 不显示, 值: 1 UI显示，0 UI 隐藏
    VAD: true, // VAD, line 2 comfortnoiseEnable, 值: 0:1
    SilenceCompressionEnable: true, // SilenceCompressionEnable, line 2 SilenceCompressionEnable, 值: 0:1
  },
  call_ctrl_line1: {
    active: true, // 不传值, 不显示, 值: 1 UI显示，0 UI 隐藏
    SyncCallerTimeEnable: true, // SyncCallerTimeEnable, Synchronize phone date time, 值: 0:1
    HookReleaseMin: '', // HookReleaseMin, Min flash hook time release(ms)
    HookMaxInterval: '', // HookMaxInterval, Max flash hook time release(ms)
    HookMinInterval: '', // HookMinInterval, Min flash hook time interval(ms)
    SubscribeExpire: '', // SubscribeExpire, Subscribe Expire(s)
    SubscribeType: '0', // SubscribeType, Subscribe Type, 值: 0=no;1=service;2=registration;3=all
    ComingCallDisplayMode: CallerIdMode.fsk, // ComingCallDisplayMode, Caller id mode, 值: 0=dtmf;1=FSK
    SIP3wayConfServAddr: '', // SIP3wayConfServAddr, Three Party Meeting Resource Access Code
    SIP3wayConfServerMix: true, // SIP3wayConfServerMix, Enable Server Mix, 值: 0=disable;1=enable
    SIP3wayConf: true, // SIP3wayConf, Three party service, 值: 1/0
    SIPCallTransfer: true, // SIPCallTransfer, Call transfer, 值: 1/0
    SIPCallWaitingEnable: true, // SIPCallWaitingEnable, Call waiting, 值: 0:1
    HotLineDelayTime: '', // HotLineDelayTime, Warm Line Timeout(sec)
    HotLineNumber: '', // HotLineNumber, Warm Line Number
    HotLineEnable: true, // HotLineEnable, Warm Line, 值: 0:1
    VoiceVolumeListen: '', // VoiceVolumeListen, sreceive volume(0.1db)
    VoiceVolumeSpeak: '', // VoiceVolumeSpeak, send volume(0.1db)
    SIPPacketizationTime: `${ptimeSetupMin}`, // SIPPacketizationTime, ptime setup, 值: 10:20:30
    G722: {
      priority: `${numMin}`, // priority, G.722 Priority, 值: 0~5
    },
    G711a: {
      priority: `${numMin}`, // priority, G.711a Priority, 值: 0~5
    },
    G711u: {
      priority: `${numMin}`, // priority, G.711u Priority, 值: 0~5
    },
    G729: {
      priority: `${numMin}`, // priority, G.729 Priority, 值: 0~5
    },
    G723: {
      priority: `${numMin}`, // priority, G.723 Priority, 值: 0~5
    },
  },
  call_ctrl_line2: {
    active: true, // 不传值, 不显示, 值: 1 UI显示，0 UI 隐藏
    SyncCallerTimeEnable: true, // SyncCallerTimeEnable, Synchronize phone date time, 值: 0:1
    HookReleaseMin: '', // HookReleaseMin, Min flash hook time release(ms)
    HookMaxInterval: '', // HookMaxInterval, Max flash hook time release(ms)
    HookMinInterval: '', // HookMinInterval, Min flash hook time interval(ms)
    SubscribeExpire: '', // SubscribeExpire, Subscribe Expire(s)
    SubscribeType: '0', // SubscribeType, Subscribe Type, 值: 0=no;1=service;2=registration;3=all
    ComingCallDisplayMode: '1', // ComingCallDisplayMode, Caller id mode, 值: 0=dtmf;1=FSK
    SIP3wayConfServAddr: '', // SIP3wayConfServAddr, Three Party Meeting Resource Access Code
    SIP3wayConfServerMix: true, // SIP3wayConfServerMix, Enable Server Mix, 值: 0=disable;1=enable
    SIP3wayConf: true, // SIP3wayConf, Three party service, 值: 1/0
    SIPCallTransfer: true, // SIPCallTransfer, Call transfer, 值: 1/0
    SIPCallWaitingEnable: true, // SIPCallWaitingEnable, Call waiting, 值: 0:1
    HotLineDelayTime: '', // HotLineDelayTime, Warm Line Timeout(sec)
    HotLineNumber: '', // HotLineNumber, Warm Line Number
    HotLineEnable: true, // HotLineEnable, Warm Line, 值: 0:1
    VoiceVolumeListen: '', // VoiceVolumeListen, sreceive volume(0.1db)
    VoiceVolumeSpeak: '', // VoiceVolumeSpeak, send volume(0.1db)
    SIPPacketizationTime: `${ptimeSetupMin}`, // SIPPacketizationTime, ptime setup, 值: 10:20:30
    G722: {
      priority: `${numMin}`, // priority, G.722 Priority, 值: 0~5
    },
    G711a: {
      priority: `${numMin}`, // priority, G.711a Priority, 值: 0~5
    },
    G711u: {
      priority: `${numMin}`, // priority, G.711u Priority, 值: 0~5
    },
    G729: {
      priority: `${numMin}`, // priority, G.729 Priority, 值: 0~5
    },
    G723: {
      priority: `${numMin}`, // priority, G.723 Priority, 值: 0~5
    },
  },
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
  rtpRedundantPT: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 96, 127),
      message: t('trans0567').format(96, 127),
    },
  ],
  jitterBufferMax: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.StartDigitTimer': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.InterDigitTimerShort': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.InterDigitTimerLong': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.InterDigitTimerT': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.BusyToneTimer': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.HangingReminderToneTimer': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.NoAnswerTimer': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.digitMap': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.digitMapSpecial': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'digit_map.pbxPrefix': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'basic_common.TelephoneEventPayloadType': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'basic_common.HeartbeatCycle': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'basic_common.SIP8021PMark': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'basic_common.RTP8021PMark': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'basic_common.SC_ACCT_SIP_SESSION_TIMER': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'basic_common.SC_ACCT_SIP_SESSION_MIN_EXP': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'basic_common.SIPDSCPMark': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'basic_common.RTPDSCPMark': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line1.HookReleaseMin': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line1.HookMaxInterval': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line1.HookMinInterval': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line1.SubscribeExpire': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line1.SIP3wayConfServAddr': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line1.HotLineDelayTime': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line1.HotLineNumber': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line1.VoiceVolumeListen': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line1.VoiceVolumeSpeak': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line2.HookReleaseMin': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line2.HookMaxInterval': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line2.HookMinInterval': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line2.SubscribeExpire': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line2.SIP3wayConfServAddr': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line2.HotLineDelayTime': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line2.HotLineNumber': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line2.VoiceVolumeListen': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
  'call_ctrl_line2.VoiceVolumeSpeak': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
  ],
})
const save = () => {
  if (!formRef.value.validate()) return
  const data = {
    registrationExpireTimer: form.registrationExpireTimer,
    maxStartDelay: form.maxStartDelay,
    registerRetryInterval: form.registerRetryInterval,
    DTMFTransportMode: form.dtmfRelay,
    OptionsSericeMode: form.optionsSericeMode,
    FaxCtrlMode: form.faxCtrlMode,
    FaxPassThruCodec: form.faxpassthru,
    rtpRedundantEnable: convertBooleanStatus(form.rtpRedundantEnable),
    rtpRedundantPT: form.rtpRedundantPT,
    MsgWithUserEnable: form.msgWithUserEnable,
    VoiceCodecPriorityCtrl: form.voiceCodecPriorityCtrl,
    NumberMatchMode: form.numberMatchMode,
    ActLocalSupplementService: form.actLocalSupplementService,
    EndCharHandleMode: form.endCharHandleMode,
    SupportSpecCharTransfer: convertBooleanStatus(form.supportTransferHash),
    SupReferSpecCharTrans: convertBooleanStatus(form.supportTransferAt),
    SC_SYS_VOICE_JB_TYPE: convertBooleanStatus(form.enableAdaptiveJitterBuffer),
    SC_SYS_VOICE_JB_LEN: form.jitterBufferMax,
    PolarityReversalMode: form.polarityReversalMode,
    CallSynEnAutoSwitch: convertBooleanStatus(form.callSynEnAutoSwitch),
    SyncSysTimeEnable: convertBooleanStatus(form.syncSysTimeEnable),
    digit_map: {
      InterDigitTimerShort: form.digit_map.InterDigitTimerShort,
      StartDigitTimer: form.digit_map.StartDigitTimer,
      InterDigitTimerLong: form.digit_map.InterDigitTimerLong,
      InterDigitTimerT: form.digit_map.InterDigitTimerT,
      BusyToneTimer: form.digit_map.BusyToneTimer,
      HangingReminderToneTimer: form.digit_map.HangingReminderToneTimer,
      NoAnswerTimer: form.digit_map.NoAnswerTimer,
      TMode: form.digit_map.TMode,
      DigitMapEnable: convertBooleanStatus(form.digit_map.enableDigitMap),
      DigitMap1: form.digit_map.digitMap,
      DigitMapSpecialEnable: convertBooleanStatus(form.digit_map.enableDigitMapSpecial),
      digitMapSpecial: form.digit_map.digitMapSpecial,
      PBXPrefixEnable: convertBooleanStatus(form.digit_map.enablePBXPrefix),
      PBXPrefix: form.digit_map.pbxPrefix,
      PBXDialSecondaryEnable: convertBooleanStatus(form.digit_map.enablePBXDialSecondary),
    },
    basic_commom: {
      TelephoneEventPayloadType: form.basic_common.TelephoneEventPayloadType,
      HeartbeatSwitch: convertBooleanStatus(form.basic_common.HeartbeatSwitch),
      HeartbeatCycle: form.basic_common.HeartbeatCycle,
      VoIP8021PMarkEnable: convertBooleanStatus(form.basic_common.VoIP8021PMarkEnable),
      SIP8021PMark: form.basic_common.SIP8021PMark,
      RTP8021PMark: form.basic_common.RTP8021PMark,
      SC_ACCT_SIP_SESSION_FLAG: convertBooleanStatus(form.basic_common.SC_ACCT_SIP_SESSION_FLAG),
      SC_ACCT_SIP_SESSION_TIMER: form.basic_common.SC_ACCT_SIP_SESSION_TIMER,
      SC_ACCT_SIP_SESSION_MIN_EXP: form.basic_common.SC_ACCT_SIP_SESSION_MIN_EXP,
      SC_ACCT_SIP_SESSION_REFRESHER: form.basic_common.SC_ACCT_SIP_SESSION_REFRESHER,
      SC_ACCT_SIP_SESSION_METHOD: form.basic_common.SC_ACCT_SIP_SESSION_METHOD,
      LogOffMsgSendEnable: convertBooleanStatus(form.basic_common.ifSendUnregisterMsg),
      SIPDSCPMark: form.basic_common.SIPDSCPMark,
      RTPDSCPMark: form.basic_common.RTPDSCPMark,
      PRACKEnable: convertBooleanStatus(form.basic_common.PRACKEnable),
    },
    VoIPMedia_Common: {
      FaxCodec: convertBooleanStatus(form.VoIPMedia_Common.FaxCodec),
      SC_ACCT_MEDIA_G723_RATE: form.VoIPMedia_Common.SC_ACCT_MEDIA_G723_RATE,
      EchoCancellationLowSpeedFax: form.VoIPMedia_Common.EchoCancellationLowSpeedFax,
      EchoCancellationEnable: convertBooleanStatus(form.VoIPMedia_Common.EchoCancellationEnable),
    },
    VoIPMedia_line1: {
      VAD: convertBooleanStatus(form.VoIPMedia_line1.VAD),
      SilenceCompressionEnable: convertBooleanStatus(form.VoIPMedia_line1.SilenceCompressionEnable),
    },
    VoIPMedia_line2: {
      VAD: convertBooleanStatus(form.VoIPMedia_line2.VAD),
      SilenceCompressionEnable: convertBooleanStatus(form.VoIPMedia_line2.SilenceCompressionEnable),
    },
    call_ctrl_line1: {
      SyncCallerTimeEnable: convertBooleanStatus(form.call_ctrl_line1.SyncCallerTimeEnable),
      HookReleaseMin: form.call_ctrl_line1.HookReleaseMin,
      HookMaxInterval: form.call_ctrl_line1.HookMaxInterval,
      HookMinInterval: form.call_ctrl_line1.HookMinInterval,
      SubscribeExpire: form.call_ctrl_line1.SubscribeExpire,
      SubscribeType: form.call_ctrl_line1.SubscribeType,
      ComingCallDisplayMode: form.call_ctrl_line1.ComingCallDisplayMode,
      SIP3wayConfServAddr: form.call_ctrl_line1.SIP3wayConfServAddr,
      SIP3wayConfServerMix: convertBooleanStatus(form.call_ctrl_line1.SIP3wayConfServerMix),
      SIP3wayConf: convertBooleanStatus(form.call_ctrl_line1.SIP3wayConf),
      SIPCallTransfer: convertBooleanStatus(form.call_ctrl_line1.SIPCallTransfer),
      SIPCallWaitingEnable: convertBooleanStatus(form.call_ctrl_line1.SIPCallWaitingEnable),
      HotLineDelayTime: form.call_ctrl_line1.HotLineDelayTime,
      HotLineNumber: form.call_ctrl_line1.HotLineNumber,
      HotLineEnable: convertBooleanStatus(form.call_ctrl_line1.HotLineEnable),
      VoiceVolumeListen: form.call_ctrl_line1.VoiceVolumeListen,
      VoiceVolumeSpeak: form.call_ctrl_line1.VoiceVolumeSpeak,
      SIPPacketizationTime: form.call_ctrl_line1.SIPPacketizationTime,
      G722: {
        priority: form.call_ctrl_line1.G722.priority,
      },
      G711a: {
        priority: form.call_ctrl_line1.G711a.priority,
      },
      G711u: {
        priority: form.call_ctrl_line1.G711u.priority,
      },
      G729: {
        priority: form.call_ctrl_line1.G729.priority,
      },
      G723: {
        priority: form.call_ctrl_line1.G723.priority,
      },
    },
    call_ctrl_line2: {
      SyncCallerTimeEnable: convertBooleanStatus(form.call_ctrl_line2.SyncCallerTimeEnable),
      HookReleaseMin: form.call_ctrl_line2.HookReleaseMin,
      HookMaxInterval: form.call_ctrl_line2.HookMaxInterval,
      HookMinInterval: form.call_ctrl_line2.HookMinInterval,
      SubscribeExpire: form.call_ctrl_line2.SubscribeExpire,
      SubscribeType: form.call_ctrl_line2.SubscribeType,
      ComingCallDisplayMode: form.call_ctrl_line2.ComingCallDisplayMode,
      SIP3wayConfServAddr: form.call_ctrl_line2.SIP3wayConfServAddr,
      SIP3wayConfServerMix: convertBooleanStatus(form.call_ctrl_line2.SIP3wayConfServerMix),
      SIP3wayConf: convertBooleanStatus(form.call_ctrl_line2.SIP3wayConf),
      SIPCallTransfer: convertBooleanStatus(form.call_ctrl_line2.SIPCallTransfer),
      SIPCallWaitingEnable: convertBooleanStatus(form.call_ctrl_line2.SIPCallWaitingEnable),
      HotLineDelayTime: form.call_ctrl_line2.HotLineDelayTime,
      HotLineNumber: form.call_ctrl_line2.HotLineNumber,
      HotLineEnable: convertBooleanStatus(form.call_ctrl_line2.HotLineEnable),
      VoiceVolumeListen: form.call_ctrl_line2.VoiceVolumeListen,
      VoiceVolumeSpeak: form.call_ctrl_line2.VoiceVolumeSpeak,
      SIPPacketizationTime: form.call_ctrl_line2.SIPPacketizationTime,
      G722: {
        priority: form.call_ctrl_line2.G722.priority,
      },
      G711a: {
        priority: form.call_ctrl_line2.G711a.priority,
      },
      G711u: {
        priority: form.call_ctrl_line2.G711u.priority,
      },
      G729: {
        priority: form.call_ctrl_line2.G729.priority,
      },
      G723: {
        priority: form.call_ctrl_line2.G723.priority,
      },
    },
  }
  setVoipBasicSettings(data)
}
const getVoipAdvancedSettingsData = () => {
  getVoipAdvancedSettings().then(({ data }) => {
    form.registrationExpireTimer = data.registrationExpireTimer
    form.maxStartDelay = data.maxStartDelay
    form.registerRetryInterval = data.registerRetryInterval
    form.dtmfRelay = data.DTMFTransportMode
    form.optionsSericeMode = data.OptionsSericeMode
    form.faxCtrlMode = data.FaxCtrlMode
    form.faxpassthru = data.FaxPassThruCodec
    form.rtpRedundantEnable = convertBooleanStatus(data.rtpRedundantEnable) as boolean
    form.rtpRedundantPT = data.rtpRedundantPT
    form.msgWithUserEnable = data.MsgWithUserEnable
    form.voiceCodecPriorityCtrl = data.VoiceCodecPriorityCtrl
    form.numberMatchMode = data.NumberMatchMode
    form.actLocalSupplementService = data.ActLocalSupplementService
    form.endCharHandleMode = data.EndCharHandleMode
    form.supportTransferHash = convertBooleanStatus(data.SupportSpecCharTransfer) as boolean
    form.supportTransferAt = convertBooleanStatus(data.SupReferSpecCharTrans) as boolean
    form.enableAdaptiveJitterBuffer = convertBooleanStatus(data.SC_SYS_VOICE_JB_TYPE) as boolean
    form.jitterBufferMax = data.SC_SYS_VOICE_JB_LEN
    form.polarityReversalMode = data.PolarityReversalMode
    form.callSynEnAutoSwitch = convertBooleanStatus(data.CallSynEnAutoSwitch) as boolean
    form.syncSysTimeEnable = convertBooleanStatus(data.SyncSysTimeEnable) as boolean

    form.digit_map.InterDigitTimerShort = data.digit_map.InterDigitTimerShort
    form.digit_map.StartDigitTimer = data.digit_map.StartDigitTimer
    form.digit_map.InterDigitTimerLong = data.digit_map.InterDigitTimerLong
    form.digit_map.InterDigitTimerT = data.digit_map.InterDigitTimerT
    form.digit_map.BusyToneTimer = data.digit_map.BusyToneTimer
    form.digit_map.HangingReminderToneTimer = data.digit_map.HangingReminderToneTimer
    form.digit_map.NoAnswerTimer = data.digit_map.NoAnswerTimer
    form.digit_map.TMode = data.digit_map.TMode
    form.digit_map.enableDigitMap = convertBooleanStatus(data.digit_map.DigitMapEnable) as boolean
    form.digit_map.digitMap = data.digit_map.DigitMap1
    form.digit_map.enableDigitMapSpecial = convertBooleanStatus(
      data.digit_map.DigitMapSpecialEnable,
    ) as boolean
    form.digit_map.digitMapSpecial = data.digit_map.DigitMapSpecial
    form.digit_map.enablePBXPrefix = convertBooleanStatus(data.digit_map.PBXPrefixEnable) as boolean
    form.digit_map.pbxPrefix = data.digit_map.PBXPrefix
    form.digit_map.enablePBXDialSecondary = convertBooleanStatus(
      data.digit_map.PBXDialSecondaryEnable,
    ) as boolean

    form.basic_common.TelephoneEventPayloadType = data.basic_common.TelephoneEventPayloadType
    form.basic_common.HeartbeatSwitch = convertBooleanStatus(
      data.basic_common.HeartbeatSwitch,
    ) as boolean
    form.basic_common.HeartbeatCycle = data.basic_common.HeartbeatCycle
    form.basic_common.VoIP8021PMarkEnable = convertBooleanStatus(
      data.basic_common.VoIP8021PMarkEnable,
    ) as boolean
    form.basic_common.SIP8021PMark = data.basic_common.SIP8021PMark
    form.basic_common.RTP8021PMark = data.basic_common.RTP8021PMark
    form.basic_common.SC_ACCT_SIP_SESSION_FLAG = convertBooleanStatus(
      data.basic_common.SC_ACCT_SIP_SESSION_FLAG,
    ) as boolean
    form.basic_common.SC_ACCT_SIP_SESSION_TIMER = data.basic_common.SC_ACCT_SIP_SESSION_TIMER
    form.basic_common.SC_ACCT_SIP_SESSION_MIN_EXP = data.basic_common.SC_ACCT_SIP_SESSION_MIN_EXP
    form.basic_common.SC_ACCT_SIP_SESSION_REFRESHER =
      data.basic_common.SC_ACCT_SIP_SESSION_REFRESHER
    form.basic_common.SC_ACCT_SIP_SESSION_METHOD = data.basic_common.SC_ACCT_SIP_SESSION_METHOD
    form.basic_common.ifSendUnregisterMsg = convertBooleanStatus(
      data.basic_common.LogOffMsgSendEnable,
    ) as boolean
    form.basic_common.SIPDSCPMark = data.basic_common.SIPDSCPMark
    form.basic_common.RTPDSCPMark = data.basic_common.RTPDSCPMark
    form.basic_common.PRACKEnable = convertBooleanStatus(data.basic_common.SupportPrack) as boolean

    form.VoIPMedia_Common.FaxCodec = convertBooleanStatus(data.VoIPMedia_Common.FaxCodec) as boolean
    form.VoIPMedia_Common.SC_ACCT_MEDIA_G723_RATE = data.VoIPMedia_Common.SC_ACCT_MEDIA_G723_RATE
    form.VoIPMedia_Common.EchoCancellationLowSpeedFax =
      data.VoIPMedia_Common.EchoCancellationLowSpeedFax
    form.VoIPMedia_Common.EchoCancellationEnable = convertBooleanStatus(
      data.VoIPMedia_Common.EchoCancellationEnable,
    ) as boolean

    form.VoIPMedia_line1.active = convertBooleanStatus(data.VoIPMedia_line1.active) as boolean
    form.VoIPMedia_line1.VAD = convertBooleanStatus(data.VoIPMedia_line1.VAD) as boolean
    form.VoIPMedia_line1.SilenceCompressionEnable = convertBooleanStatus(
      data.VoIPMedia_line1.SilenceCompressionEnable,
    ) as boolean

    form.VoIPMedia_line2.active = convertBooleanStatus(data.VoIPMedia_line2.active) as boolean
    form.VoIPMedia_line2.VAD = convertBooleanStatus(data.VoIPMedia_line2.VAD) as boolean
    form.VoIPMedia_line2.SilenceCompressionEnable = convertBooleanStatus(
      data.VoIPMedia_line2.SilenceCompressionEnable,
    ) as boolean

    form.call_ctrl_line1.active = convertBooleanStatus(data.call_ctrl_line1.active) as boolean
    form.call_ctrl_line1.SyncCallerTimeEnable = convertBooleanStatus(
      data.call_ctrl_line1.SyncCallerTimeEnable,
    ) as boolean
    form.call_ctrl_line1.HookReleaseMin = data.call_ctrl_line1.HookReleaseMin
    form.call_ctrl_line1.HookMaxInterval = data.call_ctrl_line1.HookMaxInterval
    form.call_ctrl_line1.HookMinInterval = data.call_ctrl_line1.HookMinInterval
    form.call_ctrl_line1.SubscribeExpire = data.call_ctrl_line1.SubscribeExpire
    form.call_ctrl_line1.SubscribeType = data.call_ctrl_line1.SubscribeType
    form.call_ctrl_line1.ComingCallDisplayMode = data.call_ctrl_line1.ComingCallDisplayMode
    form.call_ctrl_line1.SIP3wayConfServAddr = data.call_ctrl_line1.SIP3wayConfServAddr
    form.call_ctrl_line1.SIP3wayConfServerMix = convertBooleanStatus(
      data.call_ctrl_line1.SIP3wayConfServerMix,
    ) as boolean
    form.call_ctrl_line1.SIP3wayConf = convertBooleanStatus(
      data.call_ctrl_line1.SIP3wayConf,
    ) as boolean
    form.call_ctrl_line1.SIPCallTransfer = convertBooleanStatus(
      data.call_ctrl_line1.SIPCallTransfer,
    ) as boolean
    form.call_ctrl_line1.SIPCallWaitingEnable = convertBooleanStatus(
      data.call_ctrl_line1.SIPCallWaitingEnable,
    ) as boolean
    form.call_ctrl_line1.HotLineDelayTime = data.call_ctrl_line1.HotLineDelayTime
    form.call_ctrl_line1.HotLineNumber = data.call_ctrl_line1.HotLineNumber
    form.call_ctrl_line1.HotLineEnable = convertBooleanStatus(
      data.call_ctrl_line1.HotLineEnable,
    ) as boolean
    form.call_ctrl_line1.VoiceVolumeListen = data.call_ctrl_line1.VoiceVolumeListen
    form.call_ctrl_line1.VoiceVolumeSpeak = data.call_ctrl_line1.VoiceVolumeSpeak
    form.call_ctrl_line1.SIPPacketizationTime = data.call_ctrl_line1.SIPPacketizationTime
    form.call_ctrl_line1.G722.priority = data.call_ctrl_line1.G722.priority
    form.call_ctrl_line1.G711a.priority = data.call_ctrl_line1.G711a.priority
    form.call_ctrl_line1.G711u.priority = data.call_ctrl_line1.G711u.priority
    form.call_ctrl_line1.G729.priority = data.call_ctrl_line1.G729.priority
    form.call_ctrl_line1.G723.priority = data.call_ctrl_line1.G723.priority

    form.call_ctrl_line2.active = convertBooleanStatus(data.call_ctrl_line2.active) as boolean
    form.call_ctrl_line2.SyncCallerTimeEnable = convertBooleanStatus(
      data.call_ctrl_line2.SynchronizePhoneDateTime,
    ) as boolean
    form.call_ctrl_line2.HookReleaseMin = data.call_ctrl_line2.HookReleaseMin
    form.call_ctrl_line2.HookMaxInterval = data.call_ctrl_line2.HookMaxInterval
    form.call_ctrl_line2.HookMinInterval = data.call_ctrl_line2.HookMinInterval
    form.call_ctrl_line2.SubscribeExpire = data.call_ctrl_line2.SubscribeExpire
    form.call_ctrl_line2.SubscribeType = data.call_ctrl_line2.SubscribeType
    form.call_ctrl_line2.ComingCallDisplayMode = data.call_ctrl_line2.ComingCallDisplayMode
    form.call_ctrl_line2.SIP3wayConfServAddr = data.call_ctrl_line2.SIP3wayConfServAddr
    form.call_ctrl_line2.SIP3wayConfServerMix = convertBooleanStatus(
      data.call_ctrl_line2.SIP3wayConfServerMix,
    ) as boolean
    form.call_ctrl_line2.SIP3wayConf = convertBooleanStatus(
      data.call_ctrl_line2.SIP3wayConf,
    ) as boolean
    form.call_ctrl_line2.SIPCallTransfer = convertBooleanStatus(
      data.call_ctrl_line2.SIPCallTransfer,
    ) as boolean
    form.call_ctrl_line2.SIPCallWaitingEnable = convertBooleanStatus(
      data.call_ctrl_line2.SIPCallWaitingEnable,
    ) as boolean
    form.call_ctrl_line2.HotLineDelayTime = data.call_ctrl_line2.HotLineDelayTime
    form.call_ctrl_line2.HotLineNumber = data.call_ctrl_line2.HotLineNumber
    form.call_ctrl_line2.HotLineEnable = convertBooleanStatus(
      data.call_ctrl_line2.HotLineEnable,
    ) as boolean
    form.call_ctrl_line2.VoiceVolumeListen = data.call_ctrl_line2.VoiceVolumeListen
    form.call_ctrl_line2.VoiceVolumeSpeak = data.call_ctrl_line2.VoiceVolumeSpeak
    form.call_ctrl_line2.SIPPacketizationTime = data.call_ctrl_line2.SIPPacketizationTime
    form.call_ctrl_line2.G722.priority = data.call_ctrl_line2.G722.priority
    form.call_ctrl_line2.G711a.priority = data.call_ctrl_line2.G711a.priority
    form.call_ctrl_line2.G711u.priority = data.call_ctrl_line2.G711u.priority
    form.call_ctrl_line2.G729.priority = data.call_ctrl_line2.G729.priority
    form.call_ctrl_line2.G723.priority = data.call_ctrl_line2.G723.priority
  })
}
const getWanInfo = () => {
  getWan().then(({ data }) => {
    const { items } = data
    hasVoipWan.value = items.some((item) => {
      return (
        item.serviceType === ServiceType.VOICE || item.serviceType === ServiceType.VOICE_INTERNET
      )
    })
    if (hasVoipWan.value) {
      // todo
    }
  })
}
onMounted(() => {
  getWanInfo()
  getVoipAdvancedSettingsData()
})
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
