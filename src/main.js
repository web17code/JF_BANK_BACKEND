// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import resource from  'vue-resource'
import iview from 'iview'
import 'iview/dist/styles/iview.css';
import './assets/common.css'
//import utils from './utils/utils'

Vue.config.productionTip = false
Vue.use(iview)
Vue.use(resource)
Vue.http.interceptors.push(function(request, next) {//拦截器
// 跨域携带cookie
  request.credentials = true;
  next()
})

//Vue.prototype.utils = utils;
//window.getHost = "http://192.168.1.111/bank/"
window.getHost = "http://192.168.1.217/school-bank-web/"
//window.getHost = "http://192.168.1.110/school-bank-web/";
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
