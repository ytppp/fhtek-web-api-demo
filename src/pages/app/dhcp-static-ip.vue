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
    </div>
    <fh-modal v-model="visible" :title="modalTitle">
      <template #body>
        <fh-form class="form modal-form" ref="modalForm" :model="modalForm" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0135')">
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
import {
  isIP,
  isMulticast,
  isLoopback,
  getIpBefore,
  isMac,
  isNetworkIP,
  isBoardcastIP,
} from '@/util/tool'
import {
  getLan,
  getDhcpStaticIp,
  addDhcpStaticIp,
  editDhcpStaticIp,
  delDhcpStaticIp,
} from '@/http/api'
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
      lanIp: '',
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
          {
            rule: (value) => {
              if (this.isIpv4) {
                if (isIP(value, IP.IPv4)) {
                  // if (isMulticast(value) || isLoopback(value)) {
                  //   return false
                  // }
                  return true
                }
                return false
              }
              if (this.isIpv6) {
                return isIP(value, IP.IPv6)
              }
            },
            message: this.$t('trans0397'),
          },
          // {
          //   rule: (value) => {
          //     if (this.isIpv6) {
          //       return true
          //     }
          //     if (!this.lanIp) {
          //       return true
          //     }
          //     const lanIpBefore = getIpBefore(this.lanIp)
          //     const ipBefore = getIpBefore(value)
          //     if (ipBefore !== lanIpBefore || this.lanIp === value) {
          //       return false
          //     }
          //     return true
          //   },
          //   message: this.$t('trans0397'),
          // },
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
                return item.ip === value
              })
              return flag
            },
            message: this.$t('trans0399'),
          },
        ],
        mac: [
          {
            rule: (value) => value.trim(),
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isMac(value),
            message: this.$t('trans0566').format(this.$t('trans0097')),
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
      this.modalForm.ip = ''
      this.modalForm.mac = ''
      this.index = -1
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.id = row.id
      this.modalForm.type = row.type
      this.modalForm.ip = row.ip
      this.modalForm.mac = row.mac
      this.index = row.index
      this.modalType = ModalType.edit
      this.visible = true
    },
    save() {
      if (this.$refs.modalForm.validate()) {
        const data = {}
        if (this.isAdd) {
          data.type = this.modalForm.type
          data.ip = this.modalForm.ip
          data.mac = this.modalForm.mac
          addDhcpStaticIp(data).then(() => {
            this.getDhcpStaticIpData()
          })
        }
        if (this.isEdit) {
          data.id = this.modalForm.id
          data.type = this.modalForm.type
          data.ip = this.modalForm.ip
          data.mac = this.modalForm.mac
          editDhcpStaticIp(data).then(() => {
            this.getDhcpStaticIpData()
          })
        }
      }
    },
    del(row) {
      delDhcpStaticIp({ id: row.id }).then(() => {
        this.getDhcpStaticIpData()
      })
    },
    getDhcpStaticIpData() {
      getDhcpStaticIp()
        .then(({ data }) => {
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
        .catch(() => {})
        .finally(() => {
          this.visible = false
        })
    },
    getLanData() {
      getLan().then(({ data }) => {
        this.lanIp = data.lan.ip
      })
    },
  },
  created() {
    this.getLanData()
    this.getDhcpStaticIpData()
  },
}
</script>
