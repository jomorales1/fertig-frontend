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
                <b-form id="form_registro" @submit="onSubmit" @reset="onReset">
                  <b-form-group >
                    <div class="form-row">
                    <label class="col-form-label">Nombre: </label>
                    <b-form-input id="nombre" required placeholder="Ingrese el nombre"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group >
                    <div class="form-row">
                      <label class="col-form-label">Correo: </label>
                      <b-form-input id="email" required placeholder="Ingrese el correo"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group >
                    <div class="form-row">
                      <label class="col-form-label">Contraseña: </label>
                      <b-form-input id="password" required placeholder="Ingrese la contraseña"></b-form-input>
                    </div>
                  </b-form-group>
                  <b-form-group>
                    <div class="form-row col-md " align="center">
                      <b-button type="submit" class="col text-center" variant="primary">Registrar</b-button>
                        <b-button type="reset" variant="danger"  class="col text-center" v-model="Vaciar">Vaciar</b-button>
                    </div>
                    <br>
                    <div class="form-row col-md ">

                    </div>
                  </b-form-group>
                </b-form>
              </b-card>
          </div>
        </b-row>
      </b-container>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        Register_form:{
          name: '',
          email: '',
          password:''
        }
      }
    },
    methods:{
      onSubmit(){
        this.$store.dispatch('login', {
                  name: this.Register_form.name,
                  email: this.Register_form.email,
                  password: this.Register_form.password
                }
        )
      },
      Vaciar(){
        this.Register_form.name= ''
        this.Register_form.email= ''
        this.Register_form.password= ''


      }
    }
  }
</script>

<style scoped>

</style>