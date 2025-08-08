<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0059') }}</h1>
    </div>
    <div class="page__content">
      <!-- <fh-form class="form" ref="form" :model="form">
        <fh-form-item :label="$t('trans0059')">
          <fh-switch v-model="form.enable" @change="switchEnable"></fh-switch>
        </fh-form-item>
      </fh-form> -->
      <div class="page__table">
        <fh-table :columns="columns" :data-source="data">
          <template #operationgroup>
            <fh-icon
              class="page__header-icon"
              v-if="isShowAddBtn"
              @click="openAddModal"
              name="icon-add"
              :title="$t('trans0164')"
            />
          </template>
          <template #enabled="scope">
            <fh-switch v-model="scope.row.active" @change="toggleStatus(scope.row)" />
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
          <fh-form-item :label="$t('trans0166')">
            <fh-switch v-model="modalForm.enable"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0150')" prop="aclRuleName">
            <fh-input name="AclRuleName" v-model="modalForm.aclRuleName"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0136')" prop="srcIp">
            <fh-input
              name="ScrIPAddrBegin"
              v-model="modalForm.srcIp"
              :placeholder="placeholderTips"
            ></fh-input>
          </fh-form-item>
          <!-- <fh-form-item :label="$t('trans0153')">
            <fh-select
              v-model="modalForm.interface"
              :options="interfaceList"
              name="Interface"
            >
            </fh-select>
          </fh-form-item> -->
          <fh-form-item :label="$t('trans0154')">
            <fh-select
              v-model="modalForm.application"
              :options="applicationList"
              name="Application"
              @change="changeApplication"
            >
            </fh-select>
          </fh-form-item>
          <fh-form-item class="form__submit-btn">
            <fh-button id="submitbutton" @click="save" block>
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
  isValidVal,
  isValidName,
  isPrivateIP,
  cidrToSubnetMask,
  isMulticast,
  isLoopback,
  successTips,
  getIpAfter,
} from '@/util/tool'
import { ModalType } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'
import { getAcl, addAcl, editAcl, delAcl } from '@/http/api'

function isValidStaticRouteMask(ip, mask) {
  if (getIpAfter(ip) !== '0' && mask === '255.255.255.255') return true
  if (getIpAfter(ip) === '0' && mask !== '255.255.255.255') return true
  return false
}
function isValidMask(ip) {
  if (ip.split('.').filter((val) => val).length !== 4) return false
  const i = ip2int(ip).toString(2).padStart(32, '0')
  const result = i.split('10')
  // result.length !== 2
  if (result.length > 2) {
    return false
  }
  // 有效mask
  if (result[0].includes('0') || (result[1] && result[1].includes('1'))) {
    return false
  }
  return true
}
const { convertBooleanStatus } = useDataClean()
const Interface = {
  wan: 'wan',
  lan: 'lan',
  both: 'both',
}
const Application = {
  ALL: 'all',
  TELNET: 'telnet',
  WEB: 'web',
  PING: 'ping',
  FTP: 'ftp',
  SNMP: 'snmp',
  SSH: 'ssh',
}
const ApplicationPort = {
  [Application.TELNET]: '23',
  [Application.SSH]: '22',
  [Application.WEB]: '80',
  [Application.PING]: '',
  [Application.ALL]: 'all',
}
const maxAclRuleNum = 16
export default {
  name: 'AclPage',
  data() {
    return {
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
        srcIp: '',
        enable: true,
        port: ApplicationPort[Application.ALL],
        aclRuleName: '',
        application: Application.ALL,
      },
      modalFormRules: {
        aclRuleName: [
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
        ],
        srcIp: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => {
              const parts = value.split('/')
              if (parts.length !== 2) return false
              const ip = parts[0]
              const suffix = parts[1]
              if (isPrivateIP(ip)) {
                const flag = isValidMask(suffix)
                const mask = cidrToSubnetMask(parseInt(suffix))
                if (!flag && !mask) return false
                const maskVal = flag ? suffix : mask
                // isNetworkIP(ip, maskVal) || sBoardcastIP(ip, maskVal)
                if (isMulticast(ip) || isLoopback(ip) || !isValidStaticRouteMask(ip, maskVal)) {
                  return false
                }
                if (!this.lanIp && this.lanIp === ip) {
                  return false
                }
                return true
              }
              return false
            },
            message: this.$t('trans0197'),
          },
        ],
      },
      interfaceList: [
        {
          value: Interface.Wan,
          text: this.$t('trans0140'),
        },
        {
          value: Interface.Lan,
          text: this.$t('trans0156'),
        },
        // {
        //   value: Interface.Both,
        //   text: this.$t('trans0157'),
        // },
      ],
      applicationText: {
        [Application.ALL]: this.$t('trans0158'),
        [Application.PING]: this.$t('trans0159'),
        [Application.FTP]: this.$t('trans0160'),
        [Application.WEB]: this.$t('trans0161'),
        [Application.TELNET]: this.$t('trans0162'),
        [Application.SNMP]: this.$t('trans0163'),
        [Application.SSH]: this.$t('trans0402'),
      },
      columns: [
        {
          key: 'name',
          title: this.$t('trans0150'),
          width: 180,
        },
        {
          key: 'srcIp',
          title: this.$t('trans0136'),
        },
        // {
        //   key: 'interface',
        //   title: this.$t('trans0153'),
        // },
        {
          key: 'applicationAlias',
          title: this.$t('trans0154'),
        },
        {
          key: 'enabled',
          title: this.$t('trans0166'),
          width: '60',
        },
      ],
      data: [],
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
      return this.modalType === ModalType.Edit
    },
    modalTitle() {
      return this.isAdd ? this.$t('trans0164') : this.$t('trans0165')
    },
    placeholderTips() {
      return `${this.$t('trans0598').format(this.$t('trans0456'))}/${this.$t('trans0459')}`
    },
    applicationList() {
      return [
        {
          value: Application.ALL,
          text: this.applicationText[Application.ALL],
        },
        {
          value: Application.PING,
          text: this.applicationText[Application.PING],
        },
        // {
        //   value: Application.FTP,
        //   text: this.applicationText[Application.FTP],
        // },
        {
          value: Application.WEB,
          text: this.applicationText[Application.WEB],
        },
        {
          value: Application.TELNET,
          text: this.applicationText[Application.TELNET],
        },
        {
          value: Application.SSH,
          text: this.applicationText[Application.SSH],
        },
        // {
        //   value: Application.SNMP,
        //   text: this.applicationText[Application.SNMP],
        // },
      ]
    },
  },
  methods: {
    // switchEnable(val) {
    // },
    openAddModal() {
      this.modalForm.index = -1
      this.modalForm.id = ''
      this.modalForm.srcIp = ''
      this.modalForm.enable = true
      this.modalForm.port = ApplicationPort[Application.ALL]
      this.modalForm.aclRuleName = ''
      this.modalForm.application = Application.ALL
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.index = row.index
      this.modalForm.id = row.id
      this.modalForm.srcIp = row.srcIp
      this.modalForm.enable = row.enabled
      this.modalForm.port = row.port
      this.modalForm.aclRuleName = row.name
      this.modalForm.application = row.application
      this.modalType = ModalType.edit
      this.visible = true
    },
    toggleStatus(row) {
      editAcl([
        {
          id: row.id,
          enabled: convertBooleanStatus(row.enabled),
        },
      ]).then(() => {
        this.getAclData()
      })
    },
    changeApplication() {
      this.modalForm.port = ApplicationPort[this.modalForm.application]
    },
    del(row) {
      delAcl({
        id: row.id,
      }).then(() => {
        successTips('trans0410')
        this.getAclData()
      })
    },
    save() {
      if (!this.$refs.modalForm.validate()) return
      const data = {
        src: Interface.wan, // 传固定值
        dest: Interface.lan, // 传固定值
        src_ip: this.modalForm.srcIp,
        enabled: convertBooleanStatus(this.modalForm.enable),
        application: this.modalForm.application,
        port: this.modalForm.port,
        name: this.modalForm.aclRuleName,
      }
      if (this.isAdd) {
        addAcl([data]).then(() => {
          successTips()
          this.getAclData()
        })
      }
      if (this.isEdit) {
        data.id = this.modalForm.id
        editAcl([data]).then(() => {
          successTips()
          this.getAclData()
        })
      }
    },
    getAclData(isInit = false) {
      getAcl()
        .then(({ data }) => {
          const { items } = data
          const tableData = []
          items.forEach((item, i) => {
            tableData.push({
              ...item,
              srcIp: item.src_ip,
              applicationAlias: this.applicationText[item.application],
              enabled: convertBooleanStatus(item.enabled),
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
  },
  created() {
    this.getAclData(true)
  },
}
</script>
