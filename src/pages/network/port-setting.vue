<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0751') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" :model="form" v-if="isMobile">
        <fh-form-item :label="SsidText[Lan1]">
          <fh-select
            @change="(val: string) => changePort(val, Lan1)"
            v-model="form[Lan1]"
            :options="modeList"
          >
          </fh-select>
        </fh-form-item>
        <fh-form-item :label="SsidText[Lan2]">
          <fh-select
            @change="(val: string) => changePort(val, Lan2)"
            v-model="form[Lan2]"
            :options="modeList"
          >
          </fh-select>
        </fh-form-item>
        <fh-form-item :label="SsidText[Lan3]">
          <fh-select
            @change="(val: string) => changePort(val, Lan3)"
            v-model="form[Lan3]"
            :options="modeList"
          >
          </fh-select>
        </fh-form-item>
        <fh-form-item :label="SsidText[Lan4]">
          <fh-select
            @change="(val: string) => changePort(val, Lan4)"
            v-model="form[Lan4]"
            :options="modeList"
          >
          </fh-select>
        </fh-form-item>
      </fh-form>
      <fh-table
        :columns="columns"
        :data-source="tableData"
        :show-index="false"
        :show-row-checkbox="false"
        :show-header="false"
        :border="true"
        :hover="false"
        v-else
      >
        <template #[Lan1]="scope">
          <fh-select
            @change="(val) => changePort(val, Lan1)"
            v-model="scope.row[Lan1]"
            :options="modeList"
          ></fh-select>
        </template>
        <template #[Lan2]="scope">
          <fh-select
            @change="(val) => changePort(val, Lan2)"
            v-model="scope.row[Lan2]"
            :options="modeList"
          ></fh-select>
        </template>
        <template #[Lan3]="scope">
          <fh-select
            @change="(val) => changePort(val, Lan3)"
            v-model="scope.row[Lan3]"
            :options="modeList"
          ></fh-select>
        </template>
        <template #[Lan4]="scope">
          <fh-select
            @change="(val) => changePort(val, Lan4)"
            v-model="scope.row[Lan4]"
            :options="modeList"
          ></fh-select>
        </template>
      </fh-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Lan1, Lan2, Lan3, Lan4, SsidText } from '@/util/constant'
import { getLanSpeed, setLanSpeed } from '@/http/api'
import { successTips } from '@/util/tool'
import { useIsMobile } from '@/hooks/is-mobile'

enum Mode {
  auto = 'auto',
  h10 = '10half',
  f10 = '10full',
  h100 = '100half',
  f100 = '100full',
  f1000 = '1000full',
}

const { t } = useI18n()
const { isMobile } = useIsMobile()
const tableData = reactive([])
const form = reactive({
  [Lan1]: '',
  [Lan2]: '',
  [Lan3]: '',
  [Lan4]: '',
})
const columns = reactive([
  {
    key: Lan1,
    title: SsidText[Lan1],
  },
  {
    key: Lan2,
    title: SsidText[Lan2],
  },
  {
    key: Lan3,
    title: SsidText[Lan3],
  },
  {
    key: Lan4,
    title: SsidText[Lan4],
  },
])
const modeList = [
  {
    text: t('trans0487'),
    value: Mode.auto,
  },
  {
    text: '10M/Half Duplex',
    value: Mode.h10,
  },
  {
    text: '10M/Full Duplex',
    value: Mode.f10,
  },
  {
    text: '100M/Half Duplex',
    value: Mode.h100,
  },
  {
    text: '100M/Full Duplex',
    value: Mode.f100,
  },
  {
    text: '1000M/Full Duplex',
    value: Mode.f1000,
  },
]
const changePort = (val: string, type: string) => {
  setLanSpeed({
    ifname: type,
    speed: val,
  }).then(() => {
    successTips()
    getLanSpeedData()
  })
}
const getLanSpeedData = () => {
  getLanSpeed().then(({ data }) => {
    const { items } = data
    const thisTableData = [
      {
        [Lan1]: items.find((item) => item.ifname === Lan1).speed,
        [Lan2]: items.find((item) => item.ifname === Lan2).speed,
        [Lan3]: items.find((item) => item.ifname === Lan3).speed,
        [Lan4]: items.find((item) => item.ifname === Lan4).speed,
      },
    ]
    Object.assign(tableData, thisTableData)
    form[Lan1] = items.find((item) => item.ifname === Lan1).speed
    form[Lan2] = items.find((item) => item.ifname === Lan2).speed
    form[Lan3] = items.find((item) => item.ifname === Lan3).speed
    form[Lan4] = items.find((item) => item.ifname === Lan4).speed
  })
}
onMounted(() => {
  getLanSpeedData()
})
</script>
