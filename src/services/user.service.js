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

    createTask(task){ // Funcion para crear tarea
        return axios.post(API_URL + '/tasks/addTask' // Peticion tipo POST para agregar la tarea
            ,task,{
            headers: authHeader()
        })
    }

    checkTask(id){
        return axios.put(API_URL + '/tasks/checkTask/'+id // Peticion tipo POST para agregar la tarea
            ,null,{
                headers: authHeader()
            })
    }

    // getModeratorBoard() {
    //     return axios.get(API_URL + 'mod', { headers: authHeader() })
    // }
    //
    // getAdminBoard() {
    //     return axios.get(API_URL + 'admin', { headers: authHeader() })
    // }
}

export default new UserService()