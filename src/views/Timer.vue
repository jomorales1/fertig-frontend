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
                <b-form-group>
                  <h1 class="display-3 font-weight-bold mb-3" v-html="formato(cronometro)"></h1>
                  <b-button
                      v-if="state === 'inicio'"
                      @click="iniciar">
                    Iniciar
                  </b-button>
                  <b-button
                      v-if="state === 'pausa'"
                      @click="continuar">
                    Continuar
                  </b-button>
                  <b-button
                      v-if="state === 'corriendo'"
                      @click="parar">
                    Parar
                  </b-button>
                  <b-button
                      v-if="state === 'pausa'"
                      @click="reiniciar">
                    Reiniciar
                  </b-button>
                </b-form-group>
                <b-form-group v-if="cronometroPausas.length > 0">
                  <h2 class="headline font-weight-bold mb-3">Pausas</h2>
                      <b-table striped hover
                          :fields="cronometroPausasFields"
                          :items="cronometroPausas"
                      ></b-table>
                </b-form-group>
                <CreacionTareas/>


              </b-tab>
              <b-tab title="Temporizador">
               <p>
                 {{displayhours}} : {{displayminutes}} : {{displayseconds}}
               </p>
              </b-tab>
            </b-tabs>




          </b-form-group>
        </b-card>
      </div>
    </b-row>
  </b-container>
  </div>
</template>

<script>
export default {
  name: "Timer",
  components:{},
  data(){
    return {
      state: 'inicio',
      TiempoInicio: Date.now(),
      TiempoActual: Date.now(),
      vueltas: [],
      tiempodePausa: 0,
      cronometroPausasFields: [
        { text: 'tiempo desde el inicio', value: 'tiempo' }],
      cronometroPausas: [],

    }
  },
  methods:{
    formato(transcurrido) {
      if (transcurrido === undefined || transcurrido === null) {
        transcurrido = this.cronometro;
      }

      let tiempo = this.formatoHoras(transcurrido)+
          ':' + this.formatoMinutos(transcurrido) +
          ':' + this.formatoSegundos(transcurrido)+
          ':' + this.formatoDecimasdeSegundo(transcurrido).substring(0,1);

      return tiempo;
    },
    formatoHoras(transcurrido) {
      const hrs = Math.floor((transcurrido / 1000 / 60 / 60));
      return hrs >= 10 ? hrs : '0' + hrs;
    },
    formatoMinutos(transcurrido) {
      const min = Math.floor((transcurrido / 1000 / 60) % 60);
      return min >= 10 ? min : '0' + min;
    },
    formatoSegundos(transcurrido) {
      const sec = Math.floor((transcurrido / 1000) % 60);
      return sec >= 10 ? sec : '0' + sec;
    },
    formatoDecimasdeSegundo(transcurrido) {
      return '' + Math.ceil(transcurrido % 1000);

      // if (mil < 10) {
      //   return '00' + mil;
      // } else if (mil < 100) {
      //   return '0' + mil;
      // } else {
      //   return '' + mil;
      // }
    },

    iniciar() {
      this.TiempoInicio = Date.now();
      this.state = 'corriendo';
      this.iniciarCronometro();

      // this.storeInstance();
    },
    reiniciar: function() {
      // this.stopUpdateInterval();

      this.state = "inicio";
      this.TiempoInicio = Date.now();
      this.TiempoActual = Date.now();
      this.cronometroPausas = [];
      this.intervalKeyCounter = 1;
      this.vueltas = [];
      this.tiempodePausa = 0;

      // this.discardStoredInstance();
    },
    parar: function() {
      this.pararCronometro();
      this.state = "pausa";

      this.vueltas.push({
        vueltaInicio: Date.now(),
        vueltaFinal: null,
        pausaTamano: null
      });
      // let interval = this.cronometro;
      this.cronometroPausas.push({
        interval: this.cronometro
      });
      // this.intervalKeyCounter++;
      // this.storeInstance();
    },
    continuar: function() {
      const final = Date.now();
      const inicio = this.vueltas[this.vueltas.length - 1].vueltaInicio;
      const tamano = final - inicio;
      this.tiempodePausa += tamano;
      this.vueltas[this.vueltas.length - 1].vueltaFinal = final;
      this.vueltas[this.vueltas.length - 1].pausaTamano = tamano;
      this.state = "corriendo";

      this.iniciarCronometro();
      // this.storeInstance();
    },

    actualizarTiempo() {
      this.TiempoActual = Date.now();
    },

    iniciarCronometro() {
      this.interval = setInterval(this.actualizarTiempo, 10);
    },

    pararCronometro() {
      clearInterval(this.interval);
    }

    },


  computed: {
    cronometro() {
      return this.TiempoActual - this.TiempoInicio - this.tiempodePausa;
    }
  }
}
</script>

<style scoped>

</style>