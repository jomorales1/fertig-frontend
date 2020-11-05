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
                    let rutina=Object.assign(new Routine(), routines.data[i])
                    rutina.fecha = new Date(rutina.fecha)
                    listItems.push(rutina);
                }
            })
            UserService.getTEvents().then(tasks=> {
                for (let i = 0; i < tasks.data.length; i++) {
                    let event=Object.assign(new TEvent(), tasks.data[i])
                    if(event.recurrencia)event.fecha=new Date(event.fecha)
                    listItems.push(event)
                }
            })
            commit('updated',listItems)
        },
        uncheckRoutine({commit},item){//metodo para deschequear rutinas con el user service
            return UserService.uncheckRoutine(item.id).then(()=>{},()=>{
                commit('error')
            })
        },
        check({commit},item){//metodo para cambiar el estado de hecho de una tarea o rutina usando user service
            let url
            if(item instanceof Task) url='/tasks/checkTask/'
            if(item instanceof Routine) url='/routines/checkRoutine/'
            return UserService.checkTask(url,item.id).then(()=>{},()=>{
                commit('error')
            })
        },
        edit({commit},item){
            let url
            if(item instanceof Task) url='/tasks/updateTask/'
            if(item instanceof Routine) url='/routines/updateRoutine/'
            else if (item instanceof TEvent) url='/events/updateEvent/'
            return UserService.edit(item,url).then(()=>commit('edited'),()=>commit('error'))
        },
        delete({commit},item){
            let url
            if(item instanceof Task) url='/tasks/deleteTask/'
            if(item instanceof Routine) url='/routines/deleteRoutine/'
            else if (item instanceof TEvent) url='/events/deleteEvent/'
            return UserService.delete(item,url).then(()=>commit('edited'),()=>commit('error'))
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
        edited(state){
            state.status='Edited'
        }
    }

}