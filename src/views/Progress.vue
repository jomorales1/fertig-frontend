<template>
  <div>
    <div class="sm">
<!--    <b-tabs>-->
<!--      <b-tab title="Semana" active>-->
        <div>
          <header style="font-size: 300%">Horas Completadas</header>
          <br/>
          <br/>
          <Chart id="chart-1" :labels-set="labels12" :data-set="data1" ref="chart-1"/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <header style="font-size: 300%">Tareas Completadas</header>
          <br/>
          <br/>
          <Chart id="chart-2" :labels-set="labels12" :data-set="data2"/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <p style="font-size: 100%">Número de minutos Completadas</p>{{horasAnnio}}
          <p style="font-size: 100%">Número de tareas Completadas</p>{{tareasAnnio}}
        </div>
<!--      </b-tab>-->
<!--      <b-tab title="Mes" active>-->
        <div>
          <header style="font-size: 300%">Horas Completadas</header>
          <br/>
          <br/>
          <Chart id="chart-3" :labels-set="labels34" :data-set="data3"/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <header style="font-size: 300%">Tareas Completados</header>
          <br/>
          <br/>
          <Chart id="chart-4" :labels-set="labels34" :data-set="data4"/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <p style="font-size: 100%">Número de minutos Completados</p>{{horasMes}}
          <p style="font-size: 100%">Número de tareas Completadas</p>{{tareasMes}}
        </div>
<!--      </b-tab>-->
<!--      <b-tab title="Año" active>-->
        <div>
          <header style="font-size: 300%">Horas Completadas</header>
          <br/>
          <br/>
          <Chart id="chart-5" :labels-set="labels56" :data-set="data5"/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <header style="font-size: 300%">Tareas Completadas</header>
          <br/>
          <br/>
          <Chart id="chart-6" :labels-set="labels56" :data-set="data6" />
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <p style="font-size: 100%">Número de minutos Completados</p>{{horasSemana}}
          <p style="font-size: 100%">Número de tareas Completadas</p>{{tareasSemana}}
        </div>
<!--      </b-tab>-->
<!--    </b-tabs>-->
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
      fecha: new Date(2020, 11, 1),
      prueba: []
    }

  },
  methods:{
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
          this.tareasMes = response.data.tareas,
              this.horasMes = response.data.minutos
        }
    )
    this.$store.dispatch("DataModule/getReportYear",this.fecha).then(
        response=>{
          this.tareasAnnio = response.data.tareas,
              this.horasAnnio = response.data.minutos
        }
    )
    this.$store.dispatch("DataModule/getGraphicWeek",this.fecha).then(
        response=>{
          this.labels12 = response.data.fechas
          this.data1 = response.data.minutos;
          this.data2=response.data.tareas
        }
    )
    this.$store.dispatch("DataModule/getGraphicMonth",this.fecha).then(
        response=>{
          this.labels34 = response.data.fechas
          this.data3 = response.data.minutos,
              this.data4 =response.data.tareas
        }
    )
    this.$store.dispatch("DataModule/getGraphicYear",this.fecha).then(
        response=>{
          this.labels56 = response.data.fechas
          this.data5 = response.data.minutos,
              this.data6 =response.data.tareas
        }
    )
  }
}
</script>

<style>
.small {
  max-width: 600px;
  margin:  150px auto;
}
</style>