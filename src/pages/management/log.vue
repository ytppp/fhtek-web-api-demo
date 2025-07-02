<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0188') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form">
        <fh-form-item :label="$t('trans0188')">
          <fh-switch v-model="form.enable" @change="switchEnable" />
        </fh-form-item>
        <fh-form-item :label="$t('trans0239')">
          <fh-select v-model="form.writeLevel" :options="logLevelList" />
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="log">
        <div class="log__header">
          <fh-button @click="reloadFrame">
            {{ $t('trans0240') }}
          </fh-button>
          <fh-button @click="backupSyslog">
            {{ $t('trans0241') }}
          </fh-button>
        </div>
        <div class="log__main">
          <div style="width: 100%; height: 600px">log记录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const LogLevel = {
  Emergency: '0',
  Alarm: '1',
  Importance: '2',
  Error: '3',
  Warning: '4',
  Note: '5',
  Notice: '6',
  Debug: '7',
}
export default {
  data() {
    return {
      form: {
        enable: false,
        writeLevel: LogLevel.Debug,
      },
      displayLevel: LogLevel.Debug,
      logLevelList: [
        {
          value: LogLevel.Emergency,
          text: this.$t('trans0231'),
        },
        {
          value: LogLevel.Alarm,
          text: this.$t('trans0232'),
        },
        {
          value: LogLevel.Importance,
          text: this.$t('trans0233'),
        },
        {
          value: LogLevel.Error,
          text: this.$t('trans0234'),
        },
        {
          value: LogLevel.Warning,
          text: this.$t('trans0235'),
        },
        {
          value: LogLevel.Note,
          text: this.$t('trans0236'),
        },
        {
          value: LogLevel.Notice,
          text: this.$t('trans0237'),
        },
        {
          value: LogLevel.Debug,
          text: this.$t('trans0238'),
        },
      ],
    }
  },
  methods: {
    switchEnable() {
      // todo
    },
    save() {
      // todo
    },
    backupSyslog() {
      // todo
      // const cfg = '/syslog.txt'
      // if (this.form.enable) {
      //   window.location.href = cfg
      // }
    },
    reloadFrame() {
      // todo
    },
  },
}
</script>

<style lang="less">
.log {
  border-top: 1px solid #c9c9c9;
  padding-top: 20px;
  margin-top: 20px;
  .log__header {
    font-size: 0;
    .btn {
      height: 40px !important;
      margin-right: 5px;
    }
  }
  .log__header-select {
    width: 245px;
    display: inline-block;
    @media screen and (max-width: 768px) {
      margin-top: 5px;
    }
  }
  .log__main {
    margin-top: 20px;
  }
}
</style>
