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
        <div>
          <h2>music</h2>
          <audio controls>
            <source src="@/assets/chilled.mp3" type="audio/mpeg">
          </audio>
        </div>
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
import chilled from "@/assets/chilled.mp3"

export default {
  name: "Timer",
  components:{
    Temporizador,
    // Tarea,
    Cronometro
  },
  data() {
    return {
      src1:chilled,
    }
  },
  methods: {
    toggleSound() {
      let audio = this.$refs.audio;
      if (
          audio.paused &&
          document.querySelector(".toggle-sound").classList.contains("paused")
      ) {
        console.log("play it")
        audio.play();
        document.querySelector(".toggle-sound").classList.remove("paused");
      } else {
        console.log("pause it")
        audio.pause();
        document.querySelector(".toggle-sound").classList.add("paused");
      }
    }
  }


}
</script>

<style scoped>

</style>