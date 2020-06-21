import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
// 登录
import user from './modules/user.js'
import cart from './modules/cart.js'
import path from './modules/path.js'
export default new Vuex.Store({
	modules:{ 
		user,
		cart,
		path
	}
})

 