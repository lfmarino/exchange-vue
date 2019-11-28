import Vue from 'vue'
import App from './App.vue'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import { VueSpinners } from '@saeris/vue-spinners'

import '@/assets/css/tailwind.css'
import router from '@/router'
import { dollarFilter } from './filters'
import { percentFilter } from './filters'

Vue.use(VueSpinners)
Vue.use(VueChartkick.use(Chart))

Vue.filter('dollar', dollarFilter)
Vue.filter('percent', percentFilter)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
