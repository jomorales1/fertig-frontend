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
                newUser => {
                    commit('loginSuccess', newUser);//cambio del estado a inicio de sesión exitoso
                    return Promise.resolve(newUser);
                },
                error => {
                    commit('loginFailure');//cambio de estado a error en inicio de sesión
                    return Promise.reject(error);
                }
            );
        },
        googleLogin({ commit },id_token){//metodo del store para iniciar sesión con google usando metodo se AuthService
            return AuthService.googleLogin(id_token).then(
                newUser => {
                    commit('loginSuccess', newUser);//cambio del estado a inicio de sesión exitoso
                    return Promise.resolve(newUser);
                },
                error => {
                    commit('loginFailure');//cambio de estado a error en inicio de sesión
                    return Promise.reject(error);
                })
        },
        facebookLogin({ commit },id_token){//metodo del store para iniciar sesión con facebook usando metodo se AuthService
            return AuthService.facebookLogin(id_token).then(
                newUser => {
                    commit('loginSuccess', newUser);//cambio del estado a inicio de sesión exitoso
                    return Promise.resolve(newUser);
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
        },
        getUser({ commit }) {//metodo del store para obtener usario usando metodo se AuthService
            return AuthService.getUser().then(
                response => {
                    return Promise.resolve(response);
                },
                error => {
                    commit('getUserFailure');//cambio de estado a usuario no obtenido
                    return Promise.reject(error);
                }
            );
        },
        saveChanges({ commit }, user) {//metodo del store para guardar cambios en usuario usando metodo se AuthService
            return AuthService.saveChanges(user).then(
                response => {
                    return Promise.resolve(response.data);
                },
                error => {
                    commit('changesFailure');//cambio de estado a cambios no guardados
                    return Promise.reject(error);
                }
            );
        },
        },
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
        },
        getUserFailure(state){
            state.status.loggedIn = true;
        },
        changesSaved(state){
            state.status.loggedIn = true;
        },
        changesFailure(state){
            state.status.loggedIn = true;
        }
    }
};