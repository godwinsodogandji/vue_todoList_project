
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import Aura from '@primevue/themes/aura'
// import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'

// import 'primeicons/primeicons.css'

import ToastService from 'primevue/toastservice';

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark'
    }
  }
})
app.use(ToastService)
app.mount('#app')
