import { createApp } from 'vue';
import 'bootstrap';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import $httpMessageState from './methods/pushMessageState';

import App from './App.vue';
import router from './router';
import { currency } from './methods/filters';

const app = createApp(App);
// 全域宣告額外的程式於$filters下
app.config.globalProperties.$filters = {
  currency,
};
app.provide('$httpMessageState', $httpMessageState);
app.use(VueAxios, axios);
app.use(router);
app.component('PageLoading', Loading);
app.mount('#app');
