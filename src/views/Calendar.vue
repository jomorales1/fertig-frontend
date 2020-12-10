<template>
  <b-container fluid="" class="col-lg-10 mt-5 px-lg-5 d-flex justify-content-around " style="height: 85vh; " >
    <creacion-tareas ref="create" ></creacion-tareas>
    <CreacionSubtareas ref="add" :id="idParent"/>
    <div class="w-100">
      <vue-cal
               :time-from="0"
               :disable-views="['years', 'year']"
               active-view="month"
               :events="events"
               class="vuecal--green-theme "
               locale="es"
               style="width: 100%"
               :timeCellHeight="200"
               :min-cell-width="100"
               cellContextmenu
               :on-event-click="onEventClick"
               @view-change="scrollToCurrent($event)"
               id="vuecal"
      >
      </vue-cal>
    </div>
    <b-modal id="eventModal" v-if="current" :title="current.nombre" >

      <div class="d-block">
        <div><strong>Descripción: </strong>{{current.descripcion}}</div>
        <div><strong>Duración: </strong>{{current.duracion}} minutos</div>
        <div><strong>Prioridad: </strong>{{current.prioridad}}</div>
        <div v-if="!task"><strong>Recurrencia: </strong>{{current.mensajeRecurrencia}}</div>
        <div v-if="current.fechaInicio"><strong >Inicia el: </strong>{{formatFecha(new Date(current.fechaInicio))}}</div>
        <div><strong>Finaliza el: </strong>{{formatFecha(new Date(current.fechaFin))}}</div>
        <div v-if="current.recurrencia"><strong>Proxima repetición: </strong>{{formatFecha(current.fecha) }}</div>
        <div v-if="current.franjaInicio"><strong>Franja Horaria: </strong>{{stringFranja}}</div>
        <div v-if="current.etiqueta!==null"><strong>Etiquetas: </strong><b-badge variant="primary" v-for="etq in current.etiqueta.split(' ')" :key="etq">etq</b-badge></div>
          <b-button v-if="routine || task"
                    @click="addSubTask({id: idParent, padre: current})"
                    size="sm"
                    class="float-right my-0" >+ Subtarea</b-button>
          <br>


        <Subtareas
            :list-item="current"
            v-if="routine || task"
            v-on:addSubTask="addSubTask($event)"
            v-on:editSubTask="editsubTask($event)"
            class="mt-3"
        />
      </div>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="edit" >
          Editar
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/es.js'
import 'vue-cal/dist/vuecal.css'
import CreacionTareas from "@/components/CreacionTareas";
import CreacionSubtareas from "@/components/CreacionSubtareas";
import Task from "@/models/Task";
import Routine from "@/models/Routine";
import TEvent from "@/models/TEvent";
import Subtareas from "@/components/Subtareas";
export default {
  name: "Calendar",
  components:{Subtareas, CreacionTareas, VueCal, CreacionSubtareas},
  data(){
    return{
      calendarEvent:{id:0,type:Task},
      task:false,
      routine:false,
      idParent:0
    }
  },
  methods:{
    onEventClick(event, e){
      this.calendarEvent = event
      this.task = this.current instanceof Task
      this.routine = this.current instanceof Routine
      this.$bvModal.show('eventModal')
      e.stopPropagation()
    },
    scrollToCurrent(emitted){
      setTimeout(()=>{
        if(emitted.view==='Month'||Date.now()<emitted.startDate||Date.now()>emitted.endDate)return
        let now = new Date()
        const calendar = document.querySelector('#vuecal .vuecal__bg')
        calendar.scrollTo({
          top:(now.getHours()+(now.getMinutes()/60))*200,
          behavior: 'smooth'
        })
      },500)
    },
    edit(){//metodo para mostrar el dialogo de creacion de tarea para edicion
      this.$refs.create.edit(this.current)
      this.$bvModal.show('create-activity')
    },
    addSubTask(data){
      this.idParent = data.id
      this.$refs.add.newTask(data.padre); // padre mayor
    },
    editsubTask(data){
      this.$bvModal.show('create-subTask')
      this.$refs.add.edit(data.tarea, data.padre)
    },
    formatFecha(date){
      let options={ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12:true }
      return (new Intl.DateTimeFormat('es',options)).format(date)
    }
  },
  computed:{
    current(){
      return this.$store.state.DataModule.tareas.filter(task=>{
        if(task instanceof Routine)return (this.calendarEvent.type===Routine) && task.id===this.calendarEvent.id
        return (task instanceof this.calendarEvent.type) && task.id===this.calendarEvent.id
      })[0]
    },
    stringFranja(){
      let inicio= new Date()
      let fin= new Date()
      let franjaInicio = this.current.franjaInicio.split('Z')[0].split(':')
      inicio.setUTCHours(franjaInicio[0],franjaInicio[1],0,0)
      let franjaFin = this.current.franjaFin.split('Z')[0].split(':')
      fin.setUTCHours(franjaFin[0],franjaFin[1],0,0)
      let options={ hour: 'numeric', minute: 'numeric', hour12:true }
      return (new Intl.DateTimeFormat('es',options)).format(inicio)+" - "+(new Intl.DateTimeFormat('es',options)).format(fin)
    },
    events() {
      let events = []
      let tareas = this.$store.state.DataModule.tareas.filter(item => item instanceof Task)
      tareas.forEach(value => {
        events.push({
          start: new Date(new Date(value.fechaFin) - 60 * 7 * 1000),
          end: new Date(value.fechaFin),
          title: value.nombre,
          content: value.descripcion,
          allDay: false,
          class: 'sport',
          type: Task,
          id: value.id
        })
      })
      let repetitions = this.$store.state.DataModule.repetitions
      repetitions.forEach(value => {
        value.futuras.forEach(item=>{
          events.push({
            start: new Date(item),
            end: new Date(new Date(item).addMinutes(value.duracion)),
            title: value.nombre,
            content: value.descripcion,
            allDay: false,
            class: 'leisure',
            type: Routine,
            id: value.id
          })
        })
        value.completadas.forEach(item=>{
          events.push({
            start: new Date(item),
            end: new Date(new Date(item).addMinutes(value.duracion)),
            title: value.nombre,
            content: value.descripcion,
            allDay: false,
            class: 'leisure',
            type: Routine,
            id: value.id
          })
        })
        if(value.completadas.length>0)events.pop()
      })
      let eventRepetitions = this.$store.state.DataModule.eventsRepetitions
      eventRepetitions.forEach(value => {
        value.repeticiones.forEach(item=>{
          events.push({
            start: new Date(item),
            end: new Date(new Date(item).addMinutes(value.duracion!==0?value.duracion:7)),
            title: value.nombre,
            content: value.descripcion,
            allDay: false,
            class: 'back',
            type: TEvent,
            id: value.id,
            background:true
          })
        })
      })
      return events
    }
  },
  mounted() {
    this.$store.dispatch('DataModule/update')
    this.$store.dispatch('DataModule/updateRepetitions')
    this.$store.dispatch('DataModule/updateEventsRepetitions')
    console.log(this.$)
  }
}
</script>

<style lang="scss">
.vuecal__event.leisure {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
  .vuecal__event-title {
    font-weight: bold;
  }
}
.vuecal__event.sport {
  background-color: rgba(255, 102, 102, 0.9);
  border: 1px solid rgb(235, 82, 82);
  color: #fff;
  .vuecal__event-title {
    font-weight: bold;
  }
}
.vuecal__event.back {
  background: repeating-linear-gradient(45deg, #fff,  #fff 10px, #f2f2f2 10px, #f2f2f2 20px);/* IE 10+ */
  color: #999;
  .vuecal__event-title {
    font-weight: bold;
  }
}
</style>