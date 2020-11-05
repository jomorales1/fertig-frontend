<template>
  <div>
    <b-form-group
        id="tiempotemporizador"
        label-cols-sm="4"
        label-cols-lg="3"
        description="temporizador"
        label-for="horas, numero-horas, minutos, numero-minutos, segundos, numero-segundos">
      <label id="horas">horas:</label>
      <b-form-input required id="numero-horas" type="number" v-model="h"></b-form-input>
      <label id="minutos">minutos:</label>
      <b-form-input required id="numero-minutos" type="number" v-model="m"></b-form-input>
      <label id="segundos">segundos:</label>
      <b-form-input required id="numero-segundos" type="number" v-model="s"></b-form-input>
    </b-form-group>
<!--    <h1 class="display-3 font-weight-bold mb-3" v-html="formato(timePassed)"></h1>-->
    <h1 class="display-3 font-weight-bold mb-3" v-html="formato(timeLeft)"></h1>
<!--    <h1 class="display-3 font-weight-bold mb-3" v-html="formato(tiempoLimite)"></h1>-->
    <b-button
        v-if="state === 'inicio'"
        @click="iniciar">
      Iniciar
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
    <b-button
        v-if="state === 'pausa'"
        @click="continuar">
      Continuar
    </b-button>
  </div>
</template>

<script>
// import Routine from "@/models/Routine";
export default {
  name: "Temporizador",
  components:{
  },
  data(){
    return {
      state: 'inicio',
      h:'',
      m:'',
      s:'',

      timePassed: 0,
      timerInterval: null,
      tiempoLimite: 0
      //t2

    }
  },
  methods:{

    formato(transcurrido) {
      return this.formatoHoras(transcurrido)+
          ':' + this.formatoMinutos(transcurrido) +
          ':' + this.formatoSegundos(transcurrido)
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

    iniciar: function() {
      this.state = 'corriendo';
      this.tiempoLimite=this.tiempoLimite2
      this.iniciarTemporizador();

    },
    reiniciar: function() {
      this.state = 'inicio';
      this.timePassed=0;

    },
    parar: function() {
      this.pararTemporizador();
      this.state = "pausa";
      this.tiempoLimite=this.timeLeft
    },
    continuar: function() {
      this.state = "corriendo";
      this.tiempoLimite=this.timeLeft
      this.timePassed=0
      this.iniciarTemporizador();
    },

    iniciarTemporizador() {
      this.timerInterval = setInterval(() => (this.timePassed += 1000), 1000);
    },
    pararTemporizador() {
      clearInterval(this.timerInterval);
    },



  },
  watch: {
    timeLeft(newValue) {
      if (newValue === 0) {
        this.pararTemporizador();
      }
    }
  },
  mounted() {
  },
  computed: {
    timeLeft() {
      return this.tiempoLimite - this.timePassed;
    },
    tiempoLimite2(){
      return (this.h*60*60*1000+this.m*60*1000+this.s*1000)
    },
  },
  created() {
  }
}
</script>

<style scoped>

</style>