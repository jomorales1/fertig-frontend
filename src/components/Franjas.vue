<template>
  <b-modal size="xl" id="franjas" title="Franjas">
    <b-container fluid v-show="false">
      <b-row class="mb-1">
        <b-col cols="8"></b-col>
        <b-col>Lunes</b-col>
        <b-col>Martes</b-col>
        <b-col>Miercoles</b-col>
        <b-col>Jueves</b-col>
        <b-col>Viernes</b-col>
        <b-col>Sabado</b-col>
        <b-col>Domingo</b-col>
      </b-row>
      <b-row class="mb-1">
        <b-col cols="8"> Hora de inicio</b-col>
        <b-col><b-timepicker></b-timepicker></b-col>
        <b-col><b-timepicker></b-timepicker></b-col>
        <b-col><b-timepicker></b-timepicker></b-col>
        <b-col><b-timepicker></b-timepicker></b-col>
        <b-col><b-timepicker></b-timepicker></b-col>
        <b-col><b-timepicker></b-timepicker></b-col>
        <b-col><b-timepicker></b-timepicker></b-col>
        <b-col><b-timepicker></b-timepicker></b-col>
      </b-row>
    </b-container>
    <vue-cal
        class="vuecal--green-theme "
        :disable-views="['years', 'year','day','month']"
        hide-view-selector
        hide-title-bar
        :editable-events="{ title: false, drag: false, resize: true, delete: true, create: true }"
        locale="es"
        small
        ref="cal"
    >
      <template v-slot:no-event><br></template>
      <template v-slot:event="{ event}">
        <small class="vuecal__event-time">
          <!-- Using Vue Cal injected Date prototypes -->
          <strong>Inicio:</strong> <span>{{ event.start.formatTime("h am") }}</span><br/>
          <strong>Fin:</strong> <span>{{ event.end.formatTime("h am") }}</span>
        </small>
        <br>
      </template>
    </vue-cal>
  </b-modal>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/es.js'
import 'vue-cal/dist/vuecal.css'
export default {
  name: "Franjas",
  components: {VueCal},
  data(){
    return{
      days:[],
      myData:[]
    }
  },
  methods:{
    copyEvent(){
      this.myData=this.calEvents.filter(item=>{
        this.days.pussh(item.end.getDay())
      })
    }
  },
  computed:{
    calEvents(){
      return this.$refs.cal.mutableEvents
    }
  }
}
</script>

<style lang="scss">
.vuecal__event {background-color: #28da50}
.vuecal__event-delete{
  transform: translateY(0);
  display: block;
  position: static;
  background-color: #28da50 ;
  color: #28da50;
  margin-top: 5px;
    &::after{
      content: "";
      display: block;
      background-size: 1rem;
      background: url("../assets/close.svg") no-repeat center;
      background-size: 1rem;
      width: 100%;
      height: 1rem;
      position: absolute;
      top:0;

    }
}
</style>