import Vue from 'vue'
import Vuex from 'vuex'
import {auth} from "./auth.module"
import 'es6-promise/auto'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        count: 0,
        Tareas:[
            {
                title:"Titulo de la tarea1",
                description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor justo non lectus vestibulum, eu pellentesque felis aliquam. Nam luctus sodales ante, nec porta orci aliquet volutpat. Suspendisse sagittis felis id nulla viverra, vitae auctor libero ullamcorper. Nulla eu magna eget felis vulputate ultrices vel vitae turpis.",
                priority:5,
                startDate:new Date("2020/9/10 15:20"),
                endDate:new Date("2020/9/25 15:20")
            },
            {
                title:"Titulo de la tarea2",
                description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor justo non lectus vestibulum, eu pellentesque felis aliquam. Nam luctus sodales ante, nec porta orci aliquet volutpat. Suspendisse sagittis felis id nulla viverra, vitae auctor libero ullamcorper. Nulla eu magna eget felis vulputate ultrices vel vitae turpis.",
                priority:3,
                startDate:new Date("2020/10/10 15:20" ),
                endDate:new Date("2020/10/12 15:20")
            },
            {
                title:"Titulo de la tarea3",
                description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor justo non lectus vestibulum, eu pellentesque felis aliquam. Nam luctus sodales ante, nec porta orci aliquet volutpat. Suspendisse sagittis felis id nulla viverra, vitae auctor libero ullamcorper. Nulla eu magna eget felis vulputate ultrices vel vitae turpis.",
                priority:1,
                startDate:new Date("2020/10/1 15:20"),
                endDate:new Date("2020/10/13 15:20")
            }
        ]
    },
    mutations: {
        increment (state) {
            state.count++
        }
    },
    modules:{
        auth
    }
})
export default store