<template>
  <b-container>
    <b-list-group>
      <Tarea
          v-for="task in tareas.sort((a, b) => a.priority-b.priority)"
          v-bind:key="task.priority"
          v-bind:title="task.title"
          v-bind:date="task.date"
          v-bind:priority="task.priority"
      />
    </b-list-group>
  </b-container>
</template>

<script>
import Tarea from "@/components/Tarea";
export default {
  name: "Lista",
  components:{
    Tarea
  },
  data(){
    return{
      tareas:[
        {
          title:"Titulo de la tarea",
          priority:5,
          date:"En dos dias"
        },
        {
          title:"Titulo de la tarea2",
          priority:3,
          date:"En tres dias"
        },
        {
          title:"Titulo de la tarea3",
          priority:1,
          date:"En cuatro dias"
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>