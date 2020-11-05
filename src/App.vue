<template>
  <div id="app" >
<!--    Barra de navgación-->
    <b-navbar toggleable="md" type="dark" variant="primary" >
      <b-navbar-brand to="/" class="btn">Fertig</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
<!--          links de la pagina-->
          <b-nav-item variant="primary" v-if="!loggedIn" text="white" to="/SignUp" >Regístrate</b-nav-item>
          <b-nav-item variant="primary" v-if="!loggedIn" text="white" to="/Login" >Inicia sesión</b-nav-item>
          <b-nav-item variant="primary" v-if="loggedIn" text="white" to="/List" >Lista de Actividades</b-nav-item>
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
<!--    Modal de Amigos-->
    <b-modal id="friends" title="Amigos"  hide-footer>
      <div class="d-flex my-2">
        <b-input placeholder="Buscar" class="mr-2"></b-input>
        <b-button size="sm" class="my-2 my-sm-0" type="submit">
          <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24px" height="24px"><path d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z"/></svg>
        </b-button>
      </div>
      <b-list-group>
        <b-list-group-item
            v-for="amigo in [1,2,3,4,5,6,7]"
            v-bind:key="amigo"
        >
          <b-avatar></b-avatar>
          <span> Mi amigo {{amigo}}</span>
          <b-button variant="danger" size="sm" class="rounded-circle float-right align-text-bottom my-1" style="white-space: pre"> - </b-button>
        </b-list-group-item>
        <b-list-group-item>
          <b-avatar></b-avatar>
          <span> Mi amigo 1</span>
          <b-button variant="success" size="sm" class="rounded-circle float-right align-text-bottom my-1" style="white-space: pre"> + </b-button>
        </b-list-group-item>
      </b-list-group>
    </b-modal>
    <!--    se llama a la vista de roter para que funcionen los links-->
    <router-view/>
    <!--    componente para api de facebook-->
    <v-facebook-login-scope app-id="1472299989621414" @sdk-init="handleSdkInit"/>
  </div>
</template>

<script>
import { VFBLoginScope as VFacebookLoginScope } from 'vue-facebook-login-component'
export default {
  name: 'App',
  data(){
    return{
    //objeto de API facebook
    FB:{}
    }
  },
  components:{
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
    '$route' (to) {
      document.title =  'FertigApp - '+to.name
    }
  },
  computed:{
    loggedIn(){
      return this.$store.state.auth.status.loggedIn
    },
    username(){
      return this.loggedIn?this.$store.state.auth.user.name:null
    }
  },
  created() {
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
