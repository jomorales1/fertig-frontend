<template>
<!--  item de lista de tareas-->
  <b-list-group-item class=" p-0 ">
<!--        parte de cabecera de la tarea -->
        <b-list-group-item v-bind:active=selected @click=toggle class="border-0 btn  flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between" >
            <div class="d-inline-block align-top align-text-top">
<!--              checkbox de hecho-->
              <b-form-checkbox :disabled="visible" @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
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
          <b-collapse ref="collapse" id="collapse-1" :visible="visible" class="border-0" v-model=selected >
            <b-card class="border-0">
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
              <b-button @click="addSubTask()" size="sm" class="float-left my-2" >+ Subtarea</b-button>
              <b-button @click="$emit('edit',listItem)" size="sm" class="m-2">Editar Tarea</b-button>
              <b-button ref="share" size="sm" class="m-2">Compartir Tarea</b-button>
<b-popover v-if="selected" :target="$refs.share" :container="$refs.collapse" triggers="focus" placement="bottom" variant="secondary">
                <template #title>Compartir copia de {{task?'tarea':routine?'rutina':'evento'}}</template>
                <b-input-group prepend="Link:" size="sm">
                  <b-form-input :value="fullUrl" ref="urlComponent"></b-form-input>
                  <template #append>
                    <b-button @click="copy()"><img alt="copiar url" src="../assets/copy.svg" style="height: 1rem"/></b-button>
                  </template>
                </b-input-group>
              </b-popover>
              <b-card v-if="routine || task" bg-variant="light" class="text-left my-2" text-variant="dark" title="Subtareas">
                <!-- si es tarea o rutina hacer v-for, lorem = desripcion prioridad a la derecha, crear boton debajo de decripción, quitar campo etiquetas-->
                <b-list-group>
                  <b-list-group-item v-for="sb in listItem.subtareas" v-bind:key="sb.id" >
                      <b-card-text>
                          <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
                          <span>
                            <span v-b-toggle.collapse-2>
                              {{ sb.nombre }}
                            </span>
                            <b-button variant="white" @click="editsubTask(sb)" class="p-1">
                              <img alt="Pencil" src="../assets/pencil.svg" style="height: 1rem">
                            </b-button>
                        <span class="float-right">{{subTaskDate(sb.fechaFin)}}</span>
                        </span>
                          <b-collapse id="collapse-2">
                            <b-card bg-variant="light" class="text-left my-2" text-variant="dark" >
                              <!-- aqui empiezan las subtareas-->
                              <b-card-text>
                                {{sb.descripcion}}
                                <span class="float-right">
                                  Prioridad: {{sb.prioridad}}
                                  <br>
                                  Estimación: {{sb.estimacion + (sb.estimacion!==1?" horas":" hora")}}
                                </span>
                                <br>
                                <b-button size="sm" class="p-1" variant="white" @click="addSubTask(idParent = sb.id)" >
                                  <img alt="add" src="../assets/anadir.svg" style="height: 0.8rem" class="mx-1" > Subtarea
                                </b-button>
                                <b-list-group>
                                  <b-list-group-item v-for="sb1 in sb.subtareas" v-bind:key="sb1.id" >
                                    <b-card-text>
                                      <b-form-checkbox @change="toggleCheck" v-if="task||routine" v-model=hecho class="d-inline-block"></b-form-checkbox>
                                      <span>
                              <span v-b-toggle.collapse-3>
                                {{ sb1.nombre }}
                              </span>
                                <b-button variant="white" >
                              <img alt="Pencil" src="../assets/pencil.svg" style="height: 1rem">
                              </b-button>
                                <span class="float-right">{{subTaskDate(sb1.fechaFin)}}</span>
                                </span>
                                      <b-collapse id="collapse-3">
                                        <b-card bg-variant="light" class="text-left my-2" text-variant="dark" >
                                          <!-- aqui empiezan las subtareas-->
                                          <b-card-text>
                                            {{sb1.descripcion}}
                                            <span class="float-right">
                                    Prioridad: {{sb1.prioridad}}
                                    <br>
                                    Estimación: {{sb1.estimacion + (sb1.estimacion!==1?" horas":" hora")}}
                                  </span>
                                          </b-card-text>
                                        </b-card>
                                      </b-collapse>
                                    </b-card-text>
                                  </b-list-group-item>
                                </b-list-group>
                              </b-card-text>
                            </b-card>
                          </b-collapse>
                        </b-card-text>
                    </b-list-group-item>
                  </b-list-group>
              </b-card>
            </b-card>
          </b-collapse>
    <Creacionsubtareas ref="add" :id="this.idParent"/>
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
    },
    visible:{
      Type:Boolean,
      default:false
    },
  },
  data(){
    return {
      idParent: this.listItem.id,
      name: "Tarea",
      //flags para cambios en la vista
      show: true,
      selected: this.visible,
      task: this.listItem instanceof Task,
      routine: this.listItem instanceof Routine,
      event: this.listItem instanceof TEvent,
      hecho:false,
      url: window.location.origin
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
    },
    addSubTask(id){
        this.parentId = id
        this.$refs.add.newTask()
    },
    subTaskDate(taskDate){
      let options={ year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12:true }
      return (new Intl.DateTimeFormat('en-GB',options)).format(new Date(taskDate))
    },
    editsubTask(item){
        this.$bvModal.show('create-subTask')
        this.$refs.add.edit(item)
        console.log(item)
    },
    copy(){
      this.$refs.urlComponent.select()
      document.execCommand('copy')
    }
  },
  computed:{
    fullUrl(){
      return this.url +'/share/'+(this.task?'Task':this.routine?'Routine':'Event')+'/'+this.listItem.id
    },
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

</style>