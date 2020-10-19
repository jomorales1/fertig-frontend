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
    getTEvents() { //Funcion para obtener rutinas del usuario
        return axios.get(API_URL + '/event/getEvents', { headers: authHeader() }) // Peticion tipo GET para obtener rutinas
    }
    createTask(task){ // Funcion para crear tarea
        return axios.post(API_URL + '/tasks/addTask' // Peticion tipo POST para agregar la tarea
            ,task,{
            headers: authHeader()
        })
    }

    checkTask(id){//metodo para cambiar el estado de hecho en tarea en el backend
        return axios.put(API_URL + '/tasks/checkTask/'+id // Peticion tipo POST para chequear la tarea
            ,null,{
                headers: authHeader()
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

    createTEvent(tEvent) {
        axios.post(API_URL + '/events/addEvent' // Peticion tipo POST para agregar el evento
            ,tEvent,{
                headers: authHeader()
            }).then(()=>{
            this.$store.state.Eventos=this.getTEvents() // Luego de la petición, llamar a la función para obtener los eventos
        },()=>{
            return "Error" // Error en otro caso
        })
    }
}

export default new UserService()