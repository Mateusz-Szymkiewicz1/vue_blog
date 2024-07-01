import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from "primevue/config"
import App from './App.vue'
import router from './router'
import '@/multiselect.css'
import Aura from '@primevue/themes/aura';

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark'
      }
  }
});

app.mount('#app')
