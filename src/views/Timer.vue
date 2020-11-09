<template>
  <div class="align-self-center my-5">
  <b-container> <!-- Contenedor titulo y formulario de registro !-->
    <b-row  class ="justify-content-md-center ">
      <div class="col-md-10" >
        <h1>Fertig</h1>
        <b-card header="Timer"
                border-variant="primary"
                header-bg-variant="primary"
                header-text-variant="white">
          <b-form-group>
            <b-tabs card>
              <b-tab title="Cronometro" active>
                <Cronometro></Cronometro>
              </b-tab>
              <b-tab title="Temporizador">
                <Temporizador>  </Temporizador>
              </b-tab>
            </b-tabs>
          </b-form-group>
        </b-card>
        <music></music>

      </div>
    </b-row>
  </b-container>
  </div>
</template>

<script>
// import Tarea from "@/components/Tarea";
// import Routine from "@/models/Routine";
import Cronometro from "@/components/Cronometro";
import Temporizador from "@/components/Temporizador";
import Chilled from "@/assets/audio/chilled.mp3"
import Belonging from "@/assets/audio/Belonging by Muted Artlist.mp3"
import Dusk from "@/assets/audio/Dusk by IanPost Artlist.mp3"
import Staring from "@/assets/audio/Staring by Muted Artlist.mp3"
import World from "@/assets/audio/TheWorldInsideInstrumentalVersion by RodellosMachine Artlist.mp3"
import Music from "@/components/Music";


export default {
  name: "Timer",
  components:{
    Music,
    Temporizador,
    // Tarea,
    Cronometro
  },
  data() {
    return {
      chilled:Chilled,
      belonging:Belonging,
      dusk:Dusk,
      staring:Staring,
      world:World
    }
  },
  methods: {
    // toggleSound() {
    //   let audio = this.$refs.audio;
    //   if (
    //       audio.paused &&
    //       document.querySelector(".toggle-sound").classList.contains("paused")
    //   ) {
    //     console.log("play it")
    //     audio.play();
    //     document.querySelector(".toggle-sound").classList.remove("paused");
    //   } else {
    //     console.log("pause it")
    //     audio.pause();
    //     document.querySelector(".toggle-sound").classList.add("paused");
    //   }
    // }
  }


}
</script>

<style scoped>

</style>