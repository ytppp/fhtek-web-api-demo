<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0827') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form">
        <fh-form-item :label="$t('trans0058')">
          <fh-switch v-model="form.enable"></fh-switch>
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0104')">
            <fh-radio-group v-model="form.mode" @change="changeFilterMode">
              <fh-radio v-for="mode in filteringModes" :key="mode.value" :label="mode.value">{{
                mode.text
              }}</fh-radio>
            </fh-radio-group>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__table page__table--padding">
        <fh-table :columns="columns" :data-source="data" :show-row-checkbox="false">
          <template #operationgroup>
            <fh-icon
              class="page__header-icon"
              v-if="isShowAddBtn"
              @click="openAddModal"
              name="icon-add"
              :title="$t('trans0164')"
            />
          </template>
          <template #operation="scope">
            <fh-icon
              class="page__header-icon"
              @click="openEditModal(scope.row)"
              name="icon-edit-square"
              :title="$t('trans0165')"
            />
            <fh-icon
              class="page__header-icon"
              @click="del(scope.row)"
              name="icon-delete"
              :title="$t('trans0111')"
            />
          </template>
        </fh-table>
      </div>
      <fh-modal v-model="visible" :title="modalTitle" :before-close="handleClose">
        <template #body>
          <fh-form
            class="form modal-form"
            ref="modalFormRef"
            :model="modalForm"
            :rules="modalRules"
          >
            <fh-form-item :label="$t('trans0711')">
              <fh-select v-model="modalForm.id" :options="ssidOpts"> </fh-select>
            </fh-form-item>
            <fh-form-item :label="$t('trans0097')" prop="mac">
              <fh-input v-model="modalForm.mac" :placeholder="$t('trans0396')"> </fh-input>
            </fh-form-item>
            <fh-form-item class="form__submit-btn">
              <fh-button @click="saveItem" block>
                {{ $t('trans0002') }}
              </fh-button>
            </fh-form-item>
          </fh-form>
        </template>
      </fh-modal>
    </div>
  </div>
</template>

<script>
import { isMac, format } from '@/util/tool'
import { FilteringModes, ModalType, SsidText } from '@/util/constant'
import {
  getWifiMacFilterStatus,
  setWifiMacFilterStatus,
  getWifiMacFilter,
  addWifiMacFilter,
  editWifiMacFilter,
  delWifiMacFilter,
  getWifi2g,
  getWifi5g,
} from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

const { convertBooleanStatus } = useDataClean()
const maxRuleNum = 16
export default {
  name: 'WifiMacFilterPage',
  data() {
    return {
      form: {
        enable: false,
        mode: FilteringModes.blackList,
      },
      modalForm: {
        id: '',
        index: -1,
        mac: '',
        pre_id: '',
        pre_mac: '',
      },
      ssidOpts: [],
      columns: [
        {
          key: 'idAlias',
          title: this.$t('trans0711'),
        },
        {
          key: 'mac',
          title: this.$t('trans0097'),
        },
      ],
      data: [],
      visible: false,
      modalType: ModalType.add,
      all: 'all',
      modalRules: {
        mac: [
          {
            rule: (value) => value.trim(),
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isMac(value),
            message: format(this.$t('trans0566'), [this.$t('trans0097')]),
          },
          {
            rule: (value) => {
              let flag = true
              let tempData = []
              if (this.isAdd) {
                tempData = this.data
              } else {
                tempData = this.data.filter((item) => item.index !== this.modalForm.index)
              }
              flag = !tempData.some((item) => {
                return item.mac === value
              })
              return flag
            },
            message: this.$t('trans0400'),
          },
        ],
      },
      filteringModes: [
        {
          value: FilteringModes.blackList,
          text: this.$t('trans0105'),
        },
        {
          value: FilteringModes.whiteList,
          text: this.$t('trans0106'),
        },
      ],
    }
  },
  computed: {
    isBlackList() {
      return this.form.mode === FilteringModes.blackList
    },
    isShowAddBtn() {
      return this.data.length < maxRuleNum
    },
    isAdd() {
      return this.modalType === ModalType.add
    },
    isEdit() {
      return this.modalType === ModalType.edit
    },
    modalTitle() {
      return this.isAdd ? this.$t('trans0164') : this.$t('trans0165')
    },
  },
  methods: {
    changeFilterMode() {
      const message = this.$t('trans0125').format(
        this.isBlackList ? this.$t('trans0105') : this.$t('trans0106'),
      )
      this.$dialog
        .confirm({
          okText: this.$t('trans0019'),
          cancelText: this.$t('trans0020'),
          message,
        })
        .then(() => {})
        .catch(() => {
          this.form.mode = this.isBlackList ? FilteringModes.whiteList : FilteringModes.blackList
        })
    },
    getWifiMacFilterStatusData() {
      getWifiMacFilterStatus().then(({ data }) => {
        this.form.enable = convertBooleanStatus(data.enable)
        this.form.mode = data.mode
      })
    },
    save() {
      const data = {
        enable: convertBooleanStatus(this.form.enable),
        mode: this.form.mode,
      }
      setWifiMacFilterStatus(data)
    },
    openAddModal() {
      this.modalForm.id = this.ssidOpts[0].value
      this.modalForm.mac = ''
      this.modalForm.pre_id = ''
      this.modalForm.pre_mac = ''
      this.modalForm.index = -1
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.id = row.id
      this.modalForm.mac = row.mac
      this.modalForm.pre_id = row.pre_id
      this.modalForm.pre_mac = row.pre_mac
      this.modalForm.index = row.index
      this.modalType = ModalType.edit
      this.visible = true
    },
    getWifiMacFilterList() {
      getWifiMacFilter()
        .then(({ data }) => {
          const tableData = []
          const { items } = data
          items.forEach((item, i) => {
            tableData.push({
              ...item,
              idAlias: item.id === this.all ? this.$t('trans0537') : SsidText[item.id],
              pre_id: item.id,
              pre_mac: item.mac,
              index: i,
            })
          })
          this.data = tableData
        })
        .catch(() => {})
        .finally(() => {
          this.visible = false
        })
    },
    handleClose() {
      this.$refs.modalFormRef.clearValidate()
    },
    getSsidIndex() {
      Promise.all([getWifi2g(), getWifi5g()]).then(([res1, res2]) => {
        const wifi2g = res1.data.items
        const wifi5g = res2.data.items
        const ssidOpts = [
          {
            value: this.all,
            text: this.$t('trans0537'),
          },
        ]
        ;[...wifi2g, ...wifi5g].forEach((item) => {
          if (convertBooleanStatus(item.enable)) {
            ssidOpts.push({
              value: item.id,
              text: SsidText[item.id],
            })
          }
        })
        this.ssidOpts = ssidOpts
      })
    },
    saveItem() {
      if (!this.$refs.modalFormRef.validate()) return
      const data = {
        id: this.modalForm.id,
        mac: this.modalForm.mac,
      }
      if (this.isAdd) {
        addWifiMacFilter(data).then(() => {
          this.getWifiMacFilterList()
        })
      }
      if (this.isEdit) {
        delWifiMacFilter({
          id: this.modalForm.pre_id,
          mac: this.modalForm.pre_mac,
        }).then(() => {
          editWifiMacFilter(data).then(() => {
            this.getWifiMacFilterList()
          })
        })
      }
    },
    del(row) {
      delWifiMacFilter({
        id: row.id,
        mac: row.mac,
      }).then(() => {
        this.getWifiMacFilterList()
      })
    },
  },
  mounted() {
    this.getWifiMacFilterStatusData()
    this.getSsidIndex()
    this.getWifiMacFilterList()
  },
}
</script>
