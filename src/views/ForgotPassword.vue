<template>
  <div class="align-self-center my-5">
    <b-container>
        <b-row class ="justify-content-md-center "><!-- para centrar en la pantalla-->
          <b-col col md="6" >
            <h1>Fertig</h1>
            <b-card
                header="Cambiar contraseña"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
            >
              <b-card-text >
                <!-- no pasa nada hasta que se hace el 'registrarse'-->
                <b-form @submit.prevent="onSubmit">
                  <b-form-group
                      label="Correo electrónico">
                    <!-- required para que no pase nada si no está lleno el campo-->

                      <b-form-input v-model="email" required  placeholder="Correo electrónico"></b-form-input>

                  </b-form-group>

                  <b-form-group
                      label="Confirmar correo electrónico">

                      <b-form-input v-model="email_confirmation" placeholder="Correo electrónico"></b-form-input>


                  </b-form-group>
                  <b-form-group>
                    <!--se desabilita el boton si los campos no estan llenos o no cumplen con los requisitos-->
                    <b-button type="submit">Enviar token para cambio de contraseña</b-button>
                  </b-form-group>
                  <span id="stringErrorOrSuccess" style="color: red">{{message}}</span>

                </b-form>
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
    </b-container>

  </div>
</template>

<script>
import axios from 'axios'
const API_URL = 'http://localhost:8090'

export default {
  name: "ForgotPassword",
  components: {
  },
  data(){
    return{
      model:{},
      scope:{},
      email:'',
      email_confirmation:'',
      message: ''
    }
  },

  methods: {
    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    },
    onSubmit() {
      if (this.email !== this.email_confirmation) {
        document.getElementById("stringErrorOrSuccess").style["color"] = "red";
        this.message ="Error en inicio de sesión, por favor revisa el usuario y la contraseña";
      } else {
        axios.post(API_URL + '/user/reset-password', {}, {
            params: {
                'email': this.email
            }
        }).then(() => {
            document.getElementById("stringErrorOrSuccess").style["color"] = "green";
            this.message = "Correo electrónico enviado. Redirigiendo a página principal...";
            this.delay(5000).then(() => this.$router.push('/Login'));
        }).catch((error) => {
            document.getElementById("stringErrorOrSuccess").style["color"] = "red";
            this.message ="Error al momento de enviar el correo. Por favor intenta más tarde.";
            console.log(error);
        })
      }
    },
  }
  }
</script>

<style scoped>
</style>