<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0254') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0254')">
          <fh-switch @change="switchEnable" v-model="form.enable" />
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0155')">
            <fh-select v-model="form.wan" :options="wanList"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0642')" prop="ip">
            <fh-input v-model="form.ip" />
          </fh-form-item>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="save" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </template>
      </fh-form>
    </div>
  </div>
</template>

<script>
import { isIP, getIpBefore, isNetworkIP, isBoardcastIP, isMulticast, isLoopback } from '@/util/tool'
import { getDmz, setDmz, getLan, getWanList } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

const { convertBooleanStatus } = useDataClean()
export default {
  name: 'DmzPage',
  data() {
    return {
      lanIp: '',
      form: {
        wan: '',
        enable: false,
        ip: '',
      },
      formEnable: false,
      mask: '255.255.255.0',
      rules: {
        ip: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
            message: this.$t('trans0397'),
          },
          {
            rule: (value) => !isNetworkIP(value, this.mask),
            message: this.$t('trans0397'),
          },
          {
            rule: (value) => !isBoardcastIP(value, this.mask),
            message: this.$t('trans0397'),
          },
          {
            rule: (value) => {
              if (!this.lanIp) {
                return true
              }
              const lanIpBefore = getIpBefore(this.lanIp)
              const ipBefore = getIpBefore(value)
              if (ipBefore !== lanIpBefore || this.lanIp === value) {
                return false
              }
              return true
            },
            message: this.$t('trans0397'),
          },
        ],
      },
      wanList: [],
    }
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        setDmz({
          wan: this.form.ip,
          enable: convertBooleanStatus(this.form.enable),
          ip: this.form.ip,
        })
      }
    },
    switchEnable() {
      if (this.formEnable) {
        this.save()
      }
    },
    getLanData() {
      getLan().then(({ data }) => {
        this.lanIp = data.lan.ip
      })
    },
    getDmzData() {
      getDmz().then(({ data }) => {
        const { wan, enable, ip } = data
        this.form = {
          wan,
          enable: convertBooleanStatus(enable),
          ip,
        }
        this.formEnable = this.form.enable
      })
    },
    getWanListData() {
      getWanList().then(({ data }) => {
        const wanList = []
        data.map((item) => {
          wanList.push({
            value: item.name,
            text: item.name,
          })
        })
        this.wanList = wanList
      })
    },
  },
  mounted() {
    this.getLanData()
    this.getWanListData()
    this.getDmzData()
  },
}
</script>
