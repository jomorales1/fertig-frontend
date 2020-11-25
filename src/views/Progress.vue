<template>
  <div>
    <div class="sm">
    <b-tabs>
      <b-tab title="Semana" active>
        <div>
          <div class="row justify-content-center my-5">
            <b-button variant="primary" style="margin-right: 5%" @click="restWeek()">-</b-button>
            {{longDateWeek(fecha1)}}
            <b-button variant="primary" style="margin-left: 5%" @click="addWeek()">+</b-button>
          </div>
          <header style="font-size: 300%">Horas Completadas</header>
          <Chart id="chart-1" :chart-data="chartData1" :labels-set="labels12" :data-set="data1" label-string="Horas Completadas"  v-if="flag" class="my-5"/>
          <header style="font-size: 300%">Tareas Completadas</header>
          <Chart id="chart-2" class="my-5" :chart-data="chartData2" :labels-set="labels12" :data-set="data2" label-string="Tareas Completadas" v-if="flag"/>
          <p style="font-size: 100%">Número de minutos Completadas</p>{{horasSemana}}
          <p style="font-size: 100%">Número de tareas Completadas</p>{{tareasSemana}}
        </div>
      </b-tab>
      <b-tab title="Mes" lazy>
        <div>
          <div class="row justify-content-center my-5">
            <b-button variant="primary" style="margin-right: 5%" @click="restMonth()">-</b-button>
            {{longDateMonth(fecha2)}}
            <b-button variant="primary" style="margin-left: 5%" @click="addMonth()">+</b-button>
          </div>
          <header style="font-size: 300%">Horas Completadas</header>
          <Chart id="chart-3" :labels-set="labels34" :chart-data="chartData3" :data-set="data3" label-string="Horas Completadas" v-if="flag2" class="my-5" />
          <header style="font-size: 300%">Tareas Completadas</header>

          <Chart id="chart-4" :labels-set="labels34" :chart-data="chartData4" :data-set="data4" label-string="Tareas Completadas" v-if="flag2" class="my-5" />

          <p style="font-size: 100%">Número de minutos Completados</p>{{horasMes}}
          <p style="font-size: 100%">Número de tareas Completadas</p>{{tareasMes}}
        </div>
      </b-tab>
      <b-tab title="Año" lazy>
        <div>
          <div class="row justify-content-center my-5">
            <b-button variant="primary" style="margin-right: 5%" @click="restYear()">-</b-button>
            {{longDateYear(fecha3)}}
            <b-button variant="primary" style="margin-left: 5%" @click="addYear()">+</b-button>
          </div>
          <header style="font-size: 300%">Horas Completadas</header>
          <Chart id="chart-5" :labels-set="labels56" :chart-data="chartData5" :data-set="data5" label-string="Horas Completadas" v-if="flag3" class="my-5" />
          <header style="font-size: 300%">Tareas Completadas</header>
          <Chart id="chart-6" :labels-set="labels56" :chart-data="chartData6" :data-set="data6" label-string="Tareas Completadas" v-if="flag3" class="my-5" />
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
      fecha1: new Date(),
      fecha2: new Date(),
      fecha3: new Date(),
      prueba: [],
      flag:false,
      flag2:false,
      flag3:false,
      chartData1: null,
      chartData2: null,
      chartData3: null,
      chartData4: null,
      chartData5: null,
      chartData6: null
    }

  },
  methods:{
    updateWeek(){
      this.$store.dispatch("DataModule/getReportWeek",this.fecha1).then(
          response=>{
            this.tareasSemana = response.data.tareas;
            this.horasSemana = response.data.minutos;
          }
      )
      this.$store.dispatch("DataModule/getGraphicWeek",this.fecha1).then(
          response=>{
            this.labels12 = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', ' Viernes', 'Sábado']
            this.data1 = response.data.minutos
            this.data2=response.data.tareas
            this.chartData1 = {
              labels: this.labels12,
              datasets: [
                {
                  label: 'Horas Completadas',
                  backgroundColor: '#f87979',
                  data: this.data1
                }
              ]
            }
            this.chartData2 = {
              labels: this.labels12,
              datasets: [
                {
                  label: 'Tareas Completadas',
                  backgroundColor: '#f87979',
                  data: this.data2
                }
              ]
            }
            this.flag = true
          }
      )
    },
    updateMonth(){
      this.$store.dispatch("DataModule/getReportMonth",this.fecha2).then(
          response=>{
            this.tareasMes = response.data.tareas
            this.horasMes = response.data.minutos
          }
      )

      this.$store.dispatch("DataModule/getGraphicMonth",this.fecha2).then(
          response=>{
            this.labels34 = response.data.fechas
            this.data3 = response.data.minutos
            this.data4 =response.data.tareas
            this.chartData3 = {
              labels: this.labels34,
              datasets: [
                {
                  label: 'Horas Completadas',
                  backgroundColor: '#f87979',
                  data: this.data3
                }
              ]
            }
            this.chartData4 = {
              labels: this.labels34,
              datasets: [
                {
                  label: 'Tareas Completadas',
                  backgroundColor: '#f87979',
                  data: this.data4
                }
              ]
            }
            this.flag2=true
          }
      )


    },
    updateYear(){
      this.$store.dispatch("DataModule/getReportYear",this.fecha3).then(
          response=>{
            this.tareasAnnio = response.data.tareas
            this.horasAnnio = response.data.minutos
          }
      )

      this.$store.dispatch("DataModule/getGraphicYear",this.fecha3).then(
          response=>{
            this.labels56 = response.data.fechas
            this.data5 = response.data.minutos
            this.data6 =response.data.tareas
            this.chartData5 = {
              labels: this.labels56,
              datasets: [
                {
                  label: 'Horas Completadas',
                  backgroundColor: '#f87979',
                  data: this.data5
                }
              ]
            }
            this.chartData6 = {
              labels: this.labels56,
              datasets: [
                {
                  label: 'Tareas Completadas',
                  backgroundColor: '#f87979',
                  data: this.data6
                }
              ]
            }
            this.flag3=true
          }
      )



    },
    longDateWeek(date){
      //formateo de la fecha para mostrar
      let options={ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12:true }
      return (new Intl.DateTimeFormat('es',options)).format(date)
    },
    longDateMonth(date){
      //formateo de la fecha para mostrar
      let options={ year: 'numeric', month: 'long', day: 'numeric'}
      return (new Intl.DateTimeFormat('es',options)).format(date)
    },
    longDateYear(date){
      //formateo de la fecha para mostrar
      let options={ year: 'numeric', month: 'long'}
      return (new Intl.DateTimeFormat('es',options)).format(date)
    },
    shortDate(date){
      //formateo de la fecha para mostrar
      let options={ year: 'numeric', month: 'long', day: 'numeric'}
      return (new Intl.DateTimeFormat('es',options)).format(date)
    },
    addWeek(){
      this.fecha1 = new Date(this.fecha1.setDate(this.fecha1.getDate() + 7))
      this.updateWeek()

    },
    restWeek(){
      this.fecha1 = new Date(this.fecha1.setDate(this.fecha1.getDate() - 7))
      this.updateWeek()

    },
    addMonth(){
      this.fecha2 = new Date(this.fecha2.setDate(this.fecha2.getDate() + 31))
      this.updateMonth()

    },
    restMonth(){
      this.fecha2 = new Date(this.fecha2.setDate(this.fecha2.getDate() - 31))
      this.updateMonth()
    },
    addYear(){
      this.fecha3 = new Date(this.fecha3.setDate(this.fecha3.getDate() + 365))
      this.updateYear()
    },
    restYear(){
      this.fecha3 = new Date(this.fecha3.setDate(this.fecha3.getDate() - 365))
      this.updateYear()
    }
  },
  created() {
    this.updateWeek()
    this.updateMonth()
    this.updateYear()
  }
}
</script>

<style>
/*.small {
  max-width: 600px;
  margin:  150px auto;
}*/
</style>