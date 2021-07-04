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
        name:'Inicio de Sesión',
        component:()=>import('@/views/Login.vue'),
        meta: {
            requiresAuth: false
        }
    },{
        path:'/reset-password',//ruta (localhost:8080/SignUp)
        name:'Restablecer contraseña',
        component:()=>import('@/views/ResetPassword.vue'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: false
        }
    },{
        path:'/change-password/:token',//ruta (localhost:8080/SignUp)
        name:'Restablecer contraseña',
        component:()=>import('@/views/ChangePassword.vue'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: false
        }
    },{
        path:'/SignUp',//ruta (localhost:8080/SignUp)
        name:'Crear Cuenta',
        component:()=>import('@/views/SignUp'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: false
        }
    },{
        path:'/List',//ruta (localhost:8080/List)
        name:'Lista de Actividades',
        component:()=>import('@/views/List'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }
    },{
        path:'/Settings',//ruta (localhost:8080/Settings)
        name:'Ajustes de la Cuenta',
        component:()=>import('@/views/Settings'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }
    },{
        path:'/Timer',//ruta (localhost:8080/Settings)
        name:'Temporizador',
        component:()=>import('@/views/Timer'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }
    }, {
        path: '/Share/:type/:id',//ruta (localhost:8080/Settings)
        name: 'Copia la tarea',
        component: () => import('@/views/Share'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }

    }, {
        path: '/Calendar',//ruta (localhost:8080/Settings)
        name: 'Calendario de actividades',
        component: () => import('@/views/Calendar'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }
    },{
        path:'/Progress',//ruta (localhost:8080/Settings)
        name:'Progreso',
        component:()=>import('@/views/Progress'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: true
        }
    }, {
        path: '/Privacy',//ruta (localhost:8080/Privacy)
        name: 'Politica de privacidad',
        component: () => import('@/views/PrivacyPolicy'),//componente que ocupa esa vista a partir de carpeta views
        meta: {
            requiresAuth: false
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
    const publicPages = ['/Login', '/SignUp', '/','/Privacy'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    // tratando de acceder a una pagina restringida + sesión no iniciada
    if (authRequired && !loggedIn) {
        // redireccion al login
        next({path:'/Login',query: { nextUrl: to.fullPath }});
    } else {
        next();
    }
});
export default router