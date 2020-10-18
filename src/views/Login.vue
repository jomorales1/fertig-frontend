<template>
  <div class="align-self-center">
    <b-container>
      <b-overlay :show="loading" rounded="sm">
        <b-row class ="justify-content-md-center "><!-- para centrar en la pantalla-->
          <b-col col md="6" >
            <h1>Fertig</h1>
            <b-card
                header="Login"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
            >
              <b-card-text >
                <!-- no pasa nada hasta que se hace el 'registrarse'-->
                <b-form @submit.prevent="onSubmit">
                  <b-form-group
                      label="username">
                    <!-- required para que no pase nada si no está lleno el campo-->

                      <b-form-input v-model="username" required  placeholder="username"></b-form-input>

                  </b-form-group>

                  <b-form-group
                      label="Contraseña">

                      <b-form-input v-model="password"  required type="password" placeholder="*******"></b-form-input>


                  </b-form-group>
                  <b-form-group>
                    <!--se desabilita el boton si los campos no estan llenos o no cumplen con los requisitos-->
                    <b-button type="submit" >Iniciar sesión</b-button>
                  </b-form-group>
                  <b-form-group>
                    <b-button @click="$router.push('/SignUp')">Registrarse</b-button>
                  </b-form-group>
                  <span id="stringErrorContrasenna" style="color: red">{{message}}</span>

                </b-form>
                <div class="d-flex justify-content-around flex-wrap">
                  <b-button class="OauthBtn" @click="handleGoogle" v-if="!isSignIn" variant="outline-secondary" :disabled="!isInit">
                    <div class="d-flex">
                      <img alt="Google logo" class="googleIcon"  src="../assets/google.svg">
                      <div>
                        Continuar con Google
                      </div>
                    </div>
                  </b-button>
                  <v-facebook-login @login="handleFacebook" sdk-locale="es_LA" @sdk-init="handleSdkInit" app-id="1472299989621414" class="btn OauthBtn">
                    <template v-slot:login>
                      Continuar con Facebook
                    </template>
                  </v-facebook-login>
<!--                  <button @click="handleFacebook" v-if="isSignIn" :disabled="!isInit">signOout</button>-->
                </div>
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
      </b-overlay>
    </b-container>

  </div>
</template>

<script>

import User from "@/models/User";
import VFacebookLogin from 'vue-facebook-login-component'

export default {
  name: "Login",
  components: {
    VFacebookLogin
  },
  data(){
    return{
      FB:{},
      model:{},
      scope:{},
      password:'',
      username:'',
      user: new User('',''),
      loading: false,
      message: '',
      isInit: false,
      isSignIn: false
    }
  },

  methods: {
    //Trae los ojetos de facebook desde el sdkInit
    handleSdkInit({ FB, scope }) {
      this.FB = FB
      this.scope = scope
    },
    onSubmit() {
      //metodo de inicio de sesión
      //añadrir los datos de formulario a el objeto user
      this.user.username=this.username
      this.user.password=this.password
      //si ningun campo esta vacio llamar metodo del store de vuex
      if (this.user.username && this.user.password) {
        this.loading = true;
        this.$store.dispatch('auth/login', this.user).then(
            () => {
              //si inicio sesión redirigir a lista
              this.$router.push('/List');
            },
            () => {
              //si hubo error mostrarlo en pantalla
              this.loading = false;
              this.message ="Error en inicio de sesión, por favor revisa el usuario y la contraseña"
            }
        );
      }
    },
    //metodo de inicio de sesión con google
    handleGoogle(){
      this.loading = true;
      this.$gAuth.signIn()
          .then(user => {
            //peticion de inicio de sesión con el token de google
            this.$store.dispatch("auth/googleLogin",user.getAuthResponse().id_token).then(
                () => {
                  //guardar el token en el storage para inicio de sesión automatico
                  localStorage.setItem("googleUser",JSON.stringify(user.getAuthResponse().id_token))
                  //si inicio sesión redirigir a lista
                  this.$router.push('/List');
                },
                (error) => {
                  //si hubo error mostrarlo en pantalla
                  this.message =error.response.data
                  this.loading = false;
                }
            );
            this.isSignIn = this.$gAuth.isAuthorized
          })
          .catch(()  => {
            this.message ="Error de comunicación con Google"
            this.loading = false;
          })
    },
    handleFacebook(){
      this.loading = true;
      //peticion de inicio de sesión con el token de google
      this.$store.dispatch("auth/facebookLogin",this.FB.getAccessToken()).then(
          () => {
            //si inicio sesión redirigir a lista
            this.$router.push('/List');
          },
          (error) => {
            //si hubo error mostrarlo en pantalla
            this.message =error.response.data
            this.loading = false;
          }
      );
    }
  },
  mounted(){
    let that = this
    //verificar estado de la sesión de google
    let checkGauthLoad = setInterval(function(){
      that.isInit = that.$gAuth.isInit
      that.isSignIn = that.$gAuth.isAuthorized
      if(that.isSignIn){
        let user=JSON.parse(localStorage.getItem("googleUser"))
        //cerrar sesión en google si se cerro la sesión en la pagina
        if(user==null){
          that.googleLogout()
          return
        }
        // iniciar sesión automaticamente si inicio sesión con google
        that.$store.dispatch("auth/googleLogin",user).then(()=>{
          that.$router.push('/list')
        })
      }
      if(that.isInit) clearInterval(checkGauthLoad)
    }, 1000);
  },

  computed:{    //variable de sesión
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
    created() {
      //si ya se inicio sesión redirigir directamente a lista
      if (this.loggedIn) {
        this.$router.push('/List');
      }
    }
  }
</script>

<style scoped>
.googleIcon{
  height: 1.5rem;
  margin-right: 0.5rem;
}
.OauthBtn{
  margin-bottom: 1rem;
}
</style>