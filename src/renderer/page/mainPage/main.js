import Vue from 'vue';
import axios from 'axios';
import App from './App';
import router from './router';
import store from './store';
import Toast from 'vue2-toast';
import './Antcomponents'
import './assets/css/style.css';
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
// Vue.use(Antd);
Vue.use(Toast);
axios.defaults.timeout = 60000;
Vue.http = Vue.prototype.$http = axios;
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

// 混入一些在全局使用的功能

/* eslint-disable no-new */
   new Vue({
     el: '#app',
     router,
     store,
     components: { App },
     template: '<App/>',
     created() { 
       
     }
   });
// 
//new Vue({
//components: { App },
//router,
//store,
//template: '<App/>'
//}).$mount('#app')
