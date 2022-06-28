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
                      label="Nueva contraseña">
                    <!-- required para que no pase nada si no está lleno el campo-->

                      <b-form-input v-model="password" required type="password" placeholder="Password"></b-form-input>

                  </b-form-group>

                  <b-form-group
                      label="Confirmar contraseña">

                      <b-form-input v-model="password_confirmation" required type="password" placeholder="Password"></b-form-input>


                  </b-form-group>
                  <b-form-group>
                    <!--se desabilita el boton si los campos no estan llenos o no cumplen con los requisitos-->
                    <b-button type="submit">Cambiar contraseña</b-button>
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
  name: "ResetPassword",
  components: {
  },
  data(){
    return{
      model:{},
      scope:{},
      password:'',
      password_confirmation:'',
      message: ''
    }
  },

  methods: {
    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    },
    onSubmit() {
      if (this.password !== this.password_confirmation) {
        document.getElementById("stringErrorOrSuccess").style["color"] = "red";
        this.message ="Los campos ingresados no coinciden";
      } else {
        console.log(this.$route.query.email);
        axios.post(API_URL + '/user/save-password', {}, {
            params: {
                'email': this.$route.query.email,
                'password': this.password,
                'token': this.$route.query.token
            }
        }).then(() => {
            document.getElementById("stringErrorOrSuccess").style["color"] = "green";
            this.message = "Contraseña actualizada. Redirigiendo a página principal...";
            this.delay(5000).then(() => this.$router.push('/Login'));
        }).catch((error) => {
            document.getElementById("stringErrorOrSuccess").style["color"] = "red";
            this.message ="Error al momento de actualizar la contraseña. Intente de nuevo más tarde.";
            console.log(error);
        })
      }
    },
  }
  }
</script>

<style scoped>
</style>