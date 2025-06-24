<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0059') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form">
        <fh-form-item :label="$t('trans0059')">
          <fh-switch v-model="form.enable" @change="switchEnable"></fh-switch>
        </fh-form-item>
      </fh-form>
      <div class="page__table">
        <fh-table :columns="columns" :data-source="data" @select="select">
          <template #operationgroup>
            <fh-button size="small" v-if="isShowAddBtn" @click="openAddModal">
              {{ $t('trans0164') }}
            </fh-button>
            <fh-button size="small" v-if="isShowDelBtn" @click="del">{{
              $t('trans0111')
            }}</fh-button>
          </template>
          <template #Active="scope">
            <fh-switch v-model="scope.row.Active" @change="toggleStatus(scope.row)" />
          </template>
          <template #operation="scope">
            <fh-button type="text" @click="openEditModal(scope.row)">
              {{ $t('trans0165') }}
            </fh-button>
          </template>
        </fh-table>
      </div>
    </div>
    <fh-modal v-model:visible="visible" :title="modalTitle">
      <template #body>
        <fh-form class="form modal-form" ref="modalForm" :model="modalForm" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0166')">
            <fh-switch v-model="modalForm.enable"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0150')" prop="aclRuleName">
            <fh-input name="AclRuleName" v-model="modalForm.aclRuleName"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0151')" prop="scrIPAddrBegin">
            <fh-input
              name="ScrIPAddrBegin"
              v-model="modalForm.scrIPAddrBegin"
              @blur="changeIPAddrBegin"
            ></fh-input>
            <template #extra>
              {{ $t('trans0171') }}
            </template>
          </fh-form-item>
          <fh-form-item :label="$t('trans0152')" prop="scrIPAddrEnd" ref="scrIPAddrEnd">
            <fh-input name="ScrIPAddrEnd" v-model="modalForm.scrIPAddrEnd"></fh-input>
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
import { isValidUrlName, getStringByte, isValidName, isPrivateIP } from '@/util/tool'
import { ModalType } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'

const { convertBooleanStatus } = useDataClean()
function cmpIpAddress(address1, address2) {
  let Lnum = 0
  let Snum = 0
  const addrParts1 = address1.split('.')
  const addrParts2 = address2.split('.')
  for (let i = 0; i <= 3; i++) {
    Lnum = parseInt(addrParts1[i])
    Snum = parseInt(addrParts2[i])
    if (Lnum < Snum) {
      return false
    }
  }

  return true
}
const Interface = {
  Wan: 'Wan',
  Lan: 'Lan',
  Both: 'Both',
}
const Application = {
  ALL: 'ALL',
  PING: 'PING',
  FTP: 'FTP',
  WEB: 'WEB',
  TELNET: 'TELNET',
  SNMP: 'SNMP',
}
const maxAclRuleNum = 17 // 16 items configured by the user plus 1 item configured by the underlying default configuration
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
      modalForm: {
        id: '',
        enable: true,
        aclRuleName: '',
        scrIPAddrBegin: '',
        scrIPAddrEnd: '',
        // interface: Interface.Wan,
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
        ],
        scrIPAddrBegin: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => value == '0.0.0.0' || isPrivateIP(value),
            message: this.$t('trans0168'),
          },
        ],
        scrIPAddrEnd: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => value == '0.0.0.0' || isPrivateIP(value),
            message: this.$t('trans0169'),
          },
          {
            rule: () => this.validateIpAddr(),
            message: this.$t('trans0170'),
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
        /*{
                    value: Interface.Both,
                    text: this.$t('trans0157'),
                  },*/
      ],
      applicationList: [
        {
          value: Application.ALL,
          text: this.$t('trans0158'),
        },
        {
          value: Application.PING,
          text: this.$t('trans0159'),
        },
        // {
        //   value: Application.FTP,
        //   text: this.$t('trans0160'),
        // },
        {
          value: Application.WEB,
          text: this.$t('trans0161'),
        },
        {
          value: Application.TELNET,
          text: this.$t('trans0162'),
        },
        // {
        //   value: Application.SNMP,
        //   text: this.$t('trans0163'),
        // },
      ],
      columns: [
        {
          key: 'aclRuleName',
          title: this.$t('trans0150'),
          width: 180,
        },
        {
          key: 'scrIPAddrBegin',
          title: this.$t('trans0151'),
        },
        {
          key: 'scrIPAddrEnd',
          title: this.$t('trans0152'),
        },
        // {
        //   key: 'interface',
        //   title: this.$t('trans0153'),
        // },
        {
          key: 'application',
          title: this.$t('trans0154'),
        },
        {
          key: 'Active',
          title: this.$t('trans0166'),
          width: '60',
        },
      ],
      data: [],
      indexList: [],
    }
  },
  computed: {
    isShowAddBtn() {
      return this.data.length < maxAclRuleNum
    },
    isShowDelBtn() {
      return this.indexList.length > 0
    },
    isAdd() {
      return this.modalType === ModalType.add
    },
    modalTitle() {
      return this.isAdd ? this.$t('trans0164') : this.$t('trans0165')
    },
  },
  watch: {
    indexList: function (val) {
      this.form.delnum = this.indexList.length ? `${this.indexList.toString()},` : ''
    },
  },
  methods: {
    changeIPAddrBegin() {
      if (this.$refs.scrIPAddrEnd && this.modalForm.scrIPAddrEnd) {
        this.$refs.scrIPAddrEnd.extraValidate(this.validateIpAddr, this.$t('trans0170'))
      }
    },
    validateIpAddr() {
      if (this.modalForm.scrIPAddrBegin) {
        return cmpIpAddress(this.modalForm.scrIPAddrEnd, this.modalForm.scrIPAddrBegin)
      }
      return true
    },
    switchEnable(val) {
      // todo
    },
    openAddModal() {
      this.modalForm.enable = true
      this.modalForm.aclRuleName = ''
      this.modalForm.scrIPAddrBegin = ''
      this.modalForm.scrIPAddrEnd = ''
      // this.modalForm.interface = Interface.Wan;
      this.modalForm.application = Application.ALL
      this.modalType = ModalType.add
      this.visible = true
    },
    setEditModal(row) {
      this.modalForm.enable = row.Active
      this.modalForm.aclRuleName = row.aclRuleName
      this.modalForm.scrIPAddrBegin = row.scrIPAddrBegin
      this.modalForm.scrIPAddrEnd = row.scrIPAddrEnd
      // this.modalForm.interface = row.interface;
      this.modalForm.application = row.application
      this.modalType = ModalType.edit
    },
    openEditModal(row) {
      this.setEditModal(row)
      this.visible = true
    },
    toggleStatus(row) {
      this.setEditModal(row)
      this.modalForm.enable = !row.Active
      this.save()
    },
    save() {
      if (this.$refs.modalForm.validate()) {
        // todo
      }
    },
    del() {
      // todo
    },
    select(list) {
      this.indexList = list.map((item) => item.Index)
    },
  },
  created() {
    // this.form.enable = Common_Activate === 'Yes'
    // const res = JSON.parse(aclListStr)
    // const data = []
    // res.data.forEach((item) => {
    //   if (item.Index != -1) {
    //     data.push({
    //       Index: item.Index,
    //       aclRuleName: item.ACLName,
    //       scrIPAddrBegin: item.ScrIPAddrBegin,
    //       scrIPAddrEnd: item.ScrIPAddrEnd,
    //       // interface: item.Interface,
    //       application: item.Application,
    //       status: item.Active == 'Yes' ? this.$t('trans0103') : this.$t('trans0054'),
    //       Active: item.Active,
    //     })
    //   }
    // })
    // this.data = data
  },
}
</script>
