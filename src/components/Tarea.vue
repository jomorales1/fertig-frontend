<template>
<!--  item de lista de tareas-->
  <b-list-group-item class=" p-0 border-0">
<!--        parte de cabecera de la tarea -->
        <b-list-group-item v-bind:active=selected @click=toggle class="border-bottom-0 btn  flex-column align-items-start">
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
                        class="p-1 mx-1"
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
              <div class="float-right col-md-3"> Prioridad: {{listItem.prioridad}} </div>
              <p v-if="event" class="text-left mb-2 col-md-9">
                Desde:
                {{ longDate(new Date(listItem.fechaInicio)) }}
              </p>

              <p class="text-left col-md-9 ">
                Hasta:
                {{ longDate(new Date(listItem.fechaFin))}}
              </p>
              <p v-if="event&&listItem.mensajeRecurrencia!=null" class="text-left ">
                {{ listItem.mensajeRecurrencia}}
              </p>

              <p class="text-left">{{ listItem.descripcion}}</p>
<!--Boton para editar tarea -->
              <b-button @click="$emit('edit',listItem)" size="sm" class="float-left my-2" >+ Subtarea</b-button>
              <b-button @click="$emit('edit',listItem)" size="sm" class="m-2">Editar Tarea</b-button>
              <b-button @click="$emit('edit',listItem)" size="sm" class="m-2">Compartir Tarea</b-button>

              <b-card bg-variant="light" class="text-left my-2" text-variant="dark" title="Subtareas">
                <b-card-text>
                  <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
                  <span v-b-toggle.collapse-2>
                    With supporting text below as a natural lead-in to additional content.
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
  </b-list-group-item>
</template>

<script>

import ListItem from "@/models/ListItem";
import Task from '@/models/Task';
import Routine from "@/models/Routine";
import TEvent from "@/models/TEvent";
export default {
  props:{
    //variables requerias para crear una vista de tarea
    listItem:{
      Type:ListItem,
      required:true
    }
  },
  data(){
    return {
      name: "Tarea",
      //flags para cambios en la vista
      show: true,
      selected: false,
      task: this.listItem instanceof Task,
      routine: this.listItem instanceof Routine,
      event: this.listItem instanceof TEvent,
      hecho:false,
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
      if(this.hecho&&this.routine) this.$store.dispatch("DataModule/uncheckRoutine",this.listItem)
      else this.$store.dispatch("DataModule/check",this.listItem)
    }
  },
  computed:{
    timeLeft(){
        //calculo del tiempo restante a partir de la fecha de finalización
        let diff =(new Date(this.listItem.fechaFin).getTime()- (new Date()).getTime()) / (1000*60*60);
        if(this.event && this.listItem.recurrencia){
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
    etiquetasList(){//metodo para separar las etiquetas por espacios
      if(this.listItem.etiqueta===""){
        return []
      }
      return this.listItem.etiqueta.trim().split(' ')
    }
  },mounted() {
    if(this.task)this.hecho=this.listItem.hecho
  }
}
</script>

<style scoped lang="scss">
 .custom-list-item:last-child {
   //estilo para que el ultimo hijo si tenga borde inferior
   border-bottom: 1px solid rgba(0, 0, 0, 0.125);
 }
</style>