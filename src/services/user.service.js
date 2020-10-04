import axios from 'axios'
import authHeader from './auth-header'
const API_URL = 'http://localhost:8090'
class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all')
    }

    getTasks() {
        return axios.get(API_URL + '/tasks/getTasks', { headers: authHeader() })
    }

    createTask(task){
        axios.post(API_URL + '/tasks/addTask'
            ,task,{
            headers: authHeader()
        }).then(()=>{
            this.$store.state.Tareas=this.getTasks()
        },()=>{
            return "Error"
        })
    }

    getModeratorBoard() {
        return axios.get(API_URL + 'mod', { headers: authHeader() })
    }

    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() })
    }
}

export default new UserService()