import Vue from 'vue'
import Vuex from 'vuex'
import {auth} from "./auth.module"
import {DataModule} from "@/store/user.module";
import 'es6-promise/auto'

//Adición de vuex a la aplicacion de vue añadiendo modulos de usuario y manejo de sesión

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