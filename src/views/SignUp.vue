<template>
  <div class="align-self-center my-5">
      <b-container class ="justify-content-md-center flex-row d-flex"> <!-- Contenedor titulo y formulario de registro !-->
          <div class="col-md-6" >
            <h1>Fertig</h1>
              <b-card header="Sign Up"
                      border-variant="primary"
                      header-bg-variant="primary"
                      header-text-variant="white"><!-- Etiqueta para definir bordes del formulario !-->
                <b-form id="form_registro" @submit.prevent="onSubmit" > <!-- Formulario de registro !-->
                  <b-form-group ><!-- Campo nombre !-->
                    <div class="form-row">
                    <label class="col-form-label">Nombre: </label>
                    <b-form-input id="nombre" required placeholder="Ingrese el nombre" v-model="Register_form.name"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group ><!-- Campo nombre de usuario !-->
                    <div class="form-row">
                      <label class="col-form-label">Usuario: </label>
                      <b-form-input id="usuario" required placeholder="Ingrese el usuario" v-model="Register_form.username"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group ><!-- Campo correo !-->
                    <div class="form-row">
                      <label class="col-form-label">Correo: </label>
                      <b-form-input id="email" required placeholder="Ingrese el correo" v-model="Register_form.email"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group ><!-- Campo contraseña !-->
                    <div class="form-row">
                      <label class="col-form-label">Contraseña: </label>
                      <b-form-input type="password" id="password" required placeholder="Ingrese la contraseña" v-model="Register_form.password"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group><!-- Campo repetir contraseña !-->
                  <div class="form-row">
                      <label class="col-form-label">Repetir contraseña: </label>
                      <b-form-input type="password" id="reviewPassword" required placeholder="Confirme la contraseña" v-model="Register_form.reviewPassword"></b-form-input>
                  </div>
                  <b-form-group>
                    <b-form-checkbox class="my-2" v-model="privacy">¿Acepta nuestra <router-link to="/Privacy">politica de privacidad</router-link>?</b-form-checkbox>
                  </b-form-group>
                  </b-form-group>
                    <b-form-checkbox v-if="franjas" class="my-2" v-model="franjas">¿Desea que le ofrescamos sugerencias de sus tareas pendientes en sus horas libres?</b-form-checkbox>
                  <b-form-group><!-- Botones de registrar y vaciar !-->
                    <div class="form-row " >
                      <b-button :disabled="!privacy" type="submit" class="col-md-4 text-center" variant="primary" v-model="onSubmit">Registrar</b-button>
                        <b-button type="reset" variant="danger"  class="col-md-4 offset-md-4" v-model="vaciar">Vaciar</b-button>
                    </div>
                  </b-form-group>
                  <!-- Span en caso de errores en registro !-->
                  <span id="stringErrorContrasenna" style="color: red">{{stringError}}</span>
                  <span id="stringErrorUsuario" style="display: none">Este correo ya está siendo utilizado</span>
                </b-form>
              </b-card>
          </div>
      </b-container>
  </div>
</template>

<script>

  import User from "../models/User";
  export default {
    name: "SignUp",
    data(){
      return {
        // campos del formulario de registro Register_form
        Register_form:{
          name: '',
          username: '',
          email: '',
          password:'',
            reviewPassword:''
        },
        // String del error
        stringError: '',
        isInit: false,
        isSignIn: false,
        franja:false,
        privacy:false
      }
    },
    methods:{
      onSubmit(){ //Metodo de registro
          if(this.Register_form.password === this.Register_form.reviewPassword){
              let dataUser = new User(this.Register_form.username, this.Register_form.password, this.Register_form.email, this.Register_form.name)
             this.$store.dispatch("auth/register", dataUser) // Llamada a la función de axios creada para registro
                     .then(
                         ()=> {
                           this.$root.$bvToast.toast("Usuario registrado correctamente", {
                             title: `Correcto`,
                             variant: 'secondary',
                             solid: true,
                             toaster:'b-toaster-top-center'
                           })
                       this.$router.push('/Login') // Cambiar a la ventana login
                     },() =>{
                       this.stringError = "Error en registro"

                     })

          }else{

            this.stringError = "Contraseña no verificada"
          }

      },
      vaciar(){ // Funcion para vaciar los campos del formulario
        this.Register_form.name= ''
        this.Register_form.email= ''
        this.Register_form.password= ''
        this.Register_form.username = ''
        this.stringError = ''


      },
      error(error){ //Funcion para mandar error
        document.getElementById("tagError").textContent = error.toString()
      }
    }

  }
</script>