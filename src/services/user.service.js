import axios from 'axios'
import authHeader from './auth-header'
const API_URL = 'http://localhost:8090'
class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all')
    }

    getTasks() { //Funcion para obtener tareas del usuario
        return axios.get(API_URL + '/tasks/getTasks', { headers: authHeader() }) // Peticion tipo GET para obtener tareas
    }

    getRoutines() { //Funcion para obtener rutinas del usuario
        return axios.get(API_URL + '/routines/getRoutines', { headers: authHeader() }) // Peticion tipo GET para obtener rutinas
    }
    getTEvents() { //Funcion para obtener rutinas del usuario
        return axios.get(API_URL + '/events/getEvents', { headers: authHeader() }) // Peticion tipo GET para obtener rutinas
    }
    createTask(task){ // Funcion para crear tarea
        return axios.post(API_URL + '/tasks/addTask' // Peticion tipo POST para agregar la tarea
            ,task,{
            headers: authHeader()
        })
    }
    searchUser(user){//Funcion para buscar usuarios por username
        return axios.get(API_URL+'/users/search/'+user,{
            headers: authHeader()
        })
    }
    getFriends(){//metodo para obtener amigos del usuario
        return axios.get(API_URL+'/users/getFriends/',{
            headers: authHeader()
        })
    }
    addFriend(usuario){//metodo para añadir el amigo por username
        return axios.put(API_URL+'/users/addFriend/'+usuario,null,{
            headers: authHeader()
        })
    }
    deleteFriend(usuario){//metodo para eliminar el amigo por username
        return axios.delete(API_URL+'/users/deleteFriend/'+usuario,{
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
        return axios.patch(API_URL + '/routines/uncheckRoutine/' +id // Peticion tipo POST para chequear la tarea
            ,null,{
                headers: authHeader()
            })
    }

    createRoutine(routine) {//metodo para crear rutinas en el backend
        return axios.post(API_URL + '/routines/addRoutine' // Peticion tipo POST para agregar la rutina
            ,routine,{
                headers: authHeader()
            })
    }

    createTEvent(tEvent) {//metodo para crear eventos en el backend
        return axios.post(API_URL + '/events/addEvent' // Peticion tipo POST para agregar el evento
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
        return axios.get(API_URL+'/'+type.toLowerCase()+'s/get'+type+'/'+id,{headers:authHeader()})
    }
    addCopy(id){
        return axios.post(API_URL+'/tasks/copyTask/'+id,null,{headers:authHeader()})
    }

    createSubTask(task, parentId, url){
        return axios.post( API_URL + url + parentId
            ,task, {
                headers: authHeader()
            }

        )
    }

    editSubTask(subTask,url){
        return axios.put(API_URL + url + subTask.id
            ,subTask, {
                headers: authHeader()
            }
        )
    }


}

export default new UserService()