<template>
  <div v-bind="$attrs" class="display-form" :class="{ 'display-form-has-border': border }">
    <template v-for="(item, index) in data" :key="index">
      <div class="display-form__item">
        <div class="display-form__label">{{ item.label }}{{ colonText }}</div>
        <div class="display-form__value">{{ item.value }}</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'FhDescriptions',
})

interface IDescriptionsProps {
  border?: boolean
  data: {
    [key: string]: {
      label: string
      value: string
      show?: boolean
    }
  }
  colon?: boolean
}

const { t } = useI18n()
const { border = false, colon = true } = defineProps<IDescriptionsProps>()

const hasColon = computed(() => {
  if (border) return false
  return colon
})
const colonText = computed(() => {
  return hasColon.value ? t('trans0182') : ''
})
</script>

<style lang="less">
.display-form {
  font-size: 16px;
  margin: 20px 0;
  @media screen and (max-width: 768px) {
    padding: 10px;
  }
  .display-form__item {
    display: flex;
    font-weight: 200;
    + .display-form__item {
      margin-top: 10px;
      @media screen and (max-width: 768px) {
        margin-top: 15px;
      }
    }
  }
  .display-form__label {
    width: 230px;
    text-align: right;
    padding-right: 30px;
    flex-shrink: 0;
    @media screen and (max-width: 768px) {
      width: 120px;
      padding-right: 20px;
    }
  }
  .display-form__value {
    width: 100%;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .display-form__empty {
    width: 350px;
    padding: 20px;
  }
  &.display-form-has-border {
    @media screen and (max-width: 768px) {
      padding: 0;
    }
    .display-form__item {
      + .display-form__item {
        margin-top: 0;
        .display-form__label,
        .display-form__value {
          border-top: none;
        }
        @media screen and (max-width: 768px) {
          margin-top: 0;
        }
      }
    }
    .display-form__label,
    .display-form__value {
      padding-top: 12px;
      padding-bottom: 12px;
      border: 1px solid #c9c9c9;
    }
    .display-form__label {
      border-right: none;
    }
    .display-form__value {
      padding-left: 20px;
    }
  }
}
</style>
