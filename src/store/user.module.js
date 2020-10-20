import UserService from "../services/user.service"
import router from "@/router";
import Task from "@/models/Task";
import Routine from "@/models/Routine";
import TEvent from "@/models/TEvent";
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
            let listItems=[]
            UserService.getTasks().then(tasks=>{
                for (let i = 0; i < tasks.data.length; i++) {
                    listItems.push(Object.assign(new Task(), tasks.data[i]));
                }
            },()=>{
                commit('error')
                dispatch("auth/logout",null, { root: true })
                router.push("/login")
            })
            UserService.getRoutines().then(routines=>{
                for (let i = 0; i < routines.data.length; i++) {
                    let rutina=Object.assign(new Routine(), routines.data[i].rutina)
                    rutina.completada=routines.data[i].ultimaCompletada
                    listItems.push(rutina);
                }
            })
            UserService.getTEvents().then(tasks=> {
                for (let i = 0; i < tasks.data.length; i++) {
                    listItems.push(Object.assign(new TEvent(), tasks.data[i]));
                }
            })
            commit('updated',listItems)
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