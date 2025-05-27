<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0245') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table :columns="columns" :data-source="data" :show-row-checkbox="false">
          <template #operationgroup>
            <fh-button size="small" v-if="isShowAddBtn" @click="openAddModal">{{
              $t('trans0164')
            }}</fh-button>
          </template>
          <template #enable="scope">
            <fh-switch v-model="scope.row.enable" @change="toggleStatus(scope.row)" />
          </template>
          <template #operation="scope">
            <fh-button type="text" @click="openEditModal(scope.row)">{{
              $t('trans0165')
            }}</fh-button>
            <fh-button type="text" @click="del">{{ $t('trans0111') }}</fh-button>
          </template>
        </fh-table>
      </div>
    </div>
    <fh-modal v-model:visible="visible" :title="modalTitle">
      <template #body>
        <fh-form class="form modal-form" ref="modalForm" :model="modalForm" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0166')" label-position="left">
            <fh-switch v-model="modalForm.enable" />
          </fh-form-item>
          <fh-form-item :label="$t('trans0140')">
            <fh-select v-model="modalForm.interface" :options="wanList"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0255')">
            <fh-select v-model="modalForm.server" :options="serverList"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0256')" prop="domain">
            <fh-input v-model="modalForm.domain"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0053')" prop="username">
            <fh-input v-model="modalForm.username"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0196')" prop="password">
            <fh-input v-model="modalForm.password" type="password" show-password></fh-input>
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
import { ModalType } from '@/util/constant'

const maxRuleNum = 1
const servers = [
  'www.no-ip.com',
  'www.dyndns.org',
  'www.justlinux.com',
  'www.dhs.org',
  'www.ods.org',
  'www.gnudip.cheapnet.net',
  'www.tzo.com',
  'www.easydns.com',
]
const serverList = servers.map((val) => ({
  value: val,
  text: val,
}))

export default {
  data() {
    return {
      maxRuleNum,
      modalType: ModalType.add,
      visible: false,
      modalForm: {
        enable: true,
        server: servers[0],
        domain: '',
        username: '',
        password: '',
        interface: '',
      },
      wanList: [],
      modalFormRules: {
        domain: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
        ],
        username: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
        ],
        password: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
        ],
      },
      serverList: serverList,
      columns: [
        {
          key: 'server',
          title: this.$t('trans0257'),
        },
        {
          key: 'domain',
          title: this.$t('trans0256'),
        },
        {
          key: 'username',
          title: this.$t('trans0053'),
        },
        {
          key: 'Active',
          title: this.$t('trans0166'),
          width: '60',
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
    modalTitle() {
      return this.isAdd ? this.$t('trans0164') : this.$t('trans0165')
    },
  },
  methods: {
    openAddModal() {
      this.modalForm.enable = true
      this.modalForm.interface = ''
      this.modalForm.domain = ''
      this.modalForm.username = ''
      this.modalForm.password = ''
      this.modalForm.server = servers[0]
      this.modalType = ModalType.add
      this.visible = true
    },
    openEditModal(row) {
      this.modalForm.enable = row.Active
      this.modalForm.interface = row.interface
      this.modalForm.domain = row.domain
      this.modalForm.username = row.username
      this.modalForm.password = row.password
      this.modalForm.server = row.server
      this.modalType = ModalType.edit
      this.visible = true
    },
    toggleStatus(row) {
      this.modalForm.enable = row.Active === EnableStatus.yes ? EnableStatus.no : EnableStatus.yes
      // todo
    },
    save() {
      if (this.$refs.modalForm.validate()) {
        // todo
      }
    },
    del() {
      // todo
    },
    getDdnsList() {
      const data = []
      // res.data.forEach((item) => {
      //   const flag = this.isObjExistVal(item, this.undefinedFlag)
      //   if (!flag) {
      //     data.push(item)
      //   }
      // })
      this.data = data
    },
    getWanList() {
      // todo
    },
  },
  created() {
    this.getDdnsList()
  },
}
</script>
