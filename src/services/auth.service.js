import axios from 'axios'
// import querystring from "query-string"
const API_URL = 'http://localhost:8090'
class AuthService{
    login(user){ // Funcion para login del susuario
        return axios
            .post(API_URL + '/signin', // request tipo POST para enviar usuario y contraseña
                    {
                    username: user.username,
                    password: user.password,
                }
            ,{
                headers:{
                    "Content-Type": "application/json"
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
    googleLogin(googleToken){
         return axios.post(API_URL+'/login/oauth2/code/google',{
             Token:googleToken
         },{
             headers:{
                 "Content-Type": "application/json"
             }
         }).then(response =>{
             if (response.data.access_token){
                 localStorage.setItem('user',JSON.stringify(response.data))  // Almacena en memoria el usuario
             }
             return response.data // Devuelve los datos del usuario en respuesta
         });
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