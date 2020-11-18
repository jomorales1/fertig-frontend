<template>
  <b-container fluid="" class="col-lg-10 mt-5 px-lg-5 d-flex justify-content-around " style="height: 85vh; " >
    <creacion-tareas></creacion-tareas>
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
               :view-change="scrollToCurrent"
               ref="calendar"
      >
      </vue-cal>
    </div>
    <b-modal id="eventModal" >
      <div >
          {{current}}
      </div>

    </b-modal>
  </b-container>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/es.js'
import 'vue-cal/dist/vuecal.css'
import CreacionTareas from "@/components/CreacionTareas";
import Task from "@/models/Task";
import Routine from "@/models/Routine";
import TEvent from "@/models/TEvent";
export default {
  name: "Calendar",
  components:{CreacionTareas, VueCal},
  data(){
    return{
      current:{}
    }
  },
  methods:{
    onEventClick(event, e){
      this.current = this.$store.state.DataModule.tareas.filter(task=>{
        return (task instanceof event.type) && task.id===event.id
      })[0]
      this.$bvModal.show('eventModal')
      e.stopPropagation()
    },
    scrollToCurrent(emmited){
      if(emmited.view==='Month'||this.now()<emmited.startDate||this.now()>emmited.endDate)return
      this.$refs.calendar.scrollTo({
        top:(this.now.getHours() + this.now.getMinutes() / 60)*100,
        behavior: 'smooth'
    })
    }
  },
  computed:{
    events() {
      let events = [
        {
          start: '2020-11-12',
          end: '2020-11-12',
          title: 'Day off!',
          content: '<i class="v-icon material-icons">beach_access</i>',
          class: 'yellow-event',
          allDay: true,
          background: true
        },
        {
          start: '2020-11-20',
          end: '2020-11-20',
          title: 'Need to go shopping',
          icon: 'shopping_cart', // Custom attribute.
          content: 'Click to see my shopping list',
          contentFull: 'My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>', // Custom attribute.
          class: 'leisure',
          background: true
        },
        {
          start: '2020-11-22 10:00',
          end: '2020-11-22 15:00',
          title: 'Golf with John',
          icon: 'golf_course', // Custom attribute.
          content: 'Do I need to tell how many holes?',
          contentFull: 'Okay.<br>It will be a 18 hole golf course.', // Custom attribute.
          class: 'sport',
          background: true
        }
      ]
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
  background: repeating-linear-gradient(45deg, transparent, transparent 10px, #f2f2f2 10px, #f2f2f2 20px);/* IE 10+ */
  color: #999;
  .vuecal__event-title {
    font-weight: bold;
  }
}
</style>