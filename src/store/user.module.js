import UserService from "../services/user.service"
import router from "@/router";
import Task from "@/models/Task";
import Routine from "@/models/Routine";
import TEvent from "@/models/TEvent";
//modulo de vuex para manejo de datos

//obtenemos tareas del store de vuex
const tareas = JSON.parse(localStorage.getItem('tareas'));
const initialState = tareas
    ? { status:'full',tareas:UserService.getTasks().data, repetitions:UserService.getRoutinesRepetitions().data, eventsRepetitions:UserService.getEventsRepetitions().data}
    : { status: 'empty', tareas:[],repetitions: [] , eventsRepetitions:[]};
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
            dispatch("updateRepetitions")
            dispatch("updateEventsRepetitions")
            commit('updated',listItems)
        },
        updateRepetitions({commit}){
            UserService.getRoutinesRepetitions().then(
                response=>{
                    commit('repetitionsUpdate',response.data)
                },
                ()=>{
                    commit('error')
                }
            )
        },
        updateEventsRepetitions({commit}){
            UserService.getEventsRepetitions().then(
                response=>{
                    commit('EventsRepetitionsUpdate',response.data)
                },
                ()=>{
                    commit('error')
                }
            )
        },
        uncheckRoutine({commit},item){//metodo para deschequear rutinas con el user service
            return UserService.uncheckRoutine(item.id).then(()=>{},()=>{
                commit('error')
            })
        },
        check({commit},item){//metodo para cambiar el estado de hecho de una tarea o rutina usando user service
            let url
            if(item instanceof Task) url='/task/check/'
            if(item instanceof Routine) url='/routine/check/'
            return UserService.checkTask(url,item.id).then(()=>{},()=>{
                commit('error')
            })
        },
        edit({commit},item){//metodo para editar tareas rutinas y eventos eligiendo el link necesario
            let url
            if(item instanceof Task) url='/task/update/'
            if(item instanceof Routine) url='/routine/update/'
            else if (item instanceof TEvent) url='/event/update/'
            return UserService.edit(item,url).then(()=>commit('edited'),()=>commit('error'))
        },
        delete({commit},item){//metodo para eliminar tareas rutinas o eventos eligiendo el link necesario
            let url
            if(item instanceof Task) url='/task/delete/'
            if(item instanceof Routine) url='/routine/delete/'
            else if (item instanceof TEvent) url='/event/delete/'
            return UserService.delete(item,url).then(
                response=>{
                    commit('edited')
                    return Promise.resolve(response)
                },
                error=>{
                    commit('error')
                    return Promise.reject(error)
                })
        },// usar para borrar subtarea
        createSubTask({commit}, data){
            let url
            if(data.padre instanceof  Task) url = '/task/'+data.id+'/add-subtask/'
            if(data.padre instanceof  Routine) url = '/routine/'+data.id+'/add-subtask/'
            return UserService.createSubTask(data.tarea, url).then(() => commit('subTaskCreated'), ()=>commit('error'))
        },
        editSubTask({commit}, data){
            let url
            if(data.padre instanceof  Task) url = '/task/'+data.tarea.id+'/update-subtask/'
            if(data.padre instanceof  Routine) url = '/routine/'+data.tarea.id+'/update-subtask/'
            return UserService.editSubTask(data.tarea, url).then(()=>commit('edited'),()=>commit('error'))
        },
        searchUser({commit}, username){//metodo para buscar usuarios usando el user service
            return UserService.searchUser(username).then(response=>{
                return Promise.resolve(response)
            },()=>{
                commit('error')
                return Promise.reject()
            })
        },
        deleteSubTask({commit},data){
            let url
            if(data.padre instanceof Task) url='/task/'+data.tarea.id+'/delete-subtask/'
            if(data.padre instanceof Routine) url='/routine/'+data.tarea.id+'/delete-subtask/'
            return UserService.deleteSubTask(data.tarea,url).then(()=>commit('edited'),()=>commit('error'))
        },
        checkSubTask({commit},data){
            let url
            if(data.padre instanceof Task) url='/task/'+data.tarea.id+'/check-subtask/'
            if(data.padre instanceof Routine) url='/routine/'+data.tarea.id+'/check-subtask/'
            return UserService.checkSubTask(data.tarea,url).then(()=>{},()=>commit('error'))
        },
        getFriends({commit}){//metodo paraobtener los amigos del usuario con el user service
            return UserService.getFriends().then(
                response=>{
                    return Promise.resolve(response)
                },()=>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        addFriend({commit},usuario) {//metodo para añadir amigo con el user service
            return UserService.addFriend(usuario).then(
                response=>{
                    return Promise.resolve(response)
                },()=>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        deleteFriend({commit},usuario) {//metodo para eliminar amigo con el user service
            return UserService.deleteFriend(usuario).then(
                response=>{
                    return Promise.resolve(response)
                },()=>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        getCopy({commit},data){
            return UserService.getCopy(data.id,data.type).then(
                response=>{
                    return Promise.resolve(response)
                },()=>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        addCopy({commit},data){
            return UserService.addCopy(data.id,data.type).then(
                result=>{
                    return Promise.resolve(result)
                },error=>{
                    commit('error')
                    return Promise.reject(error)
                }
            )
        },
        addTime({commit},data){
            return UserService.addTime(data.id, data.time).then(
                result=>{
                    return Promise.resolve(result)
                },error=>{
                    commit('error')
                    return Promise.reject(error)
                }
            )
        },
        sounds({commit}){
            return UserService.sounds().then(
                response=>{
                    return Promise.resolve(response)
                },()=>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        addFavorite({commit},titulo){
            return UserService.addFavorite(titulo).then(()=>{},()=>{
                commit('error')
            })
        },
        deleteFavorite({commit},titulo){
            return UserService.deleteFavorite(titulo).then(()=>{},()=>{
                commit('error')
            })
        },
        addAdmin({commit},data){
            return UserService.addAdmin(data.id, data.username).then(() => {}, () =>{ commit('error')})

        },
        addOwner({commit}, data){
            return UserService.addOwner(data.id, data.username).then(() => {}, () =>{ commit('error')})
        },
        getOwners({commit}, id){
            return UserService.getOwners(id).then(
                response =>{
                    return  Promise.resolve(response)
                },() =>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        removeAdmin({commit}, data){
            return UserService.removeAdmin(data.id, data.username).then(() => {}, () =>{ commit('error')})
        },
        deleteOwner({commit}, data){
            return UserService.deleteOwner(data.id, data.username).then(() => {}, () =>{ commit('error')})
        },
        getReportWeek({commit}, date){
            return UserService.getReportWeek(date).then(
                response =>{
                    return Promise.resolve(response)
                },() =>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        getReportMonth({commit}, date){
            return UserService.getReportMonth(date).then(
                response =>{
                    return Promise.resolve(response)
                },() =>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        getReportYear({commit}, date){
            return UserService.getReportYear(date).then(
                response =>{
                    return Promise.resolve(response)
                },() =>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        getGraphicWeek({commit},date){
            return UserService.getGraphicWeek(date).then(
                response =>{
                    return Promise.resolve(response)
                },() =>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        getGraphicMonth({commit},date){
            return UserService.getGraphicMonth(date).then(
                response =>{
                    return Promise.resolve(response)
                },() =>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        getGraphicYear({commit},date){
            return UserService.getGraphicYear(date).then(
                response =>{
                    return Promise.resolve(response)
                },() =>{
                    commit('error')
                    return Promise.reject()
                }
            )
        },
        getFranjas({commit}){
            return UserService.getFranjas().then(response=>{
                commit('franjas',response.data)
                return Promise.resolve(response)
            })
        }

    },
    mutations:{
        //cambios de estado
        updated(state,tasks){
            state.status='full'
            state.tareas=tasks
        },
        repetitionsUpdate(state,repetitions){
          state.status='repetitions updated'
          state.repetitions=repetitions
        },
        EventsRepetitionsUpdate(state,repetitions){
            state.status='repetitions updated'
            state.eventsRepetitions=repetitions
        },
        error(state){
            state.status='Failure'
        },
        edited(state){
            state.status='Edited'
        },
        subTaskCreated(state){
            state.status = 'created'
        },
        franjas(state,franjas){
            state.franjas = franjas
        }
    }

}