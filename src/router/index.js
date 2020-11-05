import Vue from 'vue'
import Inicio from "@/views/Home";
import VueRouter from "vue-router";
//adición de router para tener varios links
Vue.use(VueRouter)

//deficion de rutas existentes en la pagina

const routes=[
    {
        path:'/',//ruta (localhost:8080/)
        name:'Inicio',//nombre de ruta
        component:Inicio,//componente que ocupa esa vista
        meta: {
            requiresAuth: false//flag para saber si esta ruta necesita tener sesión iniciada
        }
    },{
        path:'/Login',//ruta (localhost:8080/Login)
        name:'Inicio de sesión',
        component:()=>import('@/views/Login.vue'),
        meta: {
            requiresAuth: true
        }
    },{
        path:'/SignUp',//ruta (localhost:8080/SignUp)
        name:'Crear Cuenta',
        component:()=>import('@/views/SignUp'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }
    },{
        path:'/List',//ruta (localhost:8080/List)
        name:'Lista de actividades',
        component:()=>import('@/views/List'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }
    },{
        path:'/Settings',//ruta (localhost:8080/Settings)
        name:'Ajustes de la cuenta',
        component:()=>import('@/views/Settings'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }
    },{
        path:'/Timer',//ruta (localhost:8080/Timer)
        name:'Reloj',
        component:()=>import('@/views/Timer'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }
    }
]
//declracion del router
const router = new VueRouter({
    mode : 'history',
    base: process.env.BASE_URL,
    routes
})
//metodo para redirigir a Login si se intenta acceder a una pagina que requiere iniciar sesión
//sin haber iniciado sesión
router.beforeEach((to, from, next) => {
    const publicPages = ['/Login', '/SignUp', '/'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    // tratando de acceder a una pagina restringida + sesión no iniciada
    if (authRequired && !loggedIn) {
        // redireccion al login
        next('/Login');
    } else {
        next();
    }
});
export default router