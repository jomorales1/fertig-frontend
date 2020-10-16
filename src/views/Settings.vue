<template>
  <div class="align-self-center">
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
              <b-form-group ><!-- Campo correo !-->
                <div class="form-row">
                  <input type="checkbox" id="check" @click="change">
                  <label  for="check">Cambiar contraseña: </label>
                </div>
              </b-form-group>
              <b-form-group ><!-- Campo contraseña !-->
                <div class="form-row">
                  <label class="col-form-label">Contraseña Actual: </label>
                  <b-form-input type="password" id="password" required placeholder="Ingrese la contraseña actual" v-model="Settings_form.password" disabled></b-form-input>
                </div>
              </b-form-group>
              <b-form-group ><!-- Campo contraseña !-->
                <div class="form-row">
                  <label class="col-form-label">Nueva contraseña: </label>
                  <b-form-input type="password" id="newPassword" required placeholder="Ingrese la Nueva contraseña" v-model="Settings_form.newPassword" disabled></b-form-input>
                </div>
              </b-form-group>
              <b-form-group><!-- Campo repetir contraseña !-->
                <div class="form-row">
                  <label class="col-form-label">Repetir contraseña: </label>
                  <b-form-input type="password" id="reviewNewPassword" required placeholder="Confirme la contraseña" v-model="Settings_form.reviewNewPassword" disabled></b-form-input>
                </div>
              </b-form-group>
              <b-form-group><!-- Botones de registrar y vaciar !-->
                <div class="form-row " >
                  <b-button type="submit" class="col-md-4 text-center" variant="primary">Cambiar datos</b-button>
                  <b-button type="reset" variant="danger"  class="col-md-4 offset-md-4" v-model="vaciar">Vaciar</b-button>
                </div>
              </b-form-group>
              <!-- Span en caso de errores en registro !-->
              <span id="stringErrorContrasenna" style="color: red">{{stringError}}</span>
              <span id="stringErrorUsuario" style="display: none">Este correo ya está siendo utilizado</span>
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
          password: '',
          newPassword:'',
          reviewNewPassword: ''
        },
        // String del error
        stringError: '',
        changePassword: false
      }
    },
    methods:{
      saveChanges(){ //Metodo de registro
        if(this.Settings_form.newPassword === this.Settings_form.reviewNewPassword){
          let dataUser = new User(this.Settings_form.username, this.Settings_form.password, this.Settings_form.email, this.Settings_form.name)
          this.$store.dispatch("auth/saveChanges", dataUser) // Llamada a la función de axios creada para registro
                  .then(data => {
                    alert("cambios guardados correctamente")
                    console.log(data)
                  },error =>{
                    console.log(error)
                    this.stringError = "Error en registro"

                  })

        }else{

          this.stringError = "Contraseña no verificada"
        }

      },
      vaciar(){ // Funcion para vaciar los campos del formulario
        this.Settings_form.name= ''
        this.Settings_form.email= ''
        this.Settings_form.password= ''
        this.Settings_form.username = ''
        this.stringError = ''


      },
      error(error){ //Funcion para mandar error
        document.getElementById("tagError").textContent = error.toString()
      },
      change(){
        if(document.getElementById("password").disabled === true){
          document.getElementById("password").disabled = false;
          document.getElementById("reviewNewPassword").disabled = false;
          document.getElementById("newPassword").disabled = false;
        }else{
          document.getElementById("password").disabled = true;
          document.getElementById("reviewNewPassword").disabled = true;
          document.getElementById("newPassword").disabled = true;
        }

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
    // ,computed:{
    //     PasswordVerify(){
    //         return this.contrasenna.length >= 6
    //     }


  }
</script>

<style scoped>

</style>