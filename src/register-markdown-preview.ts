import type { App } from 'vue'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'

VMdPreview.use(githubTheme, {
  Hljs: hljs,
})

function registerMarkdownPreview(app: App) {
  app.use(VMdPreview)
}

export default registerMarkdownPreview
