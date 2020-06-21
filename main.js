import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import VueLazyload from 'vue-lazyload'  
Vue.use(VueLazyload)
import store from './store/index.js'
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
