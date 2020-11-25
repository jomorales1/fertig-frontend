<template>
  <div>
    <div class="sm">
    <b-tabs>
      <b-tab title="Semana" active>
        <div>
          <div class="row justify-content-center">
            <b-button variant="primary" style="margin-right: 5%">-</b-button>
            {{longDate(fecha)}}
            <b-button variant="primary" style="margin-left: 5%" @click="addWeek()">+</b-button>
          </div>
          <header style="font-size: 300%">Horas Completadas</header>
          <Chart id="chart-1" :labels-set="labels12" :data-set="data1"  v-if="flag" class="my-5"/>
          <header style="font-size: 300%">Tareas Completadas</header>
          <Chart id="chart-2" class="my-5" :labels-set="labels12" :data-set="data2" v-if="flag"/>
          <p style="font-size: 100%">Número de minutos Completadas</p>{{horasSemana}}
          <p style="font-size: 100%">Número de tareas Completadas</p>{{tareasSemana}}
        </div>
      </b-tab>
      <b-tab title="Mes" lazy>
        <div>
          <header style="font-size: 300%">Horas Completadas</header>
          <Chart id="chart-3" :labels-set="labels34" :data-set="data3" v-if="flag2" class="my-5" />
          <header style="font-size: 300%">Tareas Completados</header>

          <Chart id="chart-4" :labels-set="labels34" :data-set="data4" v-if="flag2" class="my-5" />

          <p style="font-size: 100%">Número de minutos Completados</p>{{horasMes}}
          <p style="font-size: 100%">Número de tareas Completadas</p>{{tareasMes}}
        </div>
      </b-tab>
      <b-tab title="Año" lazy>
        <div>
          <header style="font-size: 300%">Horas Completadas</header>
          <Chart id="chart-5" :labels-set="labels56" :data-set="data5" v-if="flag3" class="my-5" />
          <header style="font-size: 300%">Tareas Completadas</header>
          <Chart id="chart-6" :labels-set="labels56" :data-set="data6" v-if="flag3" class="my-5" />
          <p style="font-size: 100%">Número de minutos Completados</p>{{horasAnnio}}
          <p style="font-size: 100%">Número de tareas Completadas</p>{{tareasAnnio}}
        </div>
      </b-tab>
    </b-tabs>
    </div>
  </div>
</template>

<script>
import Chart from "@/components/Chart";
export default {
  name: "Progress",
  components: {Chart},
  data(){
    return {
      horasSemana: '',
      tareasSemana: '',
      horasMes: '',
      tareasMes: '',
      horasAnnio: '',
      tareasAnnio: '',
      labels12: [],
      labels34: [],
      labels56: [],
      data1: [],
      data2: [],
      data3: [],
      data4: [],
      data5: [],
      data6: [],
      fecha: new Date(),
      //2020, 11, 1
      prueba: [],
      flag:false,
      flag2:false,
      flag3:false
    }

  },
  methods:{
    longDate(date){
      //formateo de la fecha para mostrar
      let options={ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12:true }
      return (new Intl.DateTimeFormat('es',options)).format(date)
    },
    addWeek(){
      this.fecha = this.fecha.setDate(this.fecha.getDate() + 7)
    },
    restWeek(){
      this.fecha = this.fecha.setDate(this.fecha.getDate() - 7)
    }
  },
  created() {
    // this.labels12 = ['Januaryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    // this.data1 = [60, 40, 20, 50, 10, 10, 20, 40, 3, 70, 90, 100]
    this.$store.dispatch("DataModule/getReportWeek",this.fecha).then(
        response=>{
          this.tareasSemana = response.data.tareas;
              this.horasSemana = response.data.minutos;
        }
    )
    this.$store.dispatch("DataModule/getReportMonth",this.fecha).then(
        response=>{
          this.tareasMes = response.data.tareas
              this.horasMes = response.data.minutos
        }
    )
    this.$store.dispatch("DataModule/getReportYear",this.fecha).then(
        response=>{
          this.tareasAnnio = response.data.tareas
              this.horasAnnio = response.data.minutos
        }
    )
    this.$store.dispatch("DataModule/getGraphicWeek",this.fecha).then(
        response=>{
          this.labels12 = response.data.fechas
          this.data1 = response.data.minutos
          this.data2=response.data.tareas
          this.flag = true
        }
    )
    this.$store.dispatch("DataModule/getGraphicMonth",this.fecha).then(
        response=>{
          this.labels34 = response.data.fechas
          this.data3 = response.data.minutos
          this.data4 =response.data.tareas
          this.flag2=true
        }
    )
    this.$store.dispatch("DataModule/getGraphicYear",this.fecha).then(
        response=>{
          this.labels56 = response.data.fechas
          this.data5 = response.data.minutos
          this.data6 =response.data.tareas
          this.flag3=true
        }
    )
  }
}
</script>

<style>
/*.small {
  max-width: 600px;
  margin:  150px auto;
}*/
</style>