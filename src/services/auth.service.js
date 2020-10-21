import axios from 'axios'
import querystring from "query-string"
import authHeader from "./auth-header";
const API_URL = 'http://localhost:8090'
class AuthService{
    login(user){ // Funcion para login del susuario
        return axios
            .post(API_URL + '/signin', // request tipo POST para enviar usuario y contraseña
            {
                username: user.username,
                password: user.password,
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
    logout() { // Funcion para cerrar sesión
        localStorage.removeItem('user'); // Remueve el usuario de memoria
        localStorage.removeItem('googleUser');//Remueve el usuario de google de la memoria
    }
    googleLogin(googleToken){//metodo para enviar token de google y obtener token propio
         return axios.post(API_URL+'/login/oauth2/code/google',querystring.stringify({
             Token:googleToken
         }),{
             headers:{
                 "Content-Type": "application/x-www-form-urlencoded"
             }
         }).then(response =>{
             if (response.data.access_token){
                 localStorage.setItem('user',JSON.stringify(response.data))  // Almacena en memoria el usuario
             }
             return response.data // Devuelve los datos del usuario en respuesta
         });
    }
    facebookLogin(facebookToken){//metodo para enviar token de facebook y obtener token propio
        return axios.post(API_URL+'/login/oauth2/code/facebook',querystring.stringify({
            Token:facebookToken
        }),{
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
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

    getUser(){
        return axios.get(API_URL + '/users/get',{
            headers: authHeader()
        }).then(response => response)
            .catch(error => error)

    }

    saveChanges(user){
        return axios.put(API_URL + '/users/update',{
            correo: user.email,
            usuario: user.username,
            password: user.password,
            nombre:user.nombre
        }, {
            headers: authHeader()
        });
    }
}
export default new AuthService()