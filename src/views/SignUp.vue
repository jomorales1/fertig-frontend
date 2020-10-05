<template>
  <div class="align-self-center">
      <b-container>
        <b-row  class ="justify-content-md-center ">
          <div class="col-md-6" >
            <h1>Fertig</h1>
              <b-card header="Sign Up"
                      border-variant="primary"
                      header-bg-variant="primary"
                      header-text-variant="white">
                <b-form id="form_registro" @submit.prevent="onSubmit" >
                  <b-form-group >
                    <div class="form-row">
                    <label class="col-form-label">Nombre: </label>
                    <b-form-input id="nombre" required placeholder="Ingrese el nombre" v-model="Register_form.name"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group >
                    <div class="form-row">
                      <label class="col-form-label">Usuario: </label>
                      <b-form-input id="usuario" required placeholder="Ingrese el usuario" v-model="Register_form.username"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group >
                    <div class="form-row">
                      <label class="col-form-label">Correo: </label>
                      <b-form-input id="email" required placeholder="Ingrese el correo" v-model="Register_form.email"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group >
                    <div class="form-row">
                      <label class="col-form-label">Contraseña: </label>
                      <b-form-input type="password" id="password" required placeholder="Ingrese la contraseña" v-model="Register_form.password"></b-form-input>
                    </div>
                  </b-form-group>
                    <b-form-group>
                    <div class="form-row">
                        <label class="col-form-label">Repetir contraseña: </label>
                        <b-form-input type="password" id="reviewPassword" required placeholder="Confirme la contraseña" v-model="Register_form.reviewPassword"></b-form-input>
                    </div>
                    </b-form-group>
                  <b-form-group>
                    <div class="form-row " >
                      <b-button type="submit" class="col-md-4 text-center" variant="primary" v-model="onSubmit">Registrar</b-button>
                        <b-button type="reset" variant="danger"  class="col-md-4 offset-md-4" v-model="vaciar">Vaciar</b-button>
                    </div>
                  </b-form-group>
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
        Register_form:{
          name: '',
          username: '',
          email: '',
          password:'',
            reviewPassword:''
        },
        stringError: ''
      }
    },
    methods:{
      onSubmit(){
          if(this.Register_form.password === this.Register_form.reviewPassword){
              let dataUser = new User(this.Register_form.username, this.Register_form.password, this.Register_form.email, this.Register_form.name)
             this.$store.dispatch("auth/register", dataUser)
                     .then(data => {
                       alert("Usuario registrado correctamente")
                       console.log(data)
                       this.$router.push('/Login')
                     },error =>{
                       console.log(error)
                       this.stringError = "Error en registro"
                       //alert("Error en registro")
                     })

          }else{
              //this.vaciar()

          }

      },
      vaciar(){
        this.Register_form.name= ''
        this.Register_form.email= ''
        this.Register_form.password= ''
        this.Register_form.username = ''
        this.stringError = ''


      },
      error(error){
        document.getElementById("tagError").textContent = error.toString()
      },

    },
    computed:{
        PasswordVerify(){
            return this.contrasenna.length >= 6
        },

    }
  }
</script>

<style scoped>

</style>