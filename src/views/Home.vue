<template>
  <div id="app" class="align-top">
    <b-navbar toggleable="lg" type="dark" variant="primary" >
      <b-navbar-brand>Fertig</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-button variant="primary" text="white" @click="register">Regístrate</b-button>
        <b-button variant="primary" text="white" @click="signUp">Inicia sesión</b-button>
      </b-navbar-nav>
    </b-navbar>
    <br>
    <br>
    <br>
    <div>
      <Jumbotron :imagen="src" titulo="Eventos y tareas en un solo lugar" subtitulo="No busques mas aplicaciones. Fertig te ofrece un hub centralizado para todas tus actividades." ></Jumbotron>
      <InvertJumbotron :imagen="src2" titulo="Fertig te ofrece todo lo que necesitas" subtitulo="To-Do hechas de la manera correcta con todas las propiedades que necesitas" texto="Crea tus rutinas, tareas y eventos y las organizaremos por ti"></InvertJumbotron>
      <Jumbotron :imagen="src3" titulo="Trabaja desde cualquier dispositivo en tu navegador." subtitulo="Fertig lo hará por ti" texto="Crea tus rutinas, tareas y eventos y las organizaremos por ti"></Jumbotron>
    </div>
  </div>
</template>

<script>
  import router from "../router";
  import Jumbotron from "../components/Jumbotron";
  import InvertJumbotron from "../components/InvertJumbotron";
  import image from '../assets/list.png';
  import image2 from '../assets/image.png';
  import image3 from '../assets/multi.png'
export default {
  name: "Inicio",
  components:{
    Jumbotron,
    InvertJumbotron
  },
  data(){
    return{
      src: image,
      src2: image2,
      src3:image3,
    }
  },
  methods:{
    signUp(){
      router.push("/Login");
    },
    register(){
      router.push("/SignUp");
    }
  }
}
</script>

<style>

</style>