import Vue from 'vue'
import Inicio from "@/views/Home";
import VueRouter from "vue-router";

Vue.use(VueRouter)

const routes=[
    {
        path:'/',
        name:'Inicio',
        component:Inicio,
        meta: {
            requiresAuth: false
        }
    },{
        path:'/Login',
        name:'Inicio de sesión',
        component:()=>import('@/views/Login.vue'),
        meta: {
            requiresAuth: true
        }
    },{
        path:'/SignUp',
        name:'Crear Cuenta',
        component:()=>import('@/views/SignUp'),
        meta: {
            requiresAuth: true
        }
    },{
        path:'/List',
        name:'Lista de actividades',
        component:()=>import('@/views/List'),
        meta: {
            requiresAuth: true
        }
    },{
        path:'/Settings',
        name:'Ajustes de la cuenta',
        component:()=>import('@/views/Settings'),
        meta: {
            requiresAuth: true
        }
    }
]
const router = new VueRouter({
    mode : 'history',
    base: process.env.BASE_URL,
    routes
})
// router.beforeEach((to, from, next) => {
//     const publicPages = ['/Login', '/SignUp', '/'];
//     const authRequired = !publicPages.includes(to.path);
//     const loggedIn = localStorage.getItem('user');
//
//     // trying to access a restricted page + not logged in
//     // redirect to login page
//     if (authRequired && !loggedIn) {
//         next('/Login');
//     } else {
//         next();
//     }
// });
export default router