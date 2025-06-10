<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0058') }}</h1>
    </div>
    <div class="page__content page__content--padding-small">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0132') }}</h2>
      </div>
      <fh-form class="form form--padding" ref="form" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0058')" label-position="left">
          <fh-switch v-model="form.enable" @change="switchEnable"></fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0104')">
          <fh-radio-group v-model="form.mode" @change="changeFilterMode">
            <fh-radio v-for="mode in filteringModes" :key="mode.value" :label="mode.value">
              {{ mode.text }}
            </fh-radio>
          </fh-radio-group>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0132') }}</h2>
      </div>
      <div class="page__table page__table--padding">
        <fh-table :columns="columns" :data-source="urlList" :show-row-checkbox="false">
          <template #operationgroup>
            <fh-button size="small" v-if="isShowAddBtn" @click="openAddModal">
              {{ $t('trans0164') }}
            </fh-button>
          </template>
          <template #operation="scope">
            <fh-button type="text" @click="openEditModal(scope.row)">
              {{ $t('trans0165') }}
            </fh-button>
            <fh-button type="text" @click="del">{{ $t('trans0111') }}</fh-button>
          </template>
        </fh-table>
      </div>
      <fh-modal v-model:visible="visible" :title="modalTitle" :before-close="handleClose">
        <template #body>
          <fh-form class="form modal-form" ref="form" :model="modelForm" :rules="rules">
            <fh-form-item :label="$t('trans0110')" prop="url">
              <fh-input v-model="modelForm.url"> </fh-input>
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
  </div>
</template>

<script>
const FilteringModes = {
  blackList: '0',
  whiteList: '1',
}
export default {
  name: 'UrlFilterPage',
  data() {
    return {
      form: {
        enable: false,
        mode: FilteringModes.blackList,
      },
      modelForm: {
        url: '',
      },
      columns: [
        {
          key: 'URL',
          title: this.$t('trans0110'),
        },
      ],
      url_list: [],
      rules: {
        url: [
          {
            rule: (value) => {
              if (!value) return true
              const len = getStringByte(value)
              return len <= 31 && len >= 3
            },
            message: this.$t('trans0127').format(this.$t('trans0110'), 3, 31),
          },
          {
            rule: (value) => {
              if (!value) return true
              return isValidUrlName(value)
            },
            message: this.$t('trans0128').format(this.$t('trans0110')),
          },
          {
            rule: (value) => {
              if (!value) return true
              return (value) => !this.url_list.some((item) => item['URL'] == value)
            },
            message: this.$t('trans0129'),
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
  },
  methods: {
    switchEnable(val) {
      const message = val ? this.$t('trans0123') : this.$t('trans0124')
      this.$dialog
        .confirm({
          okText: this.$t('trans0019'),
          cancelText: this.$t('trans0020'),
          message,
        })
        .then(() => {})
        .catch(() => {
          this.form.enable = !this.form.enable
        })
    },
    changeFilterMode(val) {
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
  },
}
</script>
