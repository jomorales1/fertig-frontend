<template>
  <div id="app" >
<!--    Barra de navegación-->
    <b-navbar toggleable="md" type="dark" variant="primary" >
      <b-navbar-brand to="/" class="btn">Fertig</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
<!--          links de la pagina-->
          <b-nav-item variant="primary" v-if="!loggedIn" text="white" to="/SignUp" >Regístrate</b-nav-item>
          <b-nav-item variant="primary" v-if="!loggedIn" text="white" to="/Login" >Inicia sesión</b-nav-item>
          <b-nav-item variant="primary" v-if="loggedIn" text="white" to="/List" >Lista de Actividades</b-nav-item>
          <b-nav-item variant="primary" v-if="loggedIn" text="white" to="/Calendar" >Calendario de Actividades</b-nav-item>
          <b-nav-item variant="primary" v-if="loggedIn" text="white" to="/Timer" >Temporizador</b-nav-item>
<!--          Dropdown de usuario-->
          <b-nav-item-dropdown :text="username" v-if="loggedIn" right>
            <b-dropdown-item v-b-modal.friends >Amigos</b-dropdown-item>
            <b-dropdown-item to="/Settings">Ajustes de cuenta</b-dropdown-item>
            <b-dropdown-item @click="logout">Cerrar sesión</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
<!--    componente para la administracion de amigos-->
    <Amigos/>
    <!--    se llama a la vista de roter para que funcionen los links-->
    <router-view/>
    <!--    componente para api de facebook-->
    <v-facebook-login-scope app-id="1472299989621414" @sdk-init="handleSdkInit"/>
  </div>
</template>

<script>
import { VFBLoginScope as VFacebookLoginScope } from 'vue-facebook-login-component'
import Amigos from "@/components/Amigos";
export default {
  name: 'App',
  data(){
    return{
    //objeto de API facebook
    FB:{}
    }
  },
  components:{
    Amigos,
    VFacebookLoginScope
  },
  methods:{
    logout(){
      //verifica si esta logeado con facebook y cierra sesión si así es
      this.FB.getLoginStatus(function (response){
        if(response.status==='connected'){
          this.FB.logout()
        }
      })
      //llama al logout del store
      this.$store.dispatch('auth/logout').then(()=>this.$router.push('/Login'))
    },
    handleSdkInit({ FB}) {
      this.FB = FB//trae el objeto de facebook desde el sdkInit
    }
  },
  watch: {
    //vigilar la ruta para cambiar el titiulo de la pagina
    '$route' (to) {
      document.title =  'FertigApp - '+to.name
    }
  },
  computed:{
    loggedIn(){
      return this.$store.state.auth.status.loggedIn
    },
    username(){//obtencion del usuario para el dropdown de usuario
      return this.loggedIn?this.$store.state.auth.user.name:null
    }
  },
  created() {//titulo inicial de la pagina
    document.title = 'FertigApp - '+this.$route.name
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
