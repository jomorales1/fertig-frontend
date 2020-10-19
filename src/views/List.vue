<template>
  <b-container class="text-right">
<!--    Alerta cuando hay error al crear tareas-->
    <b-alert :show="error" @dismissed="error=!error" class="text-left" variant="danger" dismissible>Error al crear Tarea</b-alert>
<!--    Boton para reordenar las tareas mostradas-->
    <div class="d-flex justify-content-between">
      <div class="d-flex flex-column justify-content-end">
        <!--    Boton para quitar el filtro por etiqueta-->
        <b-button variant="outline-secondary"
                  @click="etiquetaFilter=''"
                  v-if="etiquetaFilter!==''"
                  class="etqButton"
                  size="sm"
        >{{etiquetaFilter}} <strong class="close closeEtq">x</strong> </b-button>
      </div>
      <div>
        <!--    Boton para reordenar las tareas mostradas-->
        <b-dropdown id="reorder-dropdown" text="Ordenar por" class="m-md-2">
          <b-dropdown-item v-for="order in orders"
                           :key="order"
                           @click="reorder(order)"
          >{{order}}</b-dropdown-item>
        </b-dropdown>
        <!--    Boton para filtrar por prioridad-->
        <b-dropdown id="filter-dropdown" right text="Filtrar por prioridad" class="m-md-2">
          <b-dropdown-item v-for="filter in filters"
                           :key="filter"
                           @click="filterTasks(filter)"
                           class="text-center"

          >{{filter}}</b-dropdown-item>-
        </b-dropdown>
      </div>
    </div>

<!--    Lista de tareas a partir de la variable de tareas del store de vuex-->
    <b-list-group>
      <Tarea
          v-for="task in tareas"
          v-bind:key="task.id"
          v-bind:id="task.id"
          v-bind:title="task.nombre"
          v-bind:description="task.descripcion"
          v-bind:startDate="new Date(task.fechaInicio)"
          v-bind:endDate="new Date(task.fechaFin)"
          v-bind:priority="task.prioridad"
          v-bind:etiquetas="task.etiqueta"
          v-bind:hecha="task.hecha"
          v-on:etiqueta-filter="filterEtiqueta($event)"
      />
    </b-list-group>
<!--    Boton temporal para cerrar sesión-->
    <b-button @click="logout">
      Cerrar sesión
    </b-button>
<!--    componente para api de facebook-->
    <v-facebook-login-scope app-id="1472299989621414" @sdk-init="handleSdkInit"/>
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
          <b-form-input id="priority" v-model="tarea.prioridad" type="range" min="1" max="5"></b-form-input>
        </b-form-group>
        <!--      campo para etiquetas de tarea-->
        <b-form-group
            id="fieldset-etiqueta"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Etiquetas de la tarea separadas por espacios"
            label="Etiquetas"
            label-for="etiquetas"
        >
          <b-form-input id="etiquetas" v-model="tarea.etiqueta"></b-form-input>
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
            v-if='status==="accepted"'
            id="fieldset-repetition-recurrency"
            label-cols-sm="4"
            label-cols-lg="3"
            description="tiempo entre cada repetición"
            label-for="cada, numero-repeticion, rango-repeticion">
          <label id="cada">Cada:</label>
          <b-form-input required id="numero-repeticion" type="number" v-model="numbRep"></b-form-input>
          <!--      campos para la seleccion de la recurrencia de la actividad-->
          <b-form-select required id="rango-repeticion" v-model="Range" :options="options" ></b-form-select>
        </b-form-group>
        <b-form-group
            v-if='status==="accepted"'
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
            v-if='status==="accepted"'
            id="fieldset-to-repeticion"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Hora en que la tarea finaliza en cada repeticion"
            label-for="hasta"
        >
          <div >Y termina a las:</div>
          <b-form-input required id="hasta" type="time" v-model="toHour"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldset-checkboxevent"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      label="Autocheck al terminar "
                      description="la actividad no aparecerá en la lista">

          <b-form-checkbox
              id="checkbox-autocheck"
              v-model="statusEvent"
              name="checkbox-autocheck"
              value="accepted"
              unchecked-value= "not_accepted"
          >
          </b-form-checkbox>
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
import TEvent from "@/models/TEvent";

import { VFBLoginScope as VFacebookLoginScope } from 'vue-facebook-login-component'
export default {
  name: "Lista",
  components:{
    Tarea,
    VFacebookLoginScope
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
      //rutina que se crea
      rutina:new Routine(),
      //evento que se crea
      evento:new TEvent(),
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
      //prioridad por la que se esta filtrando
      priorityFilter:0,
      //campo para guardar el tiempo de espera entre las repeticiones
      numbRep:null,
      //campo para guardar la hora de inico de las repeticiones
      fromHour:null,
      //campo para guardar la hora de finalizacion de las repeticiones
      toHour:null,
      // seleccionador del cambio de tarea a rutina
      status: 'not_accepted',
      // seleccionador del cambio de tarea, o rutina, a evento
      statusEvent: 'not_accepted',
      //variable para filtrar etiquetas
      etiquetaFilter:"",
      // seleccionador del tipo de repeticiones
      Range: null,
      options: [
        { value: 'h'  ,   text: 'horas'     },
        { value: 'd'  ,   text: 'dias'      },
        { value: 's'  ,   text: 'semanas'   },
        { value: 'm'  ,   text: 'meses'     },
        { value: 'a'  ,   text: 'años'      }
      ],
      //objeto de API facebook
      FB:{}
    }
  },
  methods:{
    ok(bvModalEvt){
      //evitar que se oculte cuando no estan completos los campos
      if(!this.$refs.form.checkValidity()){
        bvModalEvt.preventDefault()
        this.incomplete=true
      }
      else{
        this.incomplete=false
        if (this.status==="accepted"){
          // metodo de crear rutina
          //se rellenan los campos que no se muestran en la interfaz
          this.rutina.nombre=this.tarea.nombre
          this.rutina.descripcion=this.tarea.descripcion
          this.rutina.prioridad=this.tarea.prioridad
          this.rutina.etiqueta=this.tarea.etiqueta
          this.rutina.level=0
          this.rutina.estimacion=0
          this.rutina.hecha=0
          this.rutina.recordatorio=0
          //se hace la String de Repeticion
          let n=this.numbRep
          let r=this.Range
          let fh=this.fromHour
          let th=this.toHour
          this.rutina.recurrencia=[n, r, fh, th].join(' ')

          if(this.statusEvent==="accepted"){
            //se llama al user service para crear la tarea
            UserService.createTEvent(this.rutina).then(
                ()=>{
                  this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener los eventos
                  this.error=false
                },()=>{
                  this.error=true
                }
            )}
          else{
            //se llama al user service para crear la tarea
            UserService.createRoutine(this.rutina).then(
                ()=>{
                  this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener las rutinas
                  this.error=false
                },()=>{
                  this.error=true
                }
            )}

        }
        else {
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
          this.tarea.recordatorio=0

          if(this.statusEvent==="accepted"){
            //se llama al user service para crear la tarea


            UserService.createTEvent(this.tarea).then(
                ()=>{
                  this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener los eventos
                  this.error=false
                },()=>{
                  this.error=true
                }
            )}
          else{
            //se llama al user service para crear la tarea
            UserService.createTask(this.tarea).then(
                ()=>{
                  this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener las tareas
                  this.error=false
                },()=>{
                  this.error=true
                }
            )}
        }
      }
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
    filterTasks(filter){ //modifica el filtro por prioridad
      this.$store.dispatch("DataModule/update")
      if(filter!=="no filtrar"){
        this.priorityFilter=filter
      }else{
        this.priorityFilter=0
      }
    },
    filterEtiqueta(etiqueta){//filtra segun la etiqueta seleccionada
      this.etiquetaFilter=etiqueta;
    },
    handleSdkInit({ FB}) {
      this.FB = FB//trae el objeto de facebook desde el sdkInit
    },
    logout(){
      //verifica si esta logeado con facebook y cierra sesión si así es
      this.FB.getLoginStatus(function (response){
        if(response.status==='connected'){
          this.FB.logout()
        }
      })
      //llama al logout del store
      this.$store.dispatch('auth/logout').then(()=>this.$router.push('/Login'))
    }
  },
  computed:{
    //lista de tareas que se muestra
    tareas(){
      let lista=this.$store.state.DataModule.tareas
      //aplicación de filtros
      if(this.priorityFilter!==0){
        lista= lista.filter(task=>task.prioridad===this.priorityFilter)
      }
      if(this.etiquetaFilter!==""){
        lista= lista.filter(task=>task.etiqueta.includes(this.etiquetaFilter))
      }
      return lista

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
  .etqButton{
    white-space: pre;
    margin-bottom: 5px;
  }
  .closeEtq{
    font-size: 1.2rem;
  }
</style>