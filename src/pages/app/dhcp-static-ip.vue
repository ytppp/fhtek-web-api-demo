<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0806') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table :columns="columns" :data-source="diplayData" :show-row-checkbox="false">
          <template #filtergroup>
            <fh-select v-model="display" :options="displayOptions"></fh-select>
          </template>
          <template #operationgroup>
            <fh-button size="small" v-if="isShowAddBtn" @click="openAddModal">
              {{ $t('trans0164') }}
            </fh-button>
          </template>
          <template #operation="scope">
            <fh-button type="text" @click="openEditModal(scope.row)">
              {{ $t('trans0165') }}
            </fh-button>
            <fh-button type="text" @click="del(scope.row)">
              {{ $t('trans0111') }}
            </fh-button>
          </template>
        </fh-table>
      </div>
    </div>
    <fh-modal v-model:visible="visible" :title="modalTitle">
      <template #body>
        <fh-form class="form modal-form" ref="modalForm" :model="modalForm" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0770')">
            <fh-radio-group v-model="modalForm.type">
              <fh-radio v-for="item in ipOptions" :key="item.value" :label="item.value">
                {{ item.text }}
              </fh-radio>
            </fh-radio-group>
          </fh-form-item>
          <fh-form-item :label="$t('trans0393')" prop="ip">
            <fh-input v-model="modalForm.ip"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0097')" prop="mac">
            <fh-input v-model="modalForm.mac"></fh-input>
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

<script>
import { isIP, isMulticast, isLoopback, isNetworkIP, isBoardcastIP, format } from '@/util/tool'
import { getWan, getStaticRoute, addStaticRoute, editStaticRoute, delStaticRoute } from '@/http/api'
import { ModalType, IP } from '@/util/constant'

const maxRuleNum = 16
const all = 'all'
export default {
  data() {
    return {
      all,
      maxRuleNum,
      modalType: ModalType.add,
      visible: false,
      display: all,
      displayOptions: [
        {
          value: all,
          text: this.$t('trans0537'),
        },
        {
          value: IP.IPv4,
          text: this.$t('trans0456'),
        },
        {
          value: IP.IPv6,
          text: this.$t('trans0457'),
        },
      ],
      ipOptions: [
        {
          value: IP.IPv4,
          text: this.$t('trans0456'),
        },
        {
          value: IP.IPv6,
          text: this.$t('trans0457'),
        },
      ],
      modalForm: {
        id: '',
        type: '',
        ip: '',
        mac: '',
      },
      index: -1,
      modalFormRules: {
        ip: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
        ],
        mac: [
          {
            rule: (value) => value.trim(),
            message: this.$t('trans0004'),
          },
        ],
      },
      columns: [
        {
          key: 'type',
          title: this.$t('trans0770'),
        },
        {
          key: 'ip',
          title: this.$t('trans0393'),
        },
        {
          key: 'mac',
          title: this.$t('trans0097'),
        },
      ],
      data: [],
    }
  },
  computed: {
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
    isIpv4() {
      return this.modalForm.type === IP.IPv4
    },
    isIpv6() {
      return this.modalForm.type === IP.IPv6
    },
    diplayData() {
      if (this.display === all) return this.data
      else if (this.display === IP.IPv4) return this.data.filter((item) => item.type === IP.IPv4)
      else if (this.display === IP.IPv6) return this.data.filter((item) => item.type === IP.IPv6)
    },
  },
  methods: {
    openAddModal() {
      this.modalForm.id = -1
      this.modalForm.type = IP.IPv4
      this.modalForm.target = ''
      this.modalForm.gateway = ''
      this.modalForm.interface = ''
      this.index = -1
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.id = row.id
      this.modalForm.type = row.type
      this.modalForm.target = row.target
      this.modalForm.gateway = row.gateway
      this.modalForm.interface = row.interface
      this.index = row.index
      this.modalType = ModalType.edit
      this.visible = true
    },
    save() {
      if (this.$refs.modalForm.validate()) {
        const data = {}
        if (this.isAdd) {
          data.type = this.modalForm.type
          data.target = this.modalForm.target
          data.gateway = this.modalForm.gateway
          data.interface = this.modalForm.interface
          addStaticRoute([data]).then((res) => {
            this.visible = false
            this.getStaticRouteListData()
          })
        }
        if (this.isEdit) {
          data.id = this.modalForm.id
          data.type = this.modalForm.type
          data.target = this.modalForm.target
          data.gateway = this.modalForm.gateway
          data.interface = this.modalForm.interface
          editStaticRoute([data]).then((res) => {
            this.visible = false
            this.getStaticRouteListData()
          })
        }
      }
    },
    del(row) {
      delStaticRoute({ id: row.id }).then((res) => {
        this.getStaticRouteListData()
      })
    },
    getStaticRouteListData() {
      getStaticRoute().then(({ data }) => {
        const tableData = []
        const { items } = data
        items.forEach((item, i) => {
          tableData.push({
            ...item,
            index: i,
          })
        })
        this.data = tableData
      })
    },
  },
  created() {
    this.getStaticRouteListData()
  },
}
</script>
