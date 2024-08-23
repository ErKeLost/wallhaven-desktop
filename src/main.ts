import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'

import '@varlet/touch-emulator'

import '@/styles/global.less'
import 'virtual:uno.css'
import 'virtual-icons'

LoadingBar.setDefaultOptions({
  finishDelay: 250,
})


createApp(App).use(router).mount('#app')
