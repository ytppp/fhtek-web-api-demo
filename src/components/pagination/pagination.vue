<template>
  <div class="pagination" :class="{ 'pagination--disabled': disabled }" v-if="pages > 1">
    <div class="pagination__total" v-if="slots.total || showTotal">
      <slot name="total" v-if="slots.total"></slot>
      <template v-else-if="showTotal && total">
        {{ totalText }}
      </template>
    </div>
    <span
      @click="prev"
      class="pagination__item"
      :class="{ 'pagination__item--disabled': currentPage === 1 }"
      ><fh-icon name="icon-left"
    /></span>
    <span
      class="pagination__item"
      :class="{ 'pagination__item--active': val === currentPage }"
      v-for="val in list"
      :key="val"
      @click="jump(val)"
    >
      <template v-if="val !== ellipsis">{{ val }}</template>
      <fh-icon name="icon-ellipsis" v-else />
    </span>
    <span
      @click="next"
      class="pagination__item"
      :class="{ 'pagination__item--disabled': currentPage === pages }"
      ><fh-icon name="icon-right"
    /></span>
    <!-- <fh-select></fh-select> -->
    <!-- <div class="pagination__jump"></div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'FhPagination',
})

const { t } = useI18n()
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  defaultPageSize: {
    type: Number,
    default: 10,
  },
  defaultCurrent: {
    type: Number,
    default: 1,
  },
  showTotal: {
    type: Boolean,
    default: true,
  },
  showSizeChanger: {
    type: Boolean,
    default: true,
  },
  showQuickJumper: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()
const ellipsis = 'ellipsis'
const currentPage = ref(props.defaultCurrent || 1)
const currentPageSize = ref(props.defaultPageSize || 10)
const pages = computed(() => Math.ceil(props.total / currentPageSize.value))

const totalText = computed(() => {
  return t('trans0858').format(props.total)
})
const list = computed(() => {
  const result = []
  if (pages.value < 7) {
    for (let i = 1; i <= pages.value; i++) {
      result.push(i)
    }
  } else {
    if (currentPage.value < 5) {
      for (let i = 1; i <= 5; i++) {
        result.push(i)
      }
      result.push(ellipsis)
      result.push(pages.value)
    } else if (currentPage.value > pages.value - 5) {
      result.push(1)
      result.push(ellipsis)
      for (let i = pages.value - 4; i <= pages.value; i++) {
        result.push(i)
      }
    } else {
      result.push(1)
      result.push(ellipsis)
      for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
        result.push(i)
      }
      result.push(ellipsis)
      result.push(pages.value)
    }
  }
  return result
})

const emit = defineEmits(['change'])
watchEffect(() => {
  emit('change', currentPage.value, currentPageSize.value)
})

const prev = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
const next = () => {
  if (currentPage.value < pages.value) {
    currentPage.value++
  }
}
const jump = (val: number | string) => {
  if (val !== ellipsis) {
    currentPage.value = val as number
  }
}
</script>

<style lang="less">
.pagination {
  display: flex;
  align-items: center;
  &.pagination--disabled {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
  }
  .pagination__item {
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 4px;
    width: 25px;
    height: 25px;
    border-radius: 4px;
    border: 1px solid transparent;
    &:hover {
      &:not(.pagination__item--active, .pagination__item--disabled) {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    &.pagination__item--active {
      border-color: @primaryColor;
    }
    &.pagination__item--disabled {
      cursor: not-allowed;
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
