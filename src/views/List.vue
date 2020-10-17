<template>
  <b-container class="text-right">
<!--    Alerta cuando hay error al crear tareas-->
    <b-alert :show="error" class="text-left" variant="danger" dismissible>Error al crear Tarea</b-alert>
<!--    Boton para reordenar las tareas mostradas-->
    <b-dropdown id="reorder-dropdown" text="Ordenar por" class="m-md-2">
      <b-dropdown-item v-for="order in orders"
                       :key="order"
                       @click="reorder(order)"
      >{{order}}</b-dropdown-item>
    </b-dropdown>
    <b-dropdown id="filter-dropdown" text="filtrar por Prioridad" class="m-md-2">
      <b-dropdown-item v-for="filter in filters"
                       :key="filter"
                       @click="filterTasks(filter)"
      >{{filter}}</b-dropdown-item>-
    </b-dropdown>
<!--    Lista de tareas a partir de la variable de tareas del store de vuex-->
    <b-list-group>
      <Tarea
          v-for="task in tareas"
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
      <form ref="form">
<!--        Alerta de formulario incompleto-->
        <b-alert :show="incomplete" class="text-left" variant="danger" dismissible>Por favor rellene todos los campos</b-alert>
<!--      campo para titulo de tarea-->
        <b-form-group
            id="fieldset-title"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Titulo de la tarea que deseas crear"
            label="Titulo"
            label-for="title"
        ><b-form-input id="title" required v-model="tarea.nombre"></b-form-input>
        </b-form-group>
  <!--      campo para descripcion de tarea-->
        <b-form-group
            id="fieldset-description"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Descripción de la tarea que deseas crear"
            label="Descripción"
            label-for="description"
        ><b-form-textarea required
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
            v-if="status==='not_accepted'"
            id="fieldset-start-date"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Fecha y hora en que la tarea inicia"
            label="Fecha de inicio"
            label-for="start-date, start-time"
        >
          <b-datepicker required id="start-date" value-as-date v-model="tarea.fechaInicio" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
          <b-form-timepicker required id="start-time" v-model="startHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
        </b-form-group>
        <!--      campos para fecha de inicio de Repetición-->
        <b-form-group
            v-else
            id="fieldset-start-repetition-date"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Fecha en que las repeticiones inician"
            label="Fecha de inicio de la repetición"
            label-for="start-date, start-time"
        >
          <b-datepicker required id="start-date" value-as-date v-model="rutina.fechaInicio" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
        </b-form-group>
  <!--      campos para fecha de finalización-->
        <b-form-group
            v-if="status==='not_accepted'"
            id="fieldset-end-date"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Fecha y hora en que la tarea termina"
            label="Fecha de finalización"
            label-for="end-date, end-time"
        >
          <b-datepicker required id="end-date" value-as-date v-model="tarea.fechaFin" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
          <b-form-timepicker required id="end-time" v-model="endHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
        </b-form-group>
        <!--      campos para fecha de finalización de Repetición-->
        <b-form-group
            v-else
            id="fieldset-end-repetition-date"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Fecha en que las repeticiones finalizan"
            label="Fecha de finalización de la repetición"
            label-for="end-date, end-time"
        >

          <b-datepicker required id="end-date" value-as-date v-model="rutina.fechaFin" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
        </b-form-group>
        <b-form-group id="fieldset-checkbox"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      label="Repeticiones"
                      label-for="recurrency"
                      description="La actividad puede repetirse">

          <b-form-checkbox
              id="checkbox-Repetition"
              v-model="status"
              name="checkbox-Repetition"
              value="accepted"
              unchecked-value= "not_accepted"
          >
          </b-form-checkbox>
        </b-form-group>
        <b-form-group
            v-if="status==='accepted'"
            id="fieldset-repetition-recurrency"
            label-cols-sm="4"
            label-cols-lg="3"
            description="tiempo entre cada repetición"
            label-for="cada, numero-repeticion, rango-repeticion">
          <label id="cada">Cada:</label>
          <b-form-input required id="numero-repeticion" type="number" v-model="numbRep"></b-form-input>
          <!--      campos para la seleccion de la recurrencia de la actividad-->
          <b-form-select required id="rango-repeticion" v-model="range" :options="options" ></b-form-select>
        </b-form-group>
        <b-form-group
            v-if="status==='accepted'"
            id="fieldset-from-repeticion"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Hora en que la tarea inicia en cada repeticion"
            label-for="desde"
        >
          <div >Inicia a las:</div>
          <b-form-input required id="desde" type="time" v-model="fromHour"></b-form-input>
        </b-form-group>
        <b-form-group
            v-if="status==='accepted'"
            id="fieldset-to-repeticion"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Hora en que la tarea finaliza en cada repeticion"
            label-for="hasta"
        >
          <div >Y termina a las:</div>
          <b-form-input required id="hasta" type="time" v-model="toHour"></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
<!--    Boton de + flotante que muestra el pop up de crear tarea-->
    <b-button v-b-modal.create-activity size="lg" class="rounded-circle position-fixed">+</b-button>
  </b-container>
</template>

<script>
import Tarea from "@/components/Tarea";
import Task from "../models/Task"
import UserService from "../services/user.service"
import Routine from "@/models/Routine"

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
      endHour:null,
      //variable error al crear tarea
      error:false,
      //variable de formulario de creación de tarea incmoleto
      incomplete:false,
      //opciones de filtro
      filters:["no filtrar",1,2,3,4,5],
      priorityFilter:0,
      //rutina que se crea
      rutina:new Routine(),
      //campo para guardar el tiempo de espera entre las repeticiones
      numbRep:null,
      //campo para guardar la hora de inico de las repeticiones
      fromHour:null,
      //campo para guardar la hora de finalizacion de las repeticiones
      toHour:null,
      // seleccionador del cambio de tarea a rutina
      status: 'not_accepted',
      // seleccionador del tipo de repeticiones
      Range: null,
      options: [
        { value: 'h'  ,   text: 'horas'     },
        { value: 'd'  ,   text: 'dias'      },
        { value: 's'  ,   text: 'semanas'   },
        { value: 'm'  ,   text: 'meses'     },
        { value: 'a'  ,   text: 'años'      }
      ]
    }
  },
  methods:{
    ok(bvModalEvt){
      //evitar que se oculte cuando no estan completos los campos
      if(!this.$refs.form.checkValidity()){
        bvModalEvt.preventDefault()
        this.incomplete=true
      }else{
        this.incomplete=false
        if (status==='accepted'){
          // metodo de crear rutina
          //se rellenan los campos que no se muestran en la interfaz
          this.rutina.level=0
          this.rutina.estimacion=0
          this.rutina.hecha=0
          this.rutina.etiqueta=""
          this.rutina.recordatorio=0
          //se hace la String de Repeticion
          let n=this.numbRep
          let r=this.Range
          let fh=this.fromHour
          let th=this.toHour
          this.rutina.StringRepeticion=[n, r, fh, th].join(' ')

          //se llama al user service para crear la tarea
          UserService.createRoutine(this.rutina).then(
              ()=>{
                this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener las rutinas
              },()=>{
                this.error=true
              }
          )

        }else {
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
          UserService.createTask(this.tarea).then(
              ()=>{
                this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener las tareas
              },()=>{
                this.error=true
              }
          )
        }


      }
    },check(){

    },
    reorder(order){
      switch (order){
        //funciones para ordenar segun lo que se escoja
        case "Prioridad":
          this.$store.state.DataModule.tareas.sort((a, b) => a.priority-b.priority);
          break
        case "Más pronta":
          this.$store.state.DataModule.tareas.sort((a, b) => a.endDate-b.endDate);
          break
        case "Menos pronta":
          this.$store.state.DataModule.tareas.sort((a, b) => b.endDate-a.endDate);
      }
    },
    filterTasks(filter){
      this.$store.dispatch("DataModule/update")
      if(filter!=="no filtrar"){
        this.priorityFilter=filter
      }else{
        this.priorityFilter=0
      }
    }
  },
  computed:{
    tareas(){
      if(this.priorityFilter!==0){
        return this.$store.state.DataModule.tareas.filter(task=>task.prioridad===this.priorityFilter)
      }else{
        return this.$store.state.DataModule.tareas
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