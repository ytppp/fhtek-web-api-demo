<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0254') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0254')" label-position="left">
          <fh-switch
            @change="switchEnable"
            :active-value="EnableStatus.yes"
            :inactive-value="EnableStatus.no"
            v-model="form.enable"
          />
        </fh-form-item>
        <template v-if="isEnabled">
          <fh-form-item :label="$t('trans0702')">
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
import { EnableStatus } from '@/util/constant'
import { isIP, getIpBefore, isNetworkIP, isBoardcastIP, isMulticast, isLoopback } from '@/util/tool'
import { getDmz, setDmz, getLan, getWanList } from '@/http/api'

export default {
  name: 'DmzPage',
  data() {
    return {
      EnableStatus,
      lanIp: '',
      form: {
        wan: '',
        enable: EnableStatus.no,
        ip: '',
      },
      formEnable: EnableStatus.no,
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
  computed: {
    isEnabled() {
      return this.form.enable === EnableStatus.yes
    },
    isInitEnabled() {
      return this.formEnable === EnableStatus.yes
    },
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        setDmz({
          wan: this.form.ip,
          enable: this.form.mask,
          ip: this.form.ip,
        })
      }
    },
    switchEnable() {
      if (this.isInitEnabled) {
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
          enable,
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
