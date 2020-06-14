import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import VueLazyload from 'vue-lazyload'  
Vue.use(VueLazyload)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
