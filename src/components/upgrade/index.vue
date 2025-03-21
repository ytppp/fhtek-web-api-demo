<template>
  <div class="upgrade">
    <img v-if="url" class="upgrade__img" :src="url" alt="" />
    <div v-if="title" class="upgrade__title">{{ title }}</div>
    <div v-if="tip" class="upgrade__tip" v-html="tip"></div>
    <!-- 升级进度条 -->
    <div class="progress" v-if="progressVisible">
      <div class="progress__main">
        <div class="progress__bar" :style="styles">
          <span class="progress__text">{{ percentText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, computed, defineComponent, onMounted } from 'vue'
import { useCountDown } from '@/hooks/countdown'
import { getUpgradeStatus } from '@/http/api'
import { router } from '@/router/index'

export default defineComponent({
  name: 'FhUpgrade',
  props: {
    url: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    tip: {
      type: String,
      default: '',
    },
    timeout: {
      type: Number,
      default: 120,
    },
    progressVisible: {
      type: Boolean,
      default: false,
    },
    hideHandle: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const average = 100 / props.timeout
    const reqFreq = 5
    const percent = ref(0)
    const styles = reactive({
      width: 0,
    })
    const percentText = computed(() => `${parseInt(percent.value)}%`)
    const doingHandle = (countdown: number) => {
      percent.value = Math.min(100, percent.value + average)
      styles.width = `${percent.value}%`
      if (!(countdown % reqFreq)) {
        getUpgradeStatus().then(({ data }) => {
          const { upgradestatus } = data
          if (upgradestatus === 0) {
            cleanCountDown()
          }
        })
      }
    }
    const doneHandle = () => {
      if (props.hideHandle) {
        router.push('/login')
        props.hideHandle()
      }
    }
    const { createCountDown, cleanCountDown } = useCountDown(props.timeout, doingHandle, doneHandle)
    onMounted(() => {
      createCountDown()
    })
    return {
      percentText,
      styles,
    }
  },
})
</script>
