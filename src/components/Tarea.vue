<template>
<!--  item de lista de tareas-->
  <b-list-group-item class="custom-list-item">
<!--        parte de cabecera de la tarea -->
        <b-list-group-item v-bind:active=selected @click=toggle class="border-bottom-0 pointer  flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between" >
            <div class="d-inline-block align-top align-text-top">
<!--              checkbox de hecho-->
              <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
<!--              titulo de tarea-->
              {{ listItem.nombre }}
<!--              etiqueta de tipo de tarea-->
              <small v-if="task">Tarea</small>
              <small v-if="routine">Rutina</small>
              <small v-if="event && !routine">Evento</small>
<!--              lista de etiquetas de la tarea-->
              <b-badge  v-for="etiqueta in etiquetasList"
                       :key="etiqueta"
                        class="badges"
                        :variant="selected?'secondary':'primary'"
                        @click="$emit('etiqueta-filter',etiqueta)"
              >
                {{etiqueta}}
              </b-badge>
            </div>
<!--            tiempo restante para que termine la tarea-->
            <small>{{ timeLeft}}</small>
          </div>
        </b-list-group-item>
<!--    informacion detallada de tarea que se abre cuando se da click en la cabecera-->
          <b-collapse id="collapse-1"  v-model=selected >
            <b-card>
              <div v-if="event" class="text-left divPrioridad" style="margin-bottom: 1rem">
                Desde:
                {{ longDate(new Date(listItem.fechaInicio)) }}
                <div class="float-right prioridad"> Prioridad: {{listItem.prioridad}} </div>
              </div>

              <p class="text-left ">
                Hasta:
                {{ longDate(new Date(listItem.fechaFin))}}
              </p>
              <p v-if="event&&listItem.mensajeRecurrencia!=null" class="text-left ">
                {{ listItem.mensajeRecurrencia}}
              </p>

              <p class="text-left">{{ listItem.descripcion}}</p>
<!--Boton para editar tarea -->
              <b-button @click="addSubTask()" size="sm" class="float-left">+ Subtarea</b-button>
              <b-button @click="$emit('edit',listItem)" size="sm" class="mx-2">Editar Tarea</b-button>
              <b-button @click="$emit('edit',listItem)" size="sm" class="mx-2">Compartir Tarea</b-button>
              <b-card v-if="routine || task" bg-variant="light" class="text-left my-2" text-variant="dark" title="Subtareas">
                <!-- si es tarea o rutina hacer v-for-->
                <b-card-text>
                  <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
                  <span v-b-toggle.collapse-2>
                    With supporting text below as a natural lead-in to additional content.
                    <img alt="Pencil" src="../assets/pencil.svg" style="height: 1rem">
                    <span class="float-right">01/02/2020</span>
                  </span>
                  <b-collapse id="collapse-2">
                    <b-card bg-variant="light" class="text-left my-2" text-variant="dark" >
                      <b-card-text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales leo augue, in laoreet libero tincidunt non. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
                      </b-card-text>
                      <b-card-text>
                        <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
                        With supporting text below as a natural lead-in to additional content.
                      </b-card-text>
                      <b-card-text>
                        <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
                        With supporting text below as a natural lead-in to additional content.
                      </b-card-text>
                      <b-card-text>
                        <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
                        With supporting text below as a natural lead-in to additional content.
                      </b-card-text>
                      <!--                <b-button href="#" variant="primary">Go somewhere</b-button>-->
                    </b-card>
                  </b-collapse>
                </b-card-text>
                <b-card-text>
                  <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
                  With supporting text below as a natural lead-in to additional content.
                </b-card-text>
                <b-card-text>
                  <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
                  With supporting text below as a natural lead-in to additional content.
                </b-card-text>
<!--                <b-button href="#" variant="primary">Go somewhere</b-button>-->
              </b-card>
            </b-card>
          </b-collapse>
    <Creacionsubtareas ref="add" :id="idParent"/>
  </b-list-group-item>
</template>

<script>

import ListItem from "@/models/ListItem";
import Task from '@/models/Task';
import Routine from "@/models/Routine";
import TEvent from "@/models/TEvent";
import Creacionsubtareas from "./CreacionSubtareas";
export default {
  components: {Creacionsubtareas},
  props:{
    //variables requerias para crear una vista de tarea
    listItem:{
      Type:ListItem,
      required:true
    }
  },
  data(){
    return {
      idParent: this.listItem.id,
      name: "Tarea",
      //flags para cambios en la vista
      show: true,
      selected: false,
      task: this.listItem instanceof Task,
      routine: this.listItem instanceof Routine,
      event: this.listItem instanceof TEvent,
      timeMesure: {
        'h': 'horas',
        'd': 'dias',
        's': 'semanas',
        'm': 'meses',
        'a': 'años'
      }
    }
  },
  methods: {
    toggle(event) {
      //cambiar estado de selección de la tarea si el evento no viene del checkbox
      if(event.target.tagName==="LABEL"||event.target.tagName==="INPUT"||event.target.tagName==="SPAN")return
      this.selected = !this.selected
    },
    longDate(date){
      //formateo de la fecha para mostrar
      let options={ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', hour12:true }
      return (new Intl.DateTimeFormat('es',options)).format(date)
    },
    toggleCheck(){
        this.$store.dispatch("DataModule/check",this.listItem.id)
    },
    addSubTask(id){
        this.parentId = id
        this.$bvModal.show('create-subTask')
    }
  },
  computed:{
    hecho(){
      if (this.routine){
        return false
      }
      return this.listItem.hecha
    },
    timeLeft(){
        //calculo del tiempo restante a partir de la fecha de finalización
        let diff =(new Date(this.listItem.fechaFin).getTime()- (new Date()).getTime()) / (1000*60*60);
        if(this.routine){
          diff=(this.listItem.fecha.getTime()-(new Date()).getTime()) / (1000*60*60)
        }
        let res="en ";
        if(diff>24){
          diff /=24;
          res=res.concat(Math.abs(Math.round(diff)).toString()).concat(" Dias");
        }else{
          res=res.concat((Math.round(diff).toString()).concat(" Horas"));
        }
        return res;
    },
    etiquetasList(){
      if(this.listItem.etiqueta===""){
        return []
      }
      return this.listItem.etiqueta.trim().split(' ')
    },

  }
}
</script>

<style scoped lang="scss">
 .pointer{
   //estilo de mouse en forma de mano
   cursor: pointer;
 }
 .custom-list-item{
   //estilo para quitar bordes y margen a los items dentro del item principal
   padding: 0;
   border: none;
 }
 .custom-list-item:last-child {
   //estilo para que el ultimo hijo si tenga borde inferior
   border-bottom: 1px solid rgba(0, 0, 0, 0.125);
 }
 .badges{
   margin: 2px;
 }
 @media(max-device-width: 768px){
   .prioridad{
      float: left !important;
   }
   .divPrioridad{
     display: flex!important;
     flex-direction: column-reverse!important;
   }

 }

</style>