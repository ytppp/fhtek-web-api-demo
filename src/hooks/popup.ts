import { createApp, h, type App, type Component } from 'vue'

const createMountRoot = () => {
  const el = document.createElement('div')
  return el
}

export const usePopup = (content: Component, appendedEl = document.body) => {
  const el = createMountRoot()

  const createPopupApp = () => createApp(h(content))
  let app: App<Element> | null = null

  // mount popup
  const show = () => {
    app = createPopupApp()
    app.mount(el)
    appendedEl.appendChild(el)
  }
  // destroy popup
  const destroy = () => {
    if (app) {
      app.unmount()
      app = null
    }
    appendedEl.removeChild(el)
  }
  // close popup
  const close = () => {
    destroy()
  }

  return {
    show,
    destroy,
    close,
  }
}
