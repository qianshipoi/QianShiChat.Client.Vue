import { createApp } from 'vue'
import './assets/css/style.css'
import './assets/css/global.scss'
import App from './App.vue'
import router from "./router";
import store from "./store";
import 'element-plus/dist/index.css'
import 'normalize.css'
import i18n from './lang';

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app')
