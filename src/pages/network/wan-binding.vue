<template>
  <div class="page wan-binding">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0751') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table
          :columns="columns"
          :data-source="data"
          :show-row-checkbox="false"
          :show-index="false"
          @clickRow="(row) => clickRow(row)"
        >
        </fh-table>
      </div>
    </div>
    <fh-modal v-model="visible" :title="$t('trans0165')">
      <template #body>
        <fh-form class="form modal-form" ref="modalFormRef" :model="form" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0754')" label-position="left">
            {{ form.port }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0752')">
            <fh-select v-model="form.mode" :options="modeList"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0753')" prop="mappingName" v-if="isVlan">
            <fh-input v-model="form.pair"></fh-input>
          </fh-form-item>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="save" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </fh-form>
      </template>
    </fh-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { format } from '@/util/tool'

enum Mode {
  port = 'port',
  vlan = 'vlan',
}
const { t } = useI18n()
const { cleanData, defaultVal } = useDataClean()

const modalFormRef = ref(null)
const visible = ref(false)
const columns = reactive([
  {
    key: 'port',
    title: t('trans0754'),
  },
  {
    key: 'mode',
    title: t('trans0752'),
  },
  {
    key: 'pairAlias',
    title: t('trans0753'),
  },
])
const data = reactive([
  {
    port: 'LAN1',
    mode: 'Port Binding',
    pair: '',
    pairAlias: '-',
  },
])
const modeList = reactive([
  {
    text: t('trans0755'),
    value: Mode.port,
  },
  {
    text: t('trans0756'),
    value: Mode.vlan,
  },
])
const form = reactive({
  port: '',
  mode: Mode.port,
  pair: '',
})
const modalFormRules = reactive({
  pair: [
    {
      rule: (value) => {
        if (isVlan.value) {
          return !/^\s*$/g.test(value)
        }
        return true
      },
      message: t('trans0004'),
    },
  ],
})
const isVlan = computed(() => form.mode === Mode.vlan)
const clickRow = (row) => {
  form.port = row.port
  form.mode = row.mode
  form.pair = row.pair
  visible.value = true
}
const save = () => {
  console.log(form)
}
</script>

<style lang="less">
.wan-binding {
  .table-main__content-row {
    cursor: pointer;
  }
}
</style>
