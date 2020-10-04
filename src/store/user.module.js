import UserService from "../services/user.service"
const tareas = JSON.parse(localStorage.getItem('tareas'));
const initialState = tareas
    ? { status:'empty',tareas:UserService.getTasks()}
    : { status: 'full', tareas:[] };
export const DataModule = {
    namespaced: true,
    state:initialState,
    actions:{
        update({commit}){
                UserService.getTasks().then(tasks=>{
                    commit('updated',tasks.data)
                },()=>{
                    commit('error')
            })
        }
    },
    mutations:{
        updated(state,tasks){
            state.status='full'
            state.tareas=tasks
        },
        error(state){
            state.status='Failure'
        },
    }

}