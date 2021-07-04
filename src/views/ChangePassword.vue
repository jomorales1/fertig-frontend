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
                  <b-form-group label="Contraseña">
                    <!-- required para que no pase nada si no está lleno el campo-->
                    <b-form-input v-model="password" type="password" required placeholder="Contraseña"></b-form-input>
                  </b-form-group>

                  <b-form-group label="Confirmar contraseña">
                    <!-- required para que no pase nada si no está lleno el campo-->
                    <b-form-input v-model="repeatPassword" type="password" required placeholder="Confirmar contraseña"></b-form-input>
                  </b-form-group>

                  <b-form-group>
                    <!--se desabilita el boton si los campos no estan llenos o no cumplen con los requisitos-->
                    <b-button type="submit" >Cambiar contraseña</b-button>
                  </b-form-group>

                  <span id="stringErrorContrasenna" style="color: red">{{error}}</span>
                  <div v-if="message">
                    {{message}}
                  </div>
                </b-form>
              </b-card-text>
            </b-card>
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
      token: '',
      message: '',
      password: '',
      repeatPassword: '',
      error: '',
    }
  },

  beforeMount() {
    this.token = this.$route.params.token;
  },

  methods: {
    async onSubmit() {
      if (this.password !== this.repeatPassword) {
        this.error = "Las contraseñas no coinciden";
      } else {
        try {
          const obj = {
            password: this.password,
            token: this.token
          };
          this.message = await this.$store.dispatch("auth/changePassword", obj) + ', contraseña actualizada';
        } catch (error) {
          this.error = "Error cambiando la contraseña";
          console.log(error);
        }
      }
    },
  },
}
</script>