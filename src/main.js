// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'bootstrap/dist/css/bootstrap.css'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'
import createPersistedState from 'vuex-persistedstate'
import VueRouterPermissions from 'vue-router-permissions'
import VueSocketIO from 'vue-socket.io'
import CircularCountDownTimer from 'vue-circular-count-down-timer'
// eslint-disable-next-line
import jQuery from 'jquery'

import EvaIcons from 'vue-eva-icons'

Vue.use(EvaIcons)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(BootstrapVue)

Vue.use(Vuex)
Vue.use(VueCookies)

Vue.use(VueRouterPermissions, router)
Vue.use(CircularCountDownTimer)

const options = { path: '/socket.io/' } // Options object to pass into SocketIO

// connection: 'ws://0.0.0.0:5000'
console.log('---------')
console.log(process.env)
console.log('---------')
if (window.WebSocket) {
  Vue.use(
    new VueSocketIO({
      debug: true,
      connection: process.env.VUE_APP_WS_BASE_URL
    })
  )
}

const authenticate = Promise.resolve({ role: 'guest' })

const store = new Vuex.Store({
  state: {
    authHeader: '',
    gitHubCode: '',
    sideBarFlag: false,
    user: {
      username: null,
      role: null
    }
  },
  mutations: {
    updateGitHubCode: function (state, gitHubCode) {
      state.gitHubCode = gitHubCode
    },
    updateSideBarFlag: function (state, sideBarFlag) {
      state.sideBarFlag = sideBarFlag
    },
    updateAuthHeader: function (state, authHeader) {
      state.authHeader = authHeader
    },
    updateUser: function (state, user) {
      state.user = user
    }
  },
  getters: {},
  actions: {},
  plugins: [
    createPersistedState({
      key: 'gitHubCode',
      paths: ['gitHubCode', 'authHeader', 'user'],
      storage: window.sessionStorage
    })
  ]
})

authenticate.then(user => {
  Vue.prototype.$user.set(user)
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  })
})

export default store
