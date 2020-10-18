import UserService from "../services/user.service"
import router from "@/router";
//modulo de vuex para manejo de datos

//obtenemos tareas del store de vuex
const tareas = JSON.parse(localStorage.getItem('tareas'));
const initialState = tareas
    ? { status:'full',tareas:UserService.getTasks()}
    : { status: 'empty', tareas:[] };
//estado inicial  tareas obteniendolas del user service
export const DataModule = {
    namespaced: true,
    state:initialState,
    actions:{
        update({commit,dispatch}){//metodo del vuex para actualizar la lista de tareas desde user service
                return UserService.getTasks().then(tasks=>{
                    commit('updated',tasks.data)
                },()=>{
                    commit('error')
                    dispatch("auth/logout",null, { root: true })
                    router.push("/login")
                })
        },
        check({commit},id){//metodo para cambiar el estado de hecho de una tarea usando user service
            return UserService.checkTask(id).then(()=>{},()=>{
                commit('error')
            })
        }
    },
    mutations:{
        //cambios de estado
        updated(state,tasks){
            state.status='full'
            state.tareas=tasks
        },
        error(state){
            state.status='Failure'
        },
    }

}