import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import '@/assets/css/main.scss'
import './icons'
import SvgIcon from '@/components/SvgIcon'// svg component
const app = createApp(App);
app.component('svg-icon', SvgIcon);
app.use(store).use(router).use(ElementPlus,{ locale }).mount('#app');
