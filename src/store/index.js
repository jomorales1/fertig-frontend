import Vue from 'vue'
import Vuex from 'vuex'
import 'es6-promise/auto'
// import router from '@/router'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})
export default store