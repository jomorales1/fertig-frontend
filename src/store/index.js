import Vue from 'vue'
import Vuex from 'vuex'
import {auth} from "./auth.module"
import {DataModule} from "@/store/user.module";
import 'es6-promise/auto'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        count: 0,
    },
    mutations: {
        increment (state) {
            state.count++
        }
    },
    modules:{
        auth,
        DataModule
    }
})
export default store