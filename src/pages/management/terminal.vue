<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0401') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form" name="form" method="post">
        <input type="hidden" name="terminal_flag" v-model="form.terminal_flag" />
        <fh-form-item :label="$t('trans0403')" label-position="left" label-width="120px">
          <fh-switch name="telnetenable_flag" v-model="form.telnetEnable" />
        </fh-form-item>
        <fh-form-item :label="$t('trans0402')" label-position="left" label-width="120px">
          <fh-switch name="telnetssh_flag" v-model="form.sshEnable" />
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
export default {
  data() {
    return {
      form: {
        terminal_flag: '0',
        telnetEnable: false,
        sshEnable: false,
      },
    }
  },
  methods: {
    save() {
      this.form.terminal_flag = '1'
      this.loadingBeforeAction(() => {
        this.submit('form')
      })
    },
  },
}
</script>
