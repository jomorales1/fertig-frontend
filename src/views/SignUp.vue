<template>
  <div id="app">
    <b-container>
      <b-row class ="justify-content-md-center "><!-- para centrar en la pantalla-->
        <b-col col md="8">
          <b-card header="SignUp">
            <b-card-text >
              <!-- no pasa nada hasta que se hace el 'registrarse'-->
              <b-form @submit="onSubmit">
                <b-form-group
                    description="Ingrese su correo"
                    label="Correo">
                  <!-- required para que no pase nada si no está lleno el campo-->
                  <b-form-input v-model="correo" required></b-form-input>
                </b-form-group>
                <b-form-group
                    description="Ingrese su nombre"
                    label="Nombre">
                  <b-form-input v-model="NombredeUsuario" required></b-form-input>
                </b-form-group>
                <b-form-group
                    description="Ingrese su contraseña"
                    label="Contraseña">
                  <b-form-input v-model="Contraseña" required type="password"></b-form-input>
                </b-form-group>
                <b-form-group
                    description="Repita su contraseña"
                    label="repetir contraseña">
                  <b-form-input v-model="RepetirContraseña" required type="password"></b-form-input>
                </b-form-group>
                <b-form-group>
                  <!--se desabilita el boton si los campos no estan llenos o no cumplen con los requisitos-->
                  <b-button type="submit" :disabled="acceptableSub">Registrarse</b-button>
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
  name: "SignUp",
  components: {

  },
  data(){
    return{
      correo: '',
      NombredeUsuario:'',
      Contraseña:'',
      RepetirContraseña:''
    }
  },
  methods:{
    // eslint-disable-next-line no-unused-vars
    onSubmit(event){
      alert(this.correo +' '+ this.NombredeUsuario+ ' '+this.Contraseña )
    }
  },
  computed:{
    acceptableSub(){
      return this.correo.length > 0 && this.NombredeUsuario.length > 0 && this.Contraseña.length > 0 && (this.Contraseña == this.RepetirContraseña) ? false:true
    }
  }
}
</script>

<style scoped>

</style>