<template>
  <div class="select" @click="open" v-clickoutside="close" ref="selectRef">
    <fh-input
      readonly
      :disabled="selectDisabled"
      :placeholder="selectPlaceholder"
      :label="currentLabel"
      v-model="selected.text"
      @blur="inputBlurHandler"
      @focus="inputFocusHandler"
    >
      <template v-slot:prefix v-if="slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template #suffix>
        <fh-icon
          :class="['select__caret', 'input__icon', opened ? 'is-reverse' : '']"
          name="icon-down"
        ></fh-icon>
      </template>
    </fh-input>
    <transition name="select">
      <ul class="select__popup" v-show="opened">
        <template v-if="options.length">
          <!-- selected === option -->
          <li
            class="select__popup-item"
            :class="{
              'is-selected': selected.value === option.value && selected.text === option.text,
            }"
            :key="option.value"
            @click.stop="select(option)"
            v-for="option in options"
          >
            <div
              v-if="option.render && typeof option.render === 'function'"
              v-html="option.render()"
            ></div>
            <span v-else>{{ option.text }}</span>
          </li>
        </template>
        <li class="select__popup-item--empty" v-else>{{ $t('trans0142') }}</li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { computed, inject, watch, nextTick, reactive, ref, onMounted, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'
import { scrollTo } from '@/util/tool'

defineOptions({
  name: 'FhSelect',
})

const form = inject('form', {})
const formItem = inject('formItem', {})

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
})
const model = defineModel({
  required: true,
})
const emit = defineEmits(['focus', 'blur', 'change', 'input'])

const { t } = useI18n()
const slots = useSlots()
const selected = reactive({
  value: '',
  text: '',
})
const opened = ref(false)
const selectRef = ref(null)

const currentLabel = computed(() => {
  return props.label || formItem.label.value || ''
})
const selectPlaceholder = computed(() => {
  return typeof props.placeholder !== 'undefined' ? props.placeholder : t('trans0001')
})
const selectDisabled = computed(() => {
  return props.disabled || form?.disabled.value
})

const setSelected = () => {
  const option = props.options.filter((o) => o.value === model.value)[0] || {
    text: model.value,
  }
  // selected = option
  selected.value = option.value
  selected.text = option.text
}
const scrollToSelect = () => {
  nextTick(() => {
    const popupEl = selectRef.value.querySelector('.select__popup')
    const selectEl = popupEl.querySelector('li.is-selected')
    if (selectEl) {
      const popupHeight = popupEl.clientHeight
      const elHeight = selectEl.clientHeight
      // 滚动到正中间的位置
      scrollTo(popupEl, 0, selectEl.offsetTop - popupHeight / 2 + elHeight / 2)
    }
  })
}
const select = (option) => {
  // selected = option
  selected.value = option.value
  selected.text = option.text
  opened.value = false
  emit('input', selected.value)
  if (model.value !== selected.value) {
    change()
  }
}
const change = () => {
  model.value = selected.value
  emit('change', model.value)
}
const open = () => {
  if (!props.disabled) {
    opened.value = !opened.value
    if (opened.value) {
      scrollToSelect()
    }
  }
}
const close = () => {
  opened.value = false
}
const inputBlurHandler = () => {
  setTimeout(() => {
    emit('blur')
  }, 100)
}
const inputFocusHandler = () => {
  emit('focus')
}

watch(
  () => model.value,
  () => setSelected(),
)
watch(
  () => props.options,
  () => setSelected(),
)

onMounted(() => {
  setSelected()
})
</script>

<style lang="less">
.select-enter-active,
.select-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition:
    transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
    opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}
.select-enter,
.select-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
</style>
