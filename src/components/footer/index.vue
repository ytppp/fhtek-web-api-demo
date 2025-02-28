<template>
  <div class="footer">
    <span class="copy">{{ copyright }}</span>
    <!-- <span class="policy-text"
          @click.stop="showPolicy()">
      {{$t('trans0139')}}
    </span> -->
    <!-- <fh-modal :visible.sync="show">
      <fh-modal-header>
        <div class="dialog-title">{{ $t('trans0139') }}</div>
      </fh-modal-header>
      <fh-modal-body>
        <div class="dialog-content">
          <div style="height:100%;padding:20px 0;font-size:0;"
               v-html="policy"></div>
        </div>
      </fh-modal-body>
      <fh-modal-footer>
        <div class="button-container">
          <button class="btn btn-dialog-confirm"
                  @click="close()">
            {{ $t('trans0024') }}
          </button>
        </div>
      </fh-modal-footer>
    </fh-modal> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'FhFotter',
})

const show = ref(false)
const { t } = useI18n()

const policy = computed(() => {
  // return require('./policy-en.html');
  return ''
})
const copyright = computed(() => {
  return `${t('trans0009')} ${t('trans0008')}`
})

const showPolicy = () => {
  console.log('showPolicy')
}
const close = () => {
  show.value = false
}
</script>
