<template>
  <div id="app">
    <b-container>
      <b-row class ="justify-content-md-center "><!-- para centrar en la pantalla-->
        <b-col col md="8" >
          <b-card
              header="Login"
              border-variant="primary"
              header-bg-variant="primary"
              header-text-variant="white"
          >
            <b-card-text >
              <!-- no pasa nada hasta que se hace el 'registrarse'-->
              <b-form @submit="onSubmit">
                <b-form-group
                    label="Correo">
                  <!-- required para que no pase nada si no está lleno el campo-->
                  <b-form-input v-model="Correo" required></b-form-input>
                </b-form-group>

                <b-form-group
                    label="Contraseña">
                  <b-form-input v-model="Password"  required type="password"></b-form-input>
                </b-form-group>
                <b-form-group>
                  <!--se desabilita el boton si los campos no estan llenos o no cumplen con los requisitos-->
                  <b-button type="submit" :disabled="acceptableSub">Iniciar sesión</b-button>
                </b-form-group>
                <b-form-group>
                  <b-button href="/Login">Registrarse</b-button>
                </b-form-group>
              </b-form>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>

export default {
  name: "Login",
  components: {

  },
  data(){
    return{
      Correo: '',
      Password:''
    }
  },
  methods:{
    // eslint-disable-next-line no-unused-vars
    onSubmit(event){
      alert(this.Correo + ' '+this.Password )
    }
  },
  computed:{
    acceptableSub(){
      return this.Correo.length > 0 && this.Password.length > 0 ? false:true
    }
  }
}
</script>

<style scoped>

</style>