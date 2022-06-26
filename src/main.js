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
const gauthOption = {
    clientId: '756516316743-7fcc8028epqmhnftjeclt9dqo0dk3tls.apps.googleusercontent.com',
    scope: 'profile email',
    prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)
//flag de servidor de produccion falso
Vue.config.productionTip = false
//adicion de vee-validate
Vue.component('ValidationProvider', ValidationProvider);
Vue.use(VeeValidate);
import VueSanitize from "vue-sanitize";
Vue.use(VueSanitize);

//inicializar aplicación
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
