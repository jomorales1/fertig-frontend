<template>
  <b-container class=" my-10" fluid="lg">

        <h1>Fertig</h1>
        <b-row >
          <b-col><b-card class=" mx-2" header="Reloj"
                         border-variant="primary"
                         header-bg-variant="primary"
                         header-text-variant="white">
            <b-form-group>
              <b-tabs card>
                <b-tab title="Cronometro">
                  <Cronometro></Cronometro>
                </b-tab>
                <b-tab title="Temporizador" >
                  <Temporizador></Temporizador>
                </b-tab>
              </b-tabs>
            </b-form-group>
          </b-card></b-col>
          <b-col><b-card class=" mx-2" header="Musica"
                         border-variant="primary"
                         header-bg-variant="primary"
                         header-text-variant="white">
            <music></music>
          </b-card></b-col>

        </b-row>

  </b-container>
</template>

<script>
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
  }


}
</script>