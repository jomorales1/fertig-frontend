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
        return axios.get(API_URL + '/routine/getRoutines', { headers: authHeader() }) // Peticion tipo GET para obtener rutinas
    }

    createTask(task){ // Funcion para crear tarea
        axios.post(API_URL + '/tasks/addTask' // Peticion tipo POST para agregar la tarea
            ,task,{
            headers: authHeader()
        }).then(()=>{
            this.$store.state.Tareas=this.getTasks() // Luego de la petición, llamar a la función para obtener las tareas
        },()=>{
            return "Error" // Error en otro caso
        })
    }

    createRoutine(routine) {
        axios.post(API_URL + '/routines/addRoutine' // Peticion tipo POST para agregar la rutina
            ,routine,{
                headers: authHeader()
            }).then(()=>{
            this.$store.state.Rutinas=this.getRoutines() // Luego de la petición, llamar a la función para obtener las rutinas
        },()=>{
            return "Error" // Error en otro caso
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