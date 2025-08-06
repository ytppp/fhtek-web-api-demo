<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0131') }}</h1>
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
          <template #active="scope">
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
          <fh-form-item :label="$t('trans0150')" prop="name">
            <fh-input name="AclRuleName" v-model="modalForm.name"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0136')" prop="srcIp">
            <fh-input
              name="ScrIPAddrBegin"
              v-model="modalForm.srcIp"
              @blur="changeIPAddrBegin"
              :placeholder="placeholderTips"
            ></fh-input>
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
} from '@/util/tool'
import { ModalType } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'
import { getIpv4Filter, addIpv4Filter, editIpv4Filter, delIpv4Filter } from '@/http/api'

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
const Protocol = {
  all: 'tcp/udp/icmp/igmp',
  tcp: 'tcp',
  udp: 'udp',
  icmp: 'icmp',
  igmp: 'igmp',
}
const maxAclRuleNum = 16
export default {
  name: 'Ipv4FilterPage',
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
        name: '',
        proto: Protocol.all,
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
      protoList: [
        {
          value: Protocol.ALL,
          text: this.$t('trans0158'),
        },
        {
          value: Protocol.tcp,
          text: this.$t('trans0190'),
        },
        {
          value: Protocol.udp,
          text: this.$t('trans0191'),
        },
        {
          value: Protocol.icmp,
          text: this.$t('trans0192'),
        },
        {
          value: Protocol.igmp,
          text: this.$t('trans0375'),
        },
      ],
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
        {
          key: 'proto',
          title: this.$t('trans0135'),
        },
        {
          key: 'activeAlias',
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
    modalTitle() {
      return this.isAdd ? this.$t('trans0164') : this.$t('trans0165')
    },
    placeholderTips() {
      return `${this.$t('trans0598').format(this.$t('trans0456'))}/${this.$t('trans0459')}`
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
      this.modalForm.name = ''
      this.modalForm.proto = Protocol.WEB
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.index = row.index
      this.modalForm.id = row.id
      this.modalForm.srcIp = row.srcIp
      this.modalForm.enable = row.enabled
      this.modalForm.name = row.name
      this.modalForm.proto = row.proto
      this.modalType = ModalType.edit
      this.visible = true
    },
    toggleStatus(row) {
      editIpv4Filter([
        {
          id: row.id,
          enabled: convertBooleanStatus(row.enabled),
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
        src_ip: this.modalForm.srcIp,
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
    getIpv4FilterData() {
      getIpv4Filter().then(({ data }) => {
        const { items } = data
        const tableData = []
        items.forEach((item, i) => {
          tableData.push({
            ...item,
            srcIp: item.src_ip,
            activeAlias: convertBooleanStatus(item.enabled)
              ? this.$t('trans0103')
              : this.$t('trans0054'),
            index: i,
          })
        })
        this.data = tableData
      })
    },
  },
  created() {
    this.getIpv4FilterData()
  },
}
</script>
