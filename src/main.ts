import { createApp } from 'vue'
import './assets/style/style.css'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/style/style.css'
import './assets/style/theme.scss'

createApp(App).use(router).use(store).use(ElementPlus).mount('#app')
