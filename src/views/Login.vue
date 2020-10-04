<template>
  <div class="align-self-center">
    <b-container>
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
                  <ValidationProvider name="username" rules="required">
                    <b-form-input v-model="username" required  placeholder="username"></b-form-input>
                  </ValidationProvider>
                </b-form-group>

                <b-form-group
                    label="Contraseña">
                  <ValidationProvider name="password" rules="required">
                    <b-form-input v-model="password"  required type="password" placeholder="*******"></b-form-input>
                  </ValidationProvider>

                </b-form-group>
                <b-form-group>
                  <!--se desabilita el boton si los campos no estan llenos o no cumplen con los requisitos-->
                  <b-button type="submit" >Iniciar sesión</b-button>
                </b-form-group>
                <b-form-group>
                  <b-button href="/SignUp">Registrarse</b-button>
                </b-form-group>


              </b-form>
              <b-form-group>
                <button @click="handleClickGetAuth" :disabled="!isInit">get auth code</button>
                <button @click="handleClickSignIn" v-if="!isSignIn" :disabled="!isInit">signIn</button>
                <button @click="handleClickSignOut" v-if="isSignIn" :disabled="!isInit">signOout</button>
              </b-form-group>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
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
      this.user.username=this.username
      this.user.password=this.password
      alert('bbbbbbbbbbbbbb')
      this.loading = true;
      this.$validator.validateAll().then(() => {
        // if (!isValid) {
        //   alert('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        //   this.loading = false;
        //   return;
        //
        // }

        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
              () => {
                alert('praise the sun')
                this.$router.push('/List');
              },
              error => {
                this.loading = false;
                this.message =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
              }
          );
        }
      });
    },
    handleClickGetAuth(){
      this.$gAuth.getAuthCode()
          .then(authCode => {
            // On success
            alert(authCode)
            // return this.$http.post('http://your-backend-server.com/auth/google', { code: authCode, redirect_uri: 'postmessage' })
          })
          .then(() => {
            // And then
          })
          .catch(() => {
            // On fail do something
          })
    },
    handleClickSignIn(){
      this.$gAuth.signIn()
          .then(() => {
            // On success do something, refer to https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetid
            // console.log('user', GoogleUser)
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
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
    created() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  }
</script>

<style scoped>

</style>