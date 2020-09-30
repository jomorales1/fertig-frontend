import axios from 'axios'
import querystring from "query-string"
const API_URL = 'http://localhost:8090'
class AuthService{
    login(user){
        let res= axios
            .request({
                url:'oauth/token',
                method:'POST',
                baseURL:API_URL,
                auth:{
                    username:'cliente',
                    password:'password'
                },
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data:querystring.stringify({
                    username: user.username,
                    password: user.password,
                    "grant_type":"password"
                })
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
}
export default new AuthService()