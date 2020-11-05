<template>
  <div>
    <b-form-group>
      <h1 class="display-3 font-weight-bold mb-3" v-html="formato(cronometro)"></h1>
      <b-button
          v-if="state === 'inicio'"
          @click="iniciarC">
        Iniciar
      </b-button>
      <b-button
          v-if="state === 'pausa'"
          @click="continuarC">
        Continuar
      </b-button>
      <b-button
          v-if="state === 'corriendo'"
          @click="pararC">
        Parar
      </b-button>
      <b-button
          v-if="state === 'pausa'"
          @click="reiniciarC">
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
  </div>
</template>

<script>


export default {
  name: "Cronometro",
  components:{
  },
  data(){
    return {
      state: 'inicio',
      TiempoInicioCronometro: Date.now(),
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
      return this.formatoHoras(transcurrido)+
          ':' + this.formatoMinutos(transcurrido) +
          ':' + this.formatoSegundos(transcurrido)+
          ':' + this.formatoDecimasdeSegundo(transcurrido).substring(0,1);

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
    },

    iniciarC() {
      this.TiempoInicioCronometro = Date.now();
      this.state = 'corriendo';
      this.iniciarCronometro();
    },

    reiniciarC: function() {
      this.state = "inicio";
      this.TiempoInicioCronometro = Date.now();
      this.TiempoActual = Date.now();
      this.cronometroPausas = [];
      this.vueltas = [];
      this.tiempodePausa = 0;
    },
    pararC: function() {
      this.pararCronometro();
      this.state = "pausa";

      this.vueltas.push({
        vueltaInicio: Date.now(),
        vueltaFinal: null,
        pausaTamano: null
      });
      this.cronometroPausas.push({
        interval: this.cronometro
      });
    },
    continuarC: function() {
      const final = Date.now();
      const inicio = this.vueltas[this.vueltas.length - 1].vueltaInicio;
      const tamano = final - inicio;
      this.tiempodePausa += tamano;
      this.vueltas[this.vueltas.length - 1].vueltaFinal = final;
      this.vueltas[this.vueltas.length - 1].pausaTamano = tamano;
      this.state = "corriendo";
      this.iniciarCronometro();
    },
    actualizarTiempoC() {
      this.TiempoActual = Date.now();
    },
    iniciarCronometro() {
      this.interval = setInterval(this.actualizarTiempoC, 10);
    },
    iniciarTemporizador() {
      this.interval = setInterval(this.timePassed, 10);
    },
    pararCronometro() {
      clearInterval(this.interval);
    },
    pararTemporizador() {
      clearInterval(this.interval);
    },

  },
  computed: {
    cronometro() {
      return this.TiempoActual - this.TiempoInicioCronometro - this.tiempodePausa;
    },
    }
}
</script>

<style scoped>

</style>