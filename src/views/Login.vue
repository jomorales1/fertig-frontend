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
                Botones de google
                <b-form-group>
                  <button @click="handleClickSignIn" v-if="!isSignIn" :disabled="!isInit">signIn</button>
                  <button @click="handleClickSignOut" v-if="isSignIn" :disabled="!isInit">signOout</button>
                </b-form-group>
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


export default {
  name: "Login",
  components: {

  },
  data(){
    return{
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
    //metodos de google no funcionales
    handleClickSignIn(){
      this.loading = true;
      this.$gAuth.signIn()
          .then(user => {
            this.$store.dispatch("auth/googleLogin",user.getAuthResponse().id_token).then(
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
            this.isSignIn = this.$gAuth.isAuthorized
          })
          .catch(()  => {
            // On fail do something
          })
    },
    handleClickSignOut(){
      this.$gAuth.signOut()
          .then(() => {
            // On success do something
            this.isSignIn = this.$gAuth.isAuthorized
          })
          .catch(()  => {
            // On fail do something
          })
    }
  },
  mounted(){
    let that = this
    let checkGauthLoad = setInterval(function(){
      that.isInit = that.$gAuth.isInit
      that.isSignIn = that.$gAuth.isAuthorized
      if(that.isInit) clearInterval(checkGauthLoad)
    }, 1000);
  },

  computed:{
    /*acceptableSub(){
      return this.Correo.length > 0 && this.Password.length > 0 ? false:true
    },*/
    //variable de sesión
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
    created() {
    //si ya se inicio sesión redirigir directamente a lista
    if (this.loggedIn) {
      this.$router.push('/List');
    }
  },
  }
</script>

<style scoped>

</style>