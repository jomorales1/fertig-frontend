export default function authHeader(){//funcion para obtener el header con el access token
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access_token){
        return { Authorization: 'Bearer ' + user.access_token };
    }else{
        return {}
    }
}