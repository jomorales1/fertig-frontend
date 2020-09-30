import axios from 'axios'
import querystring from "query-string"
const API_URL = 'http://localhost:8090'
class AuthService{
    login(user){
        let res= axios
            .post(API_URL + '/oauth/token',
                querystring.stringify({
                    username: user.username,
                    password: user.password,
                    "grant_type":"password"
                }),{
                    auth:{
                        username:'cliente',
                        password:'password'
                    },
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            ).then(response =>{
                if (response.data.accessToken){
                    localStorage.setItem('user',JSON.stringify(response.data))
                }
                return response.data
            });
        console.log(res)
        return res
    }
    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return axios.post(API_URL + '/add', {
            correo: user.email,
            nombre: user.username,
            password: user.password
        },{
            headers:{
                "Content-Type": "application/json"
            }
        });
    }
}
export default new AuthService()