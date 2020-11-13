import axios from 'axios'
import authHeader from './auth-header'
const API_URL = 'http://localhost:8090'
class UserService {

    getTasks() { //Funcion para obtener tareas del usuario
        return axios.get(API_URL + '/task/tasks', { headers: authHeader() }) // Peticion tipo GET para obtener tareas
    }

    getRoutines() { //Funcion para obtener rutinas del usuario
        return axios.get(API_URL + '/routine/routines', { headers: authHeader() }) // Peticion tipo GET para obtener rutinas
    }
    getTEvents() { //Funcion para obtener rutinas del usuario
        return axios.get(API_URL + '/event/events', { headers: authHeader() }) // Peticion tipo GET para obtener rutinas
    }
    createTask(task){ // Funcion para crear tarea
        return axios.post(API_URL + '/task/add' // Peticion tipo POST para agregar la tarea
            ,task,{
            headers: authHeader()
        })
    }
    searchUser(user){//Funcion para buscar usuarios por username
        return axios.get(API_URL+'/user/search/'+user,{
            headers: authHeader()
        })
    }
    getFriends(){//metodo para obtener amigos del usuario
        return axios.get(API_URL+'/user/friends/',{
            headers: authHeader()
        })
    }
    addFriend(usuario){//metodo para añadir el amigo por username
        return axios.put(API_URL+'/user/add-friend/'+usuario,null,{
            headers: authHeader()
        })
    }
    deleteFriend(usuario){//metodo para eliminar el amigo por username
        return axios.delete(API_URL+'/user/delete-friend/'+usuario,{
            headers: authHeader()
        })
    }

    checkTask(url,id){//metodo para cambiar el estado de hecho en tarea en el backend
        return axios.patch(API_URL + url +id // Peticion tipo POST para chequear la tarea
            ,null,{
                headers: authHeader()
            })
    }
    uncheckRoutine(id){//metodo para deschequear las rutinas en el backend
        return axios.patch(API_URL + '/routine/uncheck/' +id // Peticion tipo POST para chequear la tarea
            ,null,{
                headers: authHeader()
            })
    }

    createRoutine(routine) {//metodo para crear rutinas en el backend
        return axios.post(API_URL + '/routine/add' // Peticion tipo POST para agregar la rutina
            ,routine,{
                headers: authHeader()
            })
    }

    createTEvent(tEvent) {//metodo para crear eventos en el backend
        return axios.post(API_URL + '/event/add' // Peticion tipo POST para agregar el evento
            ,tEvent,{
                headers: authHeader()
            })
    }
    edit(task,url){//metodo para editar tareas rutinas o eventos en el backend
        return axios.put(API_URL+url+task.id,task,{headers:authHeader()})
    }
    delete(task,url){//metodo para eliminar tareas rutinas o eventos en el backend
        return axios.delete(API_URL+url+task.id,{headers:authHeader()})
    }
    getCopy(id,type){
        return axios.get(API_URL+'/'+type+'/'+id,{headers:authHeader()})
    }
    addCopy(id){
        return axios.post(API_URL+'/task/'+id+'/copy/',null,{headers:authHeader()})
    }
    addTime(id, time){
        return axios.put(API_URL+'/task/'+id+'/increase-time/'+time,null,{headers:authHeader()})
    }
    sounds(){
        return axios.get(API_URL+'/sounds',{
            headers: authHeader()
        })
    }
    addFavorite(id){
        return axios.post(API_URL+'/sound/add-favorite/'+id,null,{headers:authHeader()})
    }
    deleteFavorite(id){
        return axios.delete(API_URL+'/sound/delete-favorite/'+id,{headers:authHeader()})
    }

    createSubTask(task, url){
        return axios.post( API_URL + url
            ,task, {
                headers: authHeader()
            }

        )
    }

    editSubTask(subTask,url){
        return axios.put(API_URL + url
            ,subTask, {
                headers: authHeader()
            }
        )
    }

    deleteSubTask(subTask, url) {
        return axios.delete(API_URL + url
            , {headers: authHeader()})
    }

    checkSubTask(subTask, url){
        return axios.patch(API_URL + url
            ,subTask,{
                headers:authHeader()
            })
    }

    addAdmin(task, user){
        return axios.post( API_URL + '/task/' + task + '/add-admin/' + user
            ,null,{
                headers: authHeader()
            }

        )
    }

    addOwner(task, user){
        return axios.post( API_URL + '/task/' + task + '/add-owner/' + user
            ,null,{
                headers: authHeader()
            }

        )
    }

    getOwners(task){
        return axios.get(API_URL + '/task/' + task + '/owners',
            {
                headers: authHeader()
            })
    }



}

export default new UserService()
