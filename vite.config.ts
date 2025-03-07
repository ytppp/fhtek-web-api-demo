import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

let CUSTOMER_ID = ''
if (process.env.CUSTOMER_ID) {
  CUSTOMER_ID = `${process.env.CUSTOMER_ID}`
} else {
  CUSTOMER_ID = 'fhtek'
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const module = await import(`./src/customer-conf/${CUSTOMER_ID}/conf.json`)
  return {
    plugins: [vue(), vueJsx, vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      VITE_CUSTOMER_CONFIG: module.default,
    },
    css: {
      preprocessorOptions: {
        less: {
          math: 'always',
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, `src/customer-conf/${CUSTOMER_ID}/assets/style/variables.less`)}";`,
        },
      },
    },
    server: {
      proxy: {
        '/action': {
          target: 'http://192.168.1.1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/action/, '/action'),
        },
      },
    },
  }
})
