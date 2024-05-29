import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index'
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css'

const app = createApp(App);
app.use(createPinia()).use(router).use(ElementPlus);
app.mount('#app');
