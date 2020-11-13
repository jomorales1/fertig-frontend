<template>
  <b-container fluid class="col-lg-10 mt-5 px-lg-5 d-flex justify-content-around " style="height: 85vh; " >
    <creacion-tareas></creacion-tareas>
      <vue-cal selected-date="2020-11-19"
               :time-from="0"
               :disable-views="['years', 'year','day']"
               active-view="month"
               events-on-month-view="short"
               :events="events"
               class="vuecal--green-theme "
               locale="es"
               :showAllDayEvents="true"
               timeCellHeight="200"
               minCellWidth="100"
      >
      </vue-cal>
  </b-container>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/es.js'
import 'vue-cal/dist/vuecal.css'
import CreacionTareas from "@/components/CreacionTareas";
import Task from "@/models/Task";
export default {
  name: "Calendar",
  components:{CreacionTareas, VueCal},
  data(){
    return{
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
          allDay: true
        },
        {
          start: '2020-11-20',
          end: '2020-11-20',
          title: 'Need to go shopping',
          icon: 'shopping_cart', // Custom attribute.
          content: 'Click to see my shopping list',
          contentFull: 'My shopping list is rather long:<br><ul><li>Avocados</li><li>Tomatoes</li><li>Potatoes</li><li>Mangoes</li></ul>', // Custom attribute.
          class: 'leisure',
          allDay: true
        },
        {
          start: '2020-11-22 10:00',
          end: '2020-11-22 15:00',
          title: 'Golf with John',
          icon: 'golf_course', // Custom attribute.
          content: 'Do I need to tell how many holes?',
          contentFull: 'Okay.<br>It will be a 18 hole golf course.', // Custom attribute.
          class: 'sport'
        }
      ]
      let tareas = this.$store.state.DataModule.tareas.filter(item => item instanceof Task)
      tareas.forEach(value => {
        events.push({
          start: new Date(new Date(value.fechaFin) - 60 * 40 * 1000),
          end: new Date(value.fechaFin),
          title: value.nombre,
          content: value.descripcion,
          allDay: false,
          class: 'sport'
        })
      })
      let repetitions = this.$store.state.DataModule.repetitions
      repetitions.forEach(value => {
        value.futuras.forEach(item=>{
          events.push({
            start: new Date(item),
            end: new Date(new Date(item).addHours(Math.floor(value.duracion)).addMinutes((value.duracion*60)%60)),
            title: value.nombre,
            content: value.descripcion,
            allDay: false,
            class: 'leisure'
          })
        })

      })
      return events
    }
  },
  mounted() {
    this.$store.dispatch('DataModule/update')
    this.$store.dispatch('DataModule/updateRepetitions')
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
</style>