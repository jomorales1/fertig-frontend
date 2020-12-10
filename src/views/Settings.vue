<template>
  <div class="align-self-center my-5">
    <b-container> <!-- Contenedor titulo y formulario de registro !-->
      <b-row  class ="justify-content-md-center ">
        <div class="col-md-6" >
          <h1>Fertig</h1>
          <b-card header="Configuraciones"
                  border-variant="primary"
                  header-bg-variant="primary"
                  header-text-variant="white"><!-- Etiqueta para definir bordes del formulario !-->
            <b-form id="form_registro" @submit.prevent="saveChanges" > <!-- Formulario de registro !-->
              <b-form-group ><!-- Campo nombre !-->
                <div class="form-row">
                  <label class="col-form-label">Nombre: </label>
                  <b-form-input id="nombre" required placeholder="Ingrese el nombre" v-model="Settings_form.name">{{this.Settings_form.name}}</b-form-input>
                </div>
              </b-form-group>
              <b-form-group ><!-- Campo nombre de usuario !-->
                <div class="form-row">
                  <label class="col-form-label">Usuario: </label>
                  <b-form-input id="usuario" required placeholder="Ingrese el usuario" v-model="Settings_form.username"></b-form-input>
                </div>
              </b-form-group>
              <b-form-group ><!-- Campo correo !-->
                <div class="form-row">
                  <label class="col-form-label">Correo: </label>
                  <b-form-input id="email" required placeholder="Ingrese el correo" v-model="Settings_form.email"></b-form-input>
                </div>
              </b-form-group>
              <b-form-group ><!-- Check cambio contrase;a !-->
                <div class="form-row">
                  <b-form-checkbox @change="change" id="check" >Cambiar contraseña: </b-form-checkbox>
                </div>
              </b-form-group>
              <b-form-group ><!-- Campo contraseña !-->
                <div class="form-row">
                  <label class="col-form-label">Nueva contraseña: </label>
                  <b-form-input type="password" id="newPassword" required placeholder="Ingrese la Nueva contraseña" v-model="Settings_form.newPassword" :disabled="changePassword"></b-form-input>
                </div>
              </b-form-group>
              <b-form-group><!-- Campo repetir contraseña !-->
                <div class="form-row">
                  <label class="col-form-label">Repetir contraseña: </label>
                  <b-form-input type="password" id="reviewNewPassword" required placeholder="Confirme la contraseña" v-model="Settings_form.reviewNewPassword" :disabled="changePassword"></b-form-input>
                </div>
              </b-form-group>
              <b-form-group>
                <b-form-checkbox class="my-2" v-model="privacy">¿Acepta nuestra <router-link to="/Privacy">politica de privacidad</router-link>?</b-form-checkbox>
              </b-form-group>
              <b-form-group><!-- Botones de registrar y vaciar !-->
                <div class="form-row " >
                  <b-button :disabled="!privacy" type="submit" class="col text-center" variant="primary">Cambiar datos</b-button>
                </div>
              </b-form-group>
              <!-- Alert en caso de error y éxito en registro !-->
              <b-alert variant="primary" :show="registerSuccess">Cambios guardados</b-alert>
              <b-alert variant="danger" :show="failSuccess">Error en registro</b-alert>
            </b-form>
          </b-card>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>

  import User from "../models/User";
  export default {
    name: "SignUp",
    data(){
      return {
        // campos del formulario de registro Settings_form
        Settings_form: {
          name: '',
          username: '',
          email: '',
          newPassword:'',
          reviewNewPassword: ''
        },
        // String del error
        stringError: '',
        changePassword: true,
        registerSuccess: false,
        failSuccess: false,
        privacy:false
      }
    },
    methods:{
      saveChanges(){ //Metodo de guardar cambios
        if(this.changePassword === false){
          if(this.Settings_form.newPassword === this.Settings_form.reviewNewPassword && this.Settings_form.newPassword !== "" && this.Settings_form.reviewNewPassword !== ""){
              let dataUser = new User(this.Settings_form.username, this.Settings_form.newPassword, this.Settings_form.email, this.Settings_form.name)
              this.$store.dispatch("auth/saveChanges", dataUser) // Llamada a la función de axios creada para registro
                      .then(data => {
                        this.registerSuccess = true
                        this.failSuccess = false
                        console.log(data)
                      },error =>{
                        console.log(error)
                        this.failSuccess = true
                        this.registerSuccess = false
                        this.stringError = "Error en registro"

                      })

            }else{
              this.failSuccess = true
              this.registerSuccess = false
              this.stringError = "Contraseña no verificada"
            }

        }else{
          let dataUser = new User(this.Settings_form.username, this.Settings_form.newPassword, this.Settings_form.email, this.Settings_form.name)
          this.$store.dispatch("auth/saveChanges", dataUser) // Llamada a la función de axios creada para registro
                  .then(data => {
                    this.registerSuccess = true
                    this.failSuccess = false
                    console.log(data)
                  },error =>{
                    console.log(error)
                    this.failSuccess = true
                    this.registerSuccess = false
                    this.stringError = "Error en registro"

                  })
        }

      },
      change(){
        this.changePassword = !this.changePassword
      }
    },
    mounted() {
      this.$store.dispatch("auth/getUser")
      .then(response => {
        this.Settings_form.name = response.data.nombre;
        this.Settings_form.email = response.data.correo;
        this.Settings_form.username = response.data.usuario;
      })
    }
  }
</script>
