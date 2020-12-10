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
    <b-form-group>
      <b-button

          v-if="state === 'pausa' && tareaSeleccionada!=='' && !enviado"
          @click="guardar">
        guardar tiempo
      </b-button>
      <b-button
          v-if="tareaSeleccionada!==''"
          @click="tareaSeleccionada=''">
        limpiar seleccion
      </b-button>
    </b-form-group>
    <div class="tareasbox">
      <b-list-group>
        <b-list-group-item
            class="btn  flex-column align-items-start"
            v-for="tarea in lista.filter(s=>s.recomendada===true)"
            :key="tarea.id"
        >
          <div class="flex-row w-100 justify-content-between"
          >
            <div class="d-inline-block align-top align-text-top">
              <b-radio
                  class="d-inline-block"
                  v-model="tareaSeleccionada"
                  :value="tarea.id">
                {{tarea.nombre}}
              </b-radio>
              <b-badge
                  v-for="etiqueta in (tarea.etiqueta!==null?tarea.etiqueta.split(' '):[])"
                  :key="etiqueta"
                  class="p-1 mx-1 d-inline-block"
                  :variant="'primary'"

              >
                {{etiqueta}}
              </b-badge>
              <b-badge v-for="razon in tarea.razon" :key="razon" variant="primary">
                {{razon}}
              </b-badge>
            </div>
          </div>

        </b-list-group-item>
        <b-list-group-item
          class="btn  flex-column align-items-start"
          v-for="tarea in lista.filter(s=>s.recomendada===false)"
          :key="tarea.id"
      >
        <div class="flex-row w-100 justify-content-between" >
          <div class="d-inline-block align-top align-text-top">
            <b-radio
                class="d-inline-block"
                v-model="tareaSeleccionada"
                :value="tarea.id">
              {{tarea.nombre}}
            </b-radio>
            <b-badge
                v-for="etiqueta in (tarea.etiqueta!==null?tarea.etiqueta.split(' '):[])"
                :key="etiqueta"
                class="p-1 mx-1 d-inline-block"
                :variant="'primary'"
            >
              {{etiqueta}}
            </b-badge>
          </div>
        </div>

      </b-list-group-item>
    </b-list-group>


    </div>
  </div>
</template>

<script>


import Task from "@/models/Task";

export default {
  name: "Cronometro",
  components:{

  },
  data(){
    return {
      lista:[],
      recomendada:false,
      state: 'inicio',
      TiempoInicioCronometro: Date.now(),
      TiempoActual: Date.now(),
      vueltas: [],
      tiempodePausa: 0,
      cronometroPausasFields: [
        { text: 'tiempo desde el inicio', value: 'tiempo' }],
      cronometroPausas: [],
      tareaSeleccionada:'',
      enviado:false
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
      this.enviado=false;
    },
    pararC: function() {
      this.pararCronometro();
      this.state = "pausa";

      this.vueltas.push({
        vueltaInicio: Date.now()
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
    guardar: function (){
      this.enviado=true
      this.$store.dispatch("DataModule/addTime",{id:this.tareaSeleccionada, time:this.tiempoenMinutos})
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
    update(){
      let that=this
      this.$store.dispatch('DataModule/getRecomendations',new Date().getDay()).then(response=>{
        that.lista=this.$store.state.DataModule.tareas.filter(a=>(a instanceof Task && !a.hecha))
        console.log(that.lista)
        that.lista.forEach((valor,index)=>{
          that.lista[index].recomendada=false
        })
        response.data.forEach(valor=>{
          let tareas=that.lista.map(item=>item.id)

          that.lista[tareas.indexOf(valor.id)].recomendada=true
          if(that.lista[tareas.indexOf(valor.id)].razon==null){
            that.lista[tareas.indexOf(valor.id)].razon=[]
          }
          that.lista[tareas.indexOf(valor.id)].razon.push(valor.criterio)
        })
      })
    }


  },
  computed: {
    tiempoenMinutos(){
      return Math.round(this.cronometro/60000)
    },

    cronometro() {
      return this.TiempoActual - this.TiempoInicioCronometro - this.tiempodePausa;
    },
    },
  created() {
      //actualizar la lista de tareas cuando se carga la pagina
      this.$store.dispatch('DataModule/update')
      this.update()

  }
}
</script>

<style scoped lang="scss">
.tareasbox{
  overflow-y: scroll;
  height: 400px;

}
</style>