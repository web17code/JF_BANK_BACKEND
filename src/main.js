// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import resource from  'vue-resource'
import iview from 'iview'
import 'iview/dist/styles/iview.css';
import './assets/common.css'
import utils from './utils/utils'

Vue.config.productionTip = false
Vue.use(iview)
Vue.use(resource)
Vue.prototype.utils = utils;
window.getHost = "http://192.168.1.217/school-bank-web/"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
