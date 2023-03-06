import { createApp } from 'vue';
import 'bootstrap';
import axios from 'axios';
import VueAxios from 'vue-axios';

// vee-validate
import {
  Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import $httpMessageState from './methods/pushMessageState';
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.vue';
import router from './router';
import { currency } from './methods/filters';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});
setLocale('zh_TW');

const app = createApp(App);
// 全域宣告額外的程式於$filters下
app.config.globalProperties.$filters = {
  currency,
};
app.provide('$httpMessageState', $httpMessageState);

app.use(VueAxios, axios);
app.use(router);

app.component('PageLoading', Loading);
// 於全域註冊vee-validate主要三個功能
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);

app.mount('#app');
