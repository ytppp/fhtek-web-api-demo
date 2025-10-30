<template>
  <div class="markdown-preview">
    <aside
      class="markdown-preview__toc toc"
      :class="{ toc__collapsed: isCollapsed }"
      v-if="isShowToc"
    >
      <div class="toc__header">
        <h3>目录</h3>
      </div>
      <nav class="toc__nav">
        <ul class="toc-list" v-if="TocItems.length">
          <li
            v-for="(item, index) in TocItems"
            :key="index"
            :class="['toc-list__item', `toc-list__item-level-${item.level}`]"
          >
            <a
              :href="`#${item.id}`"
              @click.prevent="scrollToAnchor(item.id)"
              :class="{ active: activeAnchor === item.id }"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
        <p class="toc-list__empty" v-else>无目录</p>
      </nav>
      <div class="toc__footer">
        <button
          class="toc__btn-toggle-size"
          @click="isCollapsed = !isCollapsed"
          aria-label="切换目录显示"
        >
          {{ isCollapsed ? '→' : '←' }}
        </button>
      </div>
    </aside>
    <main class="markdown-preview__content">
      <div class="markdown-body" v-html="renderedMarkdown" @click="handleContentClick"></div>
    </main>
    <button
      class="markdown-preview__btn-toggle-display"
      @click="isMobileView = !isMobileView"
      v-if="isMobile"
    >
      {{ isMobileView ? '关闭目录' : '显示目录' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick, withDefaults } from 'vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { useIsMobile } from '@/hooks/is-mobile'
import 'highlight.js/styles/github-dark.css'
import './github-markdown.css'

defineOptions({
  name: 'FhMarkdownPreview',
})

export interface IMarkdownPreviewProps {
  content: string
  showToc?: boolean
}

interface ITocItem {
  id: string
  text: string
  level: number
}

const props = withDefaults(defineProps<IMarkdownPreviewProps>(), {
  content: '',
  showToc: true,
})

const { isMobile } = useIsMobile()
const renderedMarkdown = ref<string>('')
const TocItems = ref<ITocItem[]>([])
const activeAnchor = ref<string>('')
const isCollapsed = ref<boolean>(false)
const isMobileView = ref<boolean>(false)
const marked = new Marked(
  markedHighlight({
    highlight: (code: string, lang?: string) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    },
  }),
)

const isShowToc = computed(() => {
  if (!props.showToc) return false
  if (isMobile.value) {
    return isMobileView.value
  }
  return true
})

const processMarkdown = (md: string): void => {
  if (!md) {
    renderedMarkdown.value = ''
    TocItems.value = []
    return
  }

  const toc: ITocItem[] = []
  let headingIndex = 0

  const renderer = {
    heading({ text, depth }: { text: string; depth: number }): string {
      const id = `heading-${headingIndex++}`
      toc.push({
        id,
        text,
        level: depth,
      })
      return `<h${depth} id="${id}">${text}</h${depth}>`
    },
  }
  marked.use({ renderer })
  renderedMarkdown.value = marked.parse(md) as string
  TocItems.value = toc
}

const checkActiveHeading = (): void => {
  if (!TocItems.value.length) return

  const scrollPosition = window.scrollY + 100

  for (let i = TocItems.value.length - 1; i >= 0; i--) {
    const item = TocItems.value[i]
    if (!item) continue
    const element = document.getElementById(item.id)
    if (element && element.offsetTop <= scrollPosition) {
      activeAnchor.value = item.id
      break
    }
  }
}

watch(
  () => props.content,
  (newVal) => {
    processMarkdown(newVal)
    nextTick(() => {
      checkActiveHeading()
    })
  },
  { immediate: true },
)

watch(isMobile, (newVal) => {
  if (newVal) {
    isCollapsed.value = true
  }
})

const scrollToAnchor = (id: string): void => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeAnchor.value = id
    if (isMobile.value) {
      isMobileView.value = false
    }
  }
}

const handleContentClick = (): void => {
  if (isMobile.value && isMobileView.value) {
    isMobileView.value = false
  }
}

onMounted(() => {
  const handleScroll = (): void => {
    checkActiveHeading()
  }

  window.addEventListener('scroll', handleScroll)

  const handleResize = (): void => {
    if (!isMobile.value) {
      isMobileView.value = false
    }
  }

  window.addEventListener('resize', handleResize)

  handleResize()
  checkActiveHeading()

  return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style lang="less" scoped>
@text-color: #333;
@text-color-secondary: #495057;
@text-color-tertiary: #6c757d;
@border-color: #e9ecef;
@bg-color: #f8f9fa;
@code-bg-color: #2d2d2d;
@code-text-color: #f8f8f2;
@transition-speed: 0.3s;
@mobile-breakpoint: 768px;

.markdown-preview {
  display: flex;
  width: 100%;
  .markdown-preview__toc {
    position: sticky;
    top: 0;
  }
  .markdown-preview__content {
    flex: 1;
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
    min-height: 100vh;
  }
  .markdown-preview__btn-toggle-display {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    background-color: @primaryColor;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
}

.toc {
  display: flex;
  flex-direction: column;
  width: 280px;
  background-color: @bg-color;
  border-right: 1px solid @border-color;
  padding: 1rem;
  transition: width @transition-speed ease;
  overflow-y: auto;
  max-height: 600px;
  &.toc__collapsed {
    width: 50px;
    overflow: hidden;
  }
  .toc__header {
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid @border-color;
    h3 {
      margin: 0;
      font-size: 1.2rem;
      color: @text-color;
    }
  }
  .toc__nav {
    flex: 1;
    overflow-y: auto;
  }
  .toc__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid @border-color;
  }
  .toc__btn-toggle-size {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: @text-color-tertiary;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: @border-color;
    }
  }
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  .toc-list__item {
    margin-bottom: 0.5rem;
    a {
      text-decoration: none;
      color: @text-color-secondary;
      display: block;
      padding: 0.3rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        background-color: @border-color;
        color: #212529;
      }
      &.active {
        background-color: @primaryColor;
        color: white;
        font-weight: 500;
      }
    }
    &.toc-list__item-level-1 {
      padding-left: 0;
    }
    &.toc-list__item-level-2 {
      padding-left: 1rem;
    }
    &.toc-list__item-level-3 {
      padding-left: 2rem;
    }
    &.toc-list__item-level-4,
    &.toc-list__item-level-5,
    &.toc-list__item-level-6 {
      padding-left: 3rem;
    }
  }
  .toc-list__empty {
    color: @text-color-tertiary;
    text-align: center;
    padding: 1rem;
    margin: 0;
  }
}

@media (max-width: @mobile-breakpoint) {
  .markdown-preview {
    .markdown-preview__toc {
      position: fixed;
      z-index: 90;
      transform: translateX(-100%);
      transition: transform @transition-speed ease;

      &:not(.toc__collapsed) {
        transform: translateX(0);
      }
    }
  }
}
</style>
