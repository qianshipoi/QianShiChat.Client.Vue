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
import 'animate.css';
import VueLazyload from 'vue-lazyload'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})
app.mount('#app')
