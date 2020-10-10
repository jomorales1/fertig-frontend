<template>
  <b-container class="text-right">
<!--    Boton para reordenar las tareas mostradas-->
    <b-dropdown id="reorder-dropdown" text="Ordenar por" class="m-md-2">
      <b-dropdown-item v-for="order in orders"
                       :key="order"
                       @click="reorder(order)"
      >{{order}}</b-dropdown-item>
    </b-dropdown>
<!--    Lista de tareas a partir de la variable de tareas del store de vuex-->
    <b-list-group>
      <Tarea
          v-for="task in this.$store.state.DataModule.tareas"
          v-bind:key="task.id"
          v-bind:title="task.nombre"
          v-bind:description="task.descripcion"
          v-bind:startDate="new Date(task.fechaInicio)"
          v-bind:endDate="new Date(task.fechaFin)"
          v-bind:priority="task.prioridad"
      />
    </b-list-group>
<!--    Boton temporal para cerrar sesión-->
    <b-button @click="$store.dispatch('auth/logout').then(()=>$router.push('/Login'))">
      Cerrar sesión
    </b-button>
<!--    pop up con formulario para crear tarea-->
    <b-modal id="create-activity"
             title="Crear Actividad"
             @ok="ok"
    >
<!--      campo para titulo de tarea-->
      <b-form-group
          id="fieldset-title"
          label-cols-sm="4"
          label-cols-lg="3"
          description="Titulo de la tarea que deseas crear"
          label="Titulo"
          label-for="title"
      ><b-form-input id="title" v-model="tarea.nombre"></b-form-input>
      </b-form-group>
<!--      campo para descripcion de tarea-->
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
<!--      campo para prioridad de tarea-->
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
<!--      campos para fecha de inicio-->
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
<!--      campos para fecha de finalización-->
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
<!--    Boton de + flotante que muestra el pop up de crear tarea-->
    <b-button v-b-modal.create-activity size="lg" class="rounded-circle position-fixed">+</b-button>
  </b-container>
</template>

<script>
import Tarea from "@/components/Tarea";
import Task from "../models/Task"
import UserService from "../services/user.service"
export default {
  name: "Lista",
  components:{
    Tarea
  },
  data(){
    return {
      //opciones de ordenes para las tareas
      orders:[
          "Prioridad",
          "Más pronta",
          "Menos pronta"
      ],
      //tarea que se crea
      tarea:new Task(),
      //campo para guardar la hora de inico
      startHour:null,
      //campo para guardar la hora de finalizacion
      endHour:null
    }
  },
  methods:{
    ok(){
      // metodo de crear tarea
      //se añade las horas a las fechas
      let h=this.endHour.split(":")
      this.tarea.fechaFin.setHours(h[0],h[1])
      h=this.startHour.split(":")
      this.tarea.fechaInicio.setHours(h[0],h[1])
      //se rellenan los campos que no se muestran en la interfaz
      this.tarea.level=0
      this.tarea.estimacion=0
      this.tarea.hecha=0
      this.tarea.etiqueta=""
      this.tarea.recordatorio=0
      //se llama al user service para crear la tarea
      UserService.createTask(this.tarea)
    },
    reorder(order){
      switch (order){
        //funciones para ordenar segun lo que se escoja
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
    //valor por defecto de prioridad
      this.tarea.prioridad=3
  },
  created(){
    //actualizar la lista de tareas cuando se carga la pagina
    this.$store.dispatch('DataModule/update')
  }
}
</script>

<style scoped lang="scss">
  .btn{
    //css para ubicar el boton flotante de +
    bottom: 30px;
    right: 10%;
  }
</style>