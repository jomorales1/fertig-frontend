<template>
  <div>
    <div class="small">
    <b-tabs>
      <b-tab title="Día" active>
        <div >
          <header style="font-size: 300%">Horas Completadas</header>
          <Chart id="chart-1" />
        </div>
      </b-tab>
      <b-tab title="Semana" active>
        <div>
          <header style="font-size: 300%">Horas Completadas</header>
          <Chart/>
        </div>
      </b-tab>
      <b-tab title="Mes" active>
        <div>
          <header style="font-size: 300%">Horas Completadas</header>
          <Chart/>
        </div>
      </b-tab>
    </b-tabs>
    </div>
    <div class="small">
      <header style="font-size: 300%">Tareas Completadas</header>
      <Chart/>
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
      visible1: false
    }
  },
  methods:{
    setVisible(isVisible){
      isVisible = true
      return isVisible
    }
  }
}
</script>

<style>
.small {
  max-width: 600px;
  margin:  150px auto;
}
</style>