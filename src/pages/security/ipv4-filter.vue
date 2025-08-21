<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0131') }}</h1>
    </div>
    <div class="page__content">
      <template v-if="isEnable">
        <!-- <fh-form class="form" ref="form" :model="form">
          <fh-form-item :label="$t('trans0059')">
            <fh-switch v-model="form.enable" @change="switchEnable"></fh-switch>
          </fh-form-item>
        </fh-form> -->
        <div class="page__table">
          <fh-table :columns="columns" :data-source="data" :show-header="isShowAddBtn">
            <template #operationgroup>
              <fh-icon
                class="page__header-icon"
                v-if="isShowAddBtn"
                @click="openAddModal"
                name="icon-add"
                :title="$t('trans0164')"
              />
            </template>
            <template #enable="scope">
              <fh-switch v-model="scope.row.enable" @change="toggleStatus(scope.row)" />
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
              ref="modalForm"
              :model="modalForm"
              :rules="modalFormRules"
            >
              <fh-form-item :label="$t('trans0166')">
                <fh-switch v-model="modalForm.enable"></fh-switch>
              </fh-form-item>
              <fh-form-item :label="$t('trans0150')" prop="name">
                <fh-input name="AclRuleName" v-model="modalForm.name"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0136')" prop="src_ip">
                <fh-input
                  name="src_ip"
                  v-model="modalForm.src_ip"
                  :placeholder="placeholderTips"
                ></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0139')" prop="dest_port">
                <fh-input
                  name="dest_port"
                  v-model="modalForm.dest_port"
                  :placeholder="numPlaceholder"
                ></fh-input>
                <template #extra>
                  {{ $t('trans0902').format($t('trans0139')) }}
                </template>
              </fh-form-item>
              <fh-form-item :label="$t('trans0135')">
                <fh-select v-model="modalForm.proto" :options="protoList" name="proto"> </fh-select>
              </fh-form-item>
              <fh-form-item class="form__submit-btn">
                <fh-button id="submitbutton" @click="save" block>
                  {{ $t('trans0002') }}
                </fh-button>
              </fh-form-item>
            </fh-form>
          </template>
        </fh-modal>
      </template>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0903') }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  isValidVal,
  isValidName,
  isPrivateIP,
  cidrToSubnetMask,
  isMulticast,
  isLoopback,
  successTips,
  getIpAfter,
  isValidInteger,
} from '@/util/tool'
import { ModalType, ProtocolType } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'
import {
  getIpv4Filter,
  addIpv4Filter,
  editIpv4Filter,
  delIpv4Filter,
  getFirewall,
} from '@/http/api'

function isValidStaticRouteMask(ip, mask) {
  if (getIpAfter(ip) !== '0' && mask === '255.255.255.255') return true
  if (getIpAfter(ip) === '0' && mask !== '255.255.255.255') return true
  return false
}
const { convertBooleanStatus } = useDataClean()
const Interface = {
  wan: 'wan',
  lan: 'lan',
  both: 'both',
}
const numPlaceholder = '0-65535'
const maxAclRuleNum = 8
export default {
  name: 'Ipv4FilterPage',
  data() {
    return {
      numPlaceholder,
      maxAclRuleNum,
      modalType: ModalType.add,
      visible: false, // dialog visible
      form: {
        enable: false,
      },
      lanIp: '',
      modalForm: {
        index: -1,
        id: '',
        src_ip: '',
        dest_port: '',
        enable: true,
        name: '',
        proto: ProtocolType.ALL,
      },
      modalFormRules: {
        name: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidName(value),
            message: this.$t('trans0167'),
          },
          {
            rule: (value) => isValidVal(value, 1, 32),
            message: this.$t('trans0167'),
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
                return item.name === value
              })
              return flag
            },
            message: this.$t('trans0678').format(this.$t('trans0150')),
          },
        ],
        src_ip: [
          {
            rule: (value) => {
              if (!value) return true
              const parts = value.split('/')
              if (parts.length !== 2) return false
              const ip = parts[0]
              const suffix = parts[1]
              if (isPrivateIP(ip)) {
                const mask = cidrToSubnetMask(parseInt(suffix))
                if (!mask) return false
                // isNetworkIP(ip, mask) || sBoardcastIP(ip, mask)
                if (isMulticast(ip) || isLoopback(ip) || !isValidStaticRouteMask(ip, mask)) {
                  return false
                }
                if (!this.lanIp && this.lanIp === ip) {
                  return false
                }
                return true
              }
              return false
            },
            message: this.$t('trans0566').format(this.$t('trans0136')),
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
                if (this.modalForm.proto === ProtocolType.ALL) {
                  return item.src_ip === value
                }
                return item.proto === this.modalForm.proto && item.src_ip === value
              })
              return flag
            },
            message: this.$t('trans0678').format(this.$t('trans0136')),
          },
        ],
        dest_port: [
          {
            rule: (value) => {
              if (!value) return true
              const ports = value.split(':')
              if (ports.length > 2) return false
              return ports.every((port) => isValidInteger(port, 0, 65535))
            },
            message: this.$t('trans0566').format(this.$t('trans0139')),
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
                if (this.modalForm.proto === ProtocolType.ALL) {
                  return item.dest_port === value
                }
                return item.proto === this.modalForm.proto && item.dest_port === value
              })
              return flag
            },
            message: this.$t('trans0678').format(this.$t('trans0139')),
          },
        ],
      },
      protoText: {
        [ProtocolType.ALL]: this.$t('trans0158'),
        [ProtocolType.TCP]: this.$t('trans0190'),
        [ProtocolType.UDP]: this.$t('trans0191'),
        [ProtocolType.ICMP]: this.$t('trans0192'),
        [ProtocolType.IGMP]: this.$t('trans0375'),
      },
      columns: [
        {
          key: 'name',
          title: this.$t('trans0150'),
          width: 180,
        },
        {
          key: 'src_ip',
          title: this.$t('trans0136'),
        },
        {
          key: 'dest_port',
          title: this.$t('trans0139'),
        },
        {
          key: 'protoAlias',
          title: this.$t('trans0135'),
        },
        {
          key: 'enable',
          title: this.$t('trans0166'),
          width: '60',
        },
      ],
      data: [],
      isEnable: false,
    }
  },
  computed: {
    isShowAddBtn() {
      return this.data.length < maxAclRuleNum
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
    placeholderTips() {
      return `${this.$t('trans0598').format(this.$t('trans0456'))}/${this.$t('trans0459')}`
    },
    protoList() {
      return [
        {
          value: ProtocolType.ALL,
          text: this.protoText[ProtocolType.ALL],
        },
        {
          value: ProtocolType.TCP,
          text: this.protoText[ProtocolType.TCP],
        },
        {
          value: ProtocolType.UDP,
          text: this.protoText[ProtocolType.UDP],
        },
        // {
        //   value: ProtocolType.ICMP,
        //   text: this.protoText[ProtocolType.ICMP],
        // },
        // {
        //   value: ProtocolType.IGMP,
        //   text: this.protoText[ProtocolType.IGMP],
        // },
      ]
    },
  },
  methods: {
    // switchEnable(val) {
    // },
    handleClose() {
      this.$refs.modalForm.clearValidate()
    },
    openAddModal() {
      this.modalForm.index = -1
      this.modalForm.id = ''
      this.modalForm.src_ip = ''
      this.modalForm.dest_port = ''
      this.modalForm.enable = true
      this.modalForm.name = ''
      this.modalForm.proto = ProtocolType.ALL
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.index = row.index
      this.modalForm.id = row.id
      this.modalForm.src_ip = row.src_ip
      this.modalForm.dest_port = row.dest_port
      this.modalForm.enable = row.enable
      this.modalForm.name = row.name
      this.modalForm.proto = row.proto
      this.modalType = ModalType.edit
      this.visible = true
    },
    toggleStatus(row) {
      editIpv4Filter([
        {
          id: row.id,
          enabled: convertBooleanStatus(row.enable),
        },
      ]).then(() => {
        this.getIpv4FilterData()
      })
    },
    del(row) {
      delIpv4Filter({
        id: row.id,
      }).then(() => {
        successTips('trans0410')
        this.getIpv4FilterData()
      })
    },
    save() {
      if (!this.$refs.modalForm.validate()) return
      const data = {
        src: Interface.wan, // 传固定值
        dest: Interface.lan, // 传固定值
        target: 'REJECT', // 传固定值
        src_ip: this.modalForm.src_ip,
        dest_port: this.modalForm.dest_port,
        enabled: convertBooleanStatus(this.modalForm.enable),
        proto: this.modalForm.proto,
        name: this.modalForm.name,
      }
      if (this.isAdd) {
        addIpv4Filter([data]).then(() => {
          successTips()
          this.getIpv4FilterData()
        })
      }
      if (this.isEdit) {
        data.id = this.modalForm.id
        editIpv4Filter([data]).then(() => {
          successTips()
          this.getIpv4FilterData()
        })
      }
    },
    getIpv4FilterData(isInit = false) {
      getIpv4Filter()
        .then(({ data }) => {
          const { items } = data
          const tableData = []
          items.forEach((item, i) => {
            tableData.push({
              ...item,
              enable: convertBooleanStatus(item.enabled),
              protoAlias: this.protoText[item.proto],
              index: i,
            })
          })
          this.data = tableData
        })
        .catch(() => {})
        .finally(() => {
          if (!isInit) this.visible = false
        })
    },
    getFirewallData() {
      getFirewall().then(({ data }) => {
        const { enable, custom } = data
        this.isEnable = convertBooleanStatus(enable) && convertBooleanStatus(custom)
        if (this.isEnable) {
          this.getIpv4FilterData(true)
        }
      })
    },
  },
  created() {
    this.getFirewallData()
  },
}
</script>
