import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局css
import './assets/css/global.css'

// 导入axios
import axios from 'axios'
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 添加axios拦截器 给请求预处理
// 只要触发axios就会先预处理
axios.interceptors.request.use((config) => {
  // console.log('请求对象')
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 把axios放到Vue原型
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
