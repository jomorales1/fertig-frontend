<template>
  <div class="align-self-center my-5">
    <b-container>
      <b-overlay :show="loading" rounded="sm">
        <b-row class ="justify-content-md-center "><!-- para centrar en la pantalla-->
          <b-col col md="6" >
            <h1>Fertig</h1>
            <b-card
                header="Restablecer contraseña"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white"
            >
              <b-card-text >
                <!-- no pasa nada hasta que se hace el 'registrarse'-->
                <b-form @submit.prevent="onSubmit">
                  <b-form-group label="Correo electrónico">
                    <!-- required para que no pase nada si no está lleno el campo-->
                    <b-form-input v-model="email" required placeholder="email"></b-form-input>
                  </b-form-group>

                  <b-form-group>
                    <!--se desabilita el boton si los campos no estan llenos o no cumplen con los requisitos-->
                    <b-button type="submit" >Recuperar contraseña</b-button>
                  </b-form-group>

                  <span id="stringErrorContrasenna" style="color: red">{{error}}</span>
                </b-form>
              </b-card-text>
            </b-card>

            <div v-if="message">
              Solicitud enviada, para restablecer su contraseña haga click
              <router-link :to="message">aquí</router-link>
            </div>
          </b-col>
        </b-row>
      </b-overlay>
    </b-container>

  </div>
</template>

<script>

export default {
  name: "ResetPassword",

  data() {
    return {
      email: '',
      message: '',
      error: '',
    }
  },

  methods: {
    async onSubmit() {
      try {
        this.message = await this.$store.dispatch("auth/resetPassword", this.email);
        this.message = this.message.replace(/localhost:8080/, 'change-password');
      } catch (error) {
        this.error = "El correo electrónico dado no es válido";
        console.log(error);
      }
    },
  },
}
</script>