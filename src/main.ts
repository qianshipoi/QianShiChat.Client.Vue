import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import i18n from './lang';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'normalize.css'
import './assets/css/style.css'
import './assets/css/global.scss'
import './assets/css/theme.light.css'
import './assets/css/theme.dark.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app')
