export default class User {
    //modelo de usuario para enviar  a backend
    constructor(username, password, email,nombre, recaptcha) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.nombre=nombre;
        this.recaptcha=recaptcha;
    }

}
