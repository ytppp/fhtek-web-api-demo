<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0055') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="dosForm" :model="dosForm">
        <fh-form-item
          :label="$t('trans0115')"
        >
          <fh-switch v-model="dosForm.Dos_Flag" @change="switchEnable"> </fh-switch>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DosPage',
  data() {
    return {
      dosForm: {
        DosConfig_Flag: false,
        Dos_Flag: false,
      },
    }
  },
  methods: {
    switchEnable() {
      this.dosForm.DosConfig_Flag = '1'
      this.loadingBeforeAction(() => {
        this.submit('dosForm')
      })
    },
  },
  created() {
    // if (
    //   synFloodEnable == '1' &&
    //   icmpEchoEnable == '1' &&
    //   icmpPredirectionEnable == '1' &&
    //   portScanEnable == '1' &&
    //   smurfAttackEnable == '1' &&
    //   invalidWanPackageEnable == '1' &&
    //   ipSpoofingEnable == '1'
    // ) {
    //   this.dosForm.Dos_Flag = '1'
    // } else {
    //   this.dosForm.Dos_Flag = '0'
    // }
  },
}
</script>
