<template>
  <div
    class="cascader"
    :class="{ 'is-disabled': cascaderDisabled }"
    @click="open"
    v-clickoutside="close"
    ref="cascaderRef"
  >
    <div class="cascader__input" ref="cascaderInputRef">
      <fh-input
        readonly
        :disabled="cascaderDisabled"
        :not-disabled="notDisabled"
        :placeholder="cascaderPlaceholder"
        :label="currentLabel"
        :is-select-comp-child-node="true"
        v-model="model"
        @blur="inputBlurHandler"
        @focus="inputFocusHandler"
      >
        <template v-slot:prefix v-if="slots.prefix">
          <slot name="prefix"></slot>
        </template>
        <template #suffix>
          <fh-icon
            :class="['cascader__caret', 'input__icon', opened ? 'is-reverse' : '']"
            name="icon-down"
            @click="stopPropagation"
          ></fh-icon>
        </template>
      </fh-input>
    </div>
    <transition name="cascader">
      <ul class="cascader__popup" ref="cascaderPopupRef" v-show="opened">
        <template v-if="list.length">
          <cascader-item
            v-for="item in list"
            :key="item.value"
            :option="item"
            :selected="model"
            @toggle="toggleItem"
            @select="selectItem"
          ></cascader-item>
        </template>
        <li class="cascader__popup-item--empty" v-else>{{ $t('trans0142') }}</li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import {
  computed,
  inject,
  watch,
  nextTick,
  reactive,
  ref,
  onMounted,
  useSlots,
  useTemplateRef,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { scrollTo, findUniqueNode } from '@/util/tool'
import { computePosition, flip, shift, offset } from '@floating-ui/vue'
import { useDataClean } from '@/hooks/data-clean'
import CascaderItem from './cascader-item.vue'

defineOptions({
  name: 'FhCascader',
})

const form = inject('form', null)
const formItem = inject('formItem', null)
const { convertBooleanStatus } = useDataClean()
const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  height: {
    type: Number,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  name: String,
  placeholder: String,
  label: String,
  beforeChange: {
    type: Function,
    default: () => ({}),
  },
  notDisabled: {
    type: Boolean,
    default: false,
  },
  request: {
    type: Function,
    default: () => ({}),
  },
})
const model = defineModel({
  required: true,
})
const emit = defineEmits(['focus', 'blur', 'change'])

const { t } = useI18n()
const slots = useSlots()
const list = ref([])
const opened = ref(false)
const cascaderRef = useTemplateRef('cascaderRef')
const cascaderInputRef = useTemplateRef('cascaderInputRef')
const cascaderPopupRef = useTemplateRef('cascaderPopupRef')

const currentLabel = computed(() => {
  return props.label || formItem?.label.value || ''
})
const cascaderPlaceholder = computed(() => {
  return typeof props.placeholder !== 'undefined' ? props.placeholder : t('trans0001')
})
const cascaderDisabled = computed(() => {
  if (props.notDisabled) return false
  return props.disabled || form?.disabled.value
})

watch(opened, (val) => {
  if (val) {
    formItem?.clearValidate()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)
  } else {
    formItem?.validate()
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition)
  }
})
watch(
  () => props.options,
  () => {
    list.value = props.options
  },
  {
    deep: true,
  },
)
const stopPropagation = (event) => {
  if (cascaderDisabled.value) event.stopPropagation()
}
const updatePosition = () => {
  const { width } = cascaderInputRef.value.getBoundingClientRect()
  computePosition(cascaderInputRef.value, cascaderPopupRef.value, {
    placement: 'bottom-start',
    middleware: [flip(), shift(), offset(6)],
  }).then(({ x, y }) => {
    Object.assign(cascaderPopupRef.value.style, {
      width: `${width}px`,
      left: `${x}px`,
      top: `${y}px`,
    })
  })
}
const open = () => {
  if (!props.disabled) {
    opened.value = !opened.value
    if (opened.value) {
      updatePosition()
    }
  }
}
const close = () => {
  opened.value = false
}
const inputBlurHandler = () => {
  emit('blur')
}
const inputFocusHandler = () => {
  emit('focus')
}
const cleanData = (data, name = '') => {
  const thisItem = findUniqueNode(list.value, name, 'path')
  data.forEach((item) => {
    item.level = !thisItem ? 0 : thisItem.level + 1
    item.loading = false
    item.isSonDict = convertBooleanStatus(item.hasSonDict)
    item.isCollapsed = item.isSonDict ? true : false
    item.value = item.path
    item.text = item.name
  })
  if (!name) {
    list.value = data
  } else {
    thisItem.children = data
  }
}
const getItemsData = (name = '') => {
  if (!props.request) {
    cleanData(props.options, name)
    return
  }
  return props.request({ name }).then(({ data }) => {
    const { items } = data
    cleanData(items, name)
  })
}
const toggleItem = (option) => {
  if (option.isSonDict) {
    if (option.children?.length) {
      option.isCollapsed = !option.isCollapsed
    } else {
      option.loading = true
      getItemsData(option.value).then(() => {
        option.isCollapsed = false
        option.loading = false
      })
    }
  }
}
const selectItem = (option) => {
  if (model.value === option.value) return
  model.value = option.value
  emit('change', option.value)
  close()
}
onMounted(() => {
  getItemsData()
})
</script>

<style lang="less">
.cascader {
  width: 100%;
  &.is-disabled {
    .input {
      .input__inner {
        cursor: not-allowed;
      }
    }
  }
  .cascader__caret {
    transition: transform 0.2s linear;
    &.is-reverse {
      transform: rotate(180deg);
    }
  }
  .input {
    width: 100%;
    .input__inner {
      cursor: pointer;
    }
  }
  .cascader__popup {
    position: absolute;
    z-index: 2000;
    top: 0;
    left: 0;
    font-size: 14px;
    max-height: 238px;
    background: @select-popup-background-color;
    border-radius: 5px;
    border: 1px solid @select-popup-border-color;
    overflow: auto;
  }
  .cascader__popup-item--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 84px;
    font-size: 14px;
    background-color: #fff;
    color: #999;
  }
}
.cascader-enter-active,
.cascader-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition:
    transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
    opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}
.cascader-enter,
.cascader-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
</style>
