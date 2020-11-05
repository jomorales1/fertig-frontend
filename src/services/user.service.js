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

    checkTask(id){//metodo para cambiar el estado de hecho en tarea en el backend
        return axios.patch(API_URL + '/tasks/checkTask/'+id // Peticion tipo POST para chequear la tarea
            ,null,{
                headers: authHeader()
            })
    }

    createRoutine(routine) {
        return axios.post(API_URL + '/routines/addRoutine' // Peticion tipo POST para agregar la rutina
            ,routine,{
                headers: authHeader()
            })
    }

    createTEvent(tEvent) {
        return axios.post(API_URL + '/events/addEvent' // Peticion tipo POST para agregar el evento
            ,tEvent,{
                headers: authHeader()
            })
    }
    edit(task,url){
        return axios.put(API_URL+url+task.id,task,{headers:authHeader()})
    }
    delete(task,url){
        return axios.delete(API_URL+url+task.id,{headers:authHeader()})
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