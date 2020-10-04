<template>
  <b-container class="text-right">
    <b-dropdown id="reorder-dropdown" text="Ordenar por" class="m-md-2">
      <b-dropdown-item v-for="order in orders"
                       :key="order"
                       @click="reorder(order)"
      >{{order}}</b-dropdown-item>
    </b-dropdown>
    <b-list-group>
      <Tarea
          v-for="task in this.$store.state.DataModule.tareas"
          v-bind:key="task.prioridad"
          v-bind:title="task.nombre"
          v-bind:description="task.descripcion"
          v-bind:startDate="new Date(task.fechaInicio)"
          v-bind:endDate="new Date(task.fechaFin)"
          v-bind:priority="task.prioridad"
      />
    </b-list-group>
<!--    <b-button @click="tareas"/>-->
    <b-modal id="create-activity"
             title="Crear Actividad"
             @ok="ok"
    >
      <b-form-group
          id="fieldset-title"
          label-cols-sm="4"
          label-cols-lg="3"
          description="Titulo de la tarea que deseas crear"
          label="Titulo"
          label-for="title"
      ><b-form-input id="title" v-model="tarea.nombre"></b-form-input>
      </b-form-group>
      <b-form-group
          id="fieldset-description"
          label-cols-sm="4"
          label-cols-lg="3"
          description="Descripción de la tarea que deseas crear"
          label="Descripción"
          label-for="description"
      ><b-form-textarea
          id="description"
          rows="3"
          max-rows="8"
          v-model="tarea.descripcion"
      ></b-form-textarea>
      </b-form-group>
      <b-form-group
          id="fieldset-priority"
          label-cols-sm="4"
          label-cols-lg="3"
          description="Prioridad de 1 a 5 de la tarea"
          label="Prioridad"
          label-for="priority"
      >
        <b-form-input v-model="tarea.prioridad" type="range" min="1" max="5"></b-form-input>
      </b-form-group>
      <b-form-group
          id="fieldset-start-date"
          label-cols-sm="4"
          label-cols-lg="3"
          description="Fecha y hora en que la tarea inicia"
          label="Fecha de inicio"
          label-for="start-date, start-time"
      >
        <b-datepicker id="start-date" value-as-date v-model="tarea.fechaInicio" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
        <b-form-timepicker id="start-time" v-model="startHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
      </b-form-group>
      <b-form-group
          id="fieldset-end-date"
          label-cols-sm="4"
          label-cols-lg="3"
          description="Fecha y hora en que la tarea termina"
          label="Fecha de finalización"
          label-for="end-date, end-time"
      >
        <b-datepicker id="end-date" value-as-date v-model="tarea.fechaFin" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
        <b-form-timepicker id="end-time" v-model="endHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
      </b-form-group>
    </b-modal>
    <b-button v-b-modal.create-activity size="lg" class="rounded-circle position-fixed">+</b-button>
  </b-container>
</template>

<script>
import Tarea from "@/components/Tarea";
import User from "../models/User"
import Task from "../models/Task"
import UserService from "../services/user.service"
export default {
  name: "Lista",
  components:{
    Tarea
  },
  data(){
    return {
      orders:[
          "Prioridad",
          "Más pronta",
          "Menos pronta"
      ],
      tarea:new Task(),
      startHour:null,
      endHour:null,
      user:new User('user','secret','myemail@email.com',"pablito")
    }
  },
  methods:{
    ok(){
      let h=this.endHour.split(":")
      this.tarea.fechaFin.setHours(h[0],h[1])
      h=this.startHour.split(":")
      this.tarea.fechaInicio.setHours(h[0],h[1])
      this.tarea.level=0
      this.tarea.estimacion=0
      this.tarea.hecha=0
      this.tarea.etiqueta=""
      this.tarea.recordatorio=0
      UserService.createTask(this.tarea)
    },
    reorder(order){
      switch (order){
        case "Prioridad":
          this.$store.state.Tareas.sort((a, b) => a.priority-b.priority);
          break
        case "Más pronta":
          this.$store.state.Tareas.sort((a, b) => a.endDate-b.endDate);
          break
        case "Menos pronta":
          this.$store.state.Tareas.sort((a, b) => b.endDate-a.endDate);
      }
    }
  },
    mounted(){
      //this.$store.dispatch('auth/register',new User("Santiago","secret","lkilni@jk.kh","santiago"))
      this.tarea.prioridad=3
  },
  created(){
    this.$store.dispatch('auth/login',new User("Santiago","secret")).then(()=>{
      this.$store.dispatch('DataModule/update')
    })
  }
}
</script>

<style scoped lang="scss">
  .btn{
    bottom: 30px;
    right: 10%;
  }
</style>