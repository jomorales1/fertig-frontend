import axios from 'axios'
import querystring from "query-string"
const API_URL = 'http://localhost:8090'
class AuthService{
    login(user){ // Funcion para login del susuario
        return axios
            .post(API_URL + '/oauth/token', // request tipo POST para enviar nombre y contraseña
                querystring.stringify({
                    username: user.username,
                    password: user.password,
                    "grant_type":"password"
                }),{
                auth:{                          // Credenciales de usuario autorizado
                        username:'cliente',
                        password:'secret'
                    },
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            ).then(response =>{
                if (response.data.access_token){
                    localStorage.setItem('user',JSON.stringify(response.data))  // Almacena en memoria el usuario
                }
                return response.data // Devuelve los datos del usuario en respuesta
            });
    }
    logout() { // Funcion para cerrar sesión
        localStorage.removeItem('user'); // Remueve el usuario de memoria
    }

    register(user) { // Funcion de registro
        return axios.post(API_URL + '/users/addUser', { // Peticion tipo POST con los datos de registro
            correo: user.email,
            usuario: user.username,
            password: user.password,
            nombre:user.nombre
        },{
            headers:{
                "Content-Type": "application/json"
            }
        });
    }
}
export default new AuthService()