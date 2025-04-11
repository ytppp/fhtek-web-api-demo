<template>
  <div class="time-picker" @click="open" v-clickoutside="closeStatusOpened">
    <fh-input
      readonly
      :disabled="selectDisabled"
      :placeholder="selectPlaceholder"
      :label="currentLabel"
      v-model="value"
      :name="name"
    >
      <template v-slot:prefix v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template v-slot:suffix>
        <fh-icon
          :class="['time-picker__caret', 'input__icon', this.opened ? 'is-reverse' : '']"
          name="icon-down"
        ></fh-icon>
      </template>
    </fh-input>
    <transition name="select">
      <div class="time-picker__popup" ref="combo" v-show="opened">
        <div class="time-picker__popup-wrap">
          <ul class="time-picker__popup-list" ref="h">
            <li
              class="time-picker__popup-item"
              v-for="(v, i) in hs"
              :key="i"
              @click.stop="(e) => select('h', v, e)"
              :class="{ selected: time.h === v }"
            >
              {{ v }}
            </li>
          </ul>
          <ul class="time-picker__popup-list" ref="m">
            <li
              class="time-picker__popup-item"
              v-for="(v, i) in ms"
              :key="i"
              @click.stop="(e) => select('m', v, e)"
              :class="{ selected: time.m === v }"
            >
              {{ v }}
            </li>
          </ul>
        </div>
        <div class="time-picker__button-wrap">
          <fh-button type="text" @click.stop="close">{{ $t('trans0020') }}</fh-button>
          <fh-button type="text" @click.stop="ok">{{ $t('trans0019') }}</fh-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FhTimePicker',
  inject: {
    form: {
      default: '',
    },
    formItem: {
      default: '',
    },
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: String,
    placeholder: String,
    label: String,
  },
  data() {
    return {
      opened: false,
      hs: Array.from(new Array(24)).map((__, v) => this.formatCount(v)),
      ms: Array.from(new Array(60)).map((__, v) => this.formatCount(v)),
      time: {
        h: '',
        m: '',
      },
      distance: 0,
      animationTime: 200,
      animationEl: null,
      oldValue: '',
    }
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit('update:modelValue', v)
      },
    },
    iconClass() {
      return this.opened ? 'is-reverse' : ''
    },
    currentLabel() {
      return this.label || this.$parent.label || ''
    },
    selectPlaceholder() {
      return typeof this.placeholder !== 'undefined' ? this.placeholder : this.$t('trans0001')
    },
    selectDisabled() {
      return this.disabled || this.form?.disabled.value
    },
  },
  emits: ['input', 'update:modelValue'],
  methods: {
    formatCount(v) {
      return `0${v}`.slice(-2)
    },
    scrollTo(el, x, y) {
      if (el.scrollTo) {
        el.scrollTo(x, y)
      } else {
        el.scrollTop = y
      }
    },
    ok() {
      if (this.time.h && this.time.m) {
        this.$emit('input', this.value)
      }
      this.opened = false
    },
    open() {
      if (!this.opened) {
        this.opened = true
        this.oldValue = this.value
        this.time = {
          h: this.value ? this.value.split(':')[0] : '',
          m: this.value ? this.value.split(':')[1] : '',
        }
        this.$nextTick(() => {
          const hEl = this.$refs.h
          const mEl = this.$refs.m
          this.initScroll(hEl)
          this.initScroll(mEl)
        })
      }
    },
    closeStatusOpened() {
      this.opened = false
    },
    close() {
      if (!this.opened) {
        return
      }
      this.value = this.oldValue
      this.opened = false
    },
    initScroll(el) {
      const sEl = el.querySelector('.selected')
      if (sEl) {
        const cTop = sEl.offsetTop
        this.scrollTo(el, 0, cTop)
      }
    },
    animateScroll() {
      if (this.animationEl.scrollTop >= this.distance) {
        cancelAnimationFrame(this.animationId)
        return
      }
      let scroll = this.animationEl.scrollTop + 5
      scroll = scroll > this.distance ? this.distance : scroll
      this.scrollTo(this.animationEl, 0, scroll)
      this.animationId = requestAnimationFrame(this.animateScroll)
    },
    selectScroll(e, p) {
      const pEl = this.$refs[p]
      const sEl = e.currentTarget
      this.distance = sEl.offsetTop
      this.animationEl = pEl
      this.animateScroll()
    },
    select(type, v, e) {
      this.time[type] = v
      this.value = `${this.time.h}:${this.time.m}`
      if (this.time.h && this.time.m) {
        this.$emit('input', this.value)
      }
    },
  },
})
</script>
