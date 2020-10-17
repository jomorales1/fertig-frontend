import AuthService from "../services/auth.service"

//Modulo del store de vuex encargado del manejo de la sesión usuario

//obtenemos el usuraio del store de vuex
const user = JSON.parse(localStorage.getItem('user'));
//Estado inicial si exite un usuario sesion iniciada, si no exixte sesión no iniciada y usuario =null
const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, user) {//metodo del store para iniciar sesión usando metodo se AuthService
            return AuthService.login(user).then(
                user => {
                    commit('loginSuccess', user);//cambio del estado a inicio de sesión exitoso
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');//cambio de estado a error en inicio de sesión
                    return Promise.reject(error);
                }
            );
        },
        googleLogin({ commit },id_token){
            return AuthService.googleLogin(id_token).then(
                user => {
                    commit('loginSuccess', user);//cambio del estado a inicio de sesión exitoso
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');//cambio de estado a error en inicio de sesión
                    return Promise.reject(error);
                })
        },
        facebookLogin({ commit },id_token){
            return AuthService.facebookLogin(id_token).then(
                user => {
                    commit('loginSuccess', user);//cambio del estado a inicio de sesión exitoso
                    return Promise.resolve(user);
                },
                error => {
                    commit('loginFailure');//cambio de estado a error en inicio de sesión
                    return Promise.reject(error);
                })
        },
        logout({ commit }) {//metodo del store para cerrar sesión usando metodo se AuthService
            AuthService.logout();
            commit('logout');//cambio de estado a sesión cerrada
        },
        register({ commit }, user) {//metodo del store para registro usando metodo se AuthService
            return AuthService.register(user).then(
                response => {
                    commit('registerSuccess');//cambio de estado a registro exitoso
                    return Promise.resolve(response.data);
                },
                error => {
                    commit('registerFailure');//cambio de estado a registro fallido
                    return Promise.reject(error);
                }
            );
        }},
    mutations: {
        //funciones de cambio de estado
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        registerSuccess(state) {
            state.status.loggedIn = false;
        },
        registerFailure(state) {
            state.status.loggedIn = false;
        }
    }
};