import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from '@/router';
import store from '@/store';
import * as VeeValidate from 'vee-validate';
import 'es6-promise/auto'
import GAuth from 'vue-google-oauth2'
import { ValidationProvider } from 'vee-validate';
//libreria de google
//Todavia no funciona
const gauthOption = {
    clientId: '699443937997-uq28jn89e4d89aqpob3cc79ab4o2aa6i.apps.googleusercontent.com',
    scope: 'profile email',
    prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)
//flag de servidor de produccion falso
Vue.config.productionTip = false
//adicion de vee-validate
Vue.component('ValidationProvider', ValidationProvider);
Vue.use(VeeValidate)

//inicializar aplicación
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
