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
          v-for="task in this.$store.state.Tareas"
          v-bind:key="task.priority"
          v-bind:title="task.title"
          v-bind:description="task.description"
          v-bind:startDate="task.startDate"
          v-bind:endDate="task.endDate"
          v-bind:priority="task.priority"
      />
    </b-list-group>
    <b-button @click="login"/>
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
      ><b-form-input id="title" v-model="tarea.title"></b-form-input>
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
          v-model="tarea.description"
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
        <b-form-input v-model="tarea.priority" type="range" min="1" max="5"></b-form-input>
      </b-form-group>
      <b-form-group
          id="fieldset-start-date"
          label-cols-sm="4"
          label-cols-lg="3"
          description="Fecha y hora en que la tarea inicia"
          label="Fecha de inicio"
          label-for="start-date, start-time"
      >
        <b-datepicker id="start-date" value-as-date v-model="tarea.startDate" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
        <b-form-timepicker id="start-time" @change="tarea.startDate.setHours(startHour)" v-model="startHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
      </b-form-group>
      <b-form-group
          id="fieldset-end-date"
          label-cols-sm="4"
          label-cols-lg="3"
          description="Fecha y hora en que la tarea termina"
          label="Fecha de finalización"
          label-for="end-date, end-time"
      >
        <b-datepicker id="end-date" value-as-date v-model="tarea.endDate" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
        <b-form-timepicker id="end-time" v-model="endHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
      </b-form-group>
    </b-modal>
    <b-button v-b-modal.create-activity size="lg" class="rounded-circle position-fixed">+</b-button>
  </b-container>
</template>

<script>
import Tarea from "@/components/Tarea";
import User from "../models/User"
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
      tarea:{
        title:"",
        description:"",
        priority:3,
        startDate:null,
        endDate:null
      },
      startHour:null,
      endHour:null,
      user:new User('user','secret')
    }
  },
  methods:{
    ok(){
      let h=this.endHour.split(":")
      this.tarea.endDate.setHours(h[0],h[1])
      h=this.startHour.split(":")
      this.tarea.startDate.setHours(h[0],h[1])
      this.$store.state.Tareas.push(this.tarea)
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

    },
    login(){
      this.$store.dispatch('auth/login',this.user)
    }
  }
}
</script>

<style scoped lang="scss">
  .btn{
    bottom: 30px;
    right: 10%;
  }
</style>