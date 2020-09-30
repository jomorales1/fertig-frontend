import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from '@/router';
import store from '@/store';
import * as VeeValidate from 'vee-validate';
import 'es6-promise/auto'

Vue.config.productionTip = false
Vue.use(VeeValidate)

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
