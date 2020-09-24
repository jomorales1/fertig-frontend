<template>
  <b-container>
    <b-list-group>
      <Tarea/>
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
  tareas:[
    {
      title:"Titulo de la tarea",
      priority:5,
      date:"En tres dias"
    }
  ]
}
</script>

<style scoped>

</style>