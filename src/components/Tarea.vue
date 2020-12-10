<template>
<!--  item de lista de tareas-->
  <b-list-group-item class=" p-0 ">
<!--        parte de cabecera de la tarea -->
        <b-list-group-item v-bind:active=selected @click=toggle class="border-0 btn  flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between" :style="hecho?'text-decoration: line-through':''" >
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

              <p class="text-left col-md-9 " v-if="!(event&&listItem.recurrencia===null)">
                Hasta:
                {{ longDate(new Date(listItem.fechaFin))}}
              </p>
              <p v-if="event&&listItem.mensajeRecurrencia!=null" class="text-left ">
                {{ listItem.mensajeRecurrencia }}
              </p>

              <p class="text-left">{{ listItem.descripcion}}</p>
<!--Boton para editar tarea -->
              <b-button v-if="routine || task" @click="$emit('addSubTask',{id: idParent, padre: listItem})" size="sm" class="float-left my-2" >+ Subtarea</b-button>
              <b-button @click="$emit('edit',listItem)" size="sm" class="m-2">Editar Tarea</b-button>
              <b-button-group ref="shareGroup">
                <b-button  size="sm" ref="share"  variant="primary">
                  <b-img src="../assets/share.svg" alt="Compartir enlace" style="height: 1rem"/>
                </b-button>
                <b-button v-if="task" size="sm" @click="$emit('showOwners',listItem.id)"  variant="primary">
                  <b-img src="../assets/add-user.svg" alt="Agregar colaborador" style="height: 1rem"/>
                </b-button>
              </b-button-group>
              <b-popover v-if="render" :target="$refs.share" :container="$refs.shareGroup" triggers="hover" placement="bottom" variant="secondary">
                <template #title>Compartir copia de {{task?'tarea':routine?'rutina':'evento'}}</template>
                <b-input-group prepend="Link:" size="sm">
                  <b-form-input :value="fullUrl" ref="urlComponent"></b-form-input>
                  <template #append>
                    <b-button @click="copy()" :disabled="visible"><img alt="copiar url" src="../assets/copy.svg" style="height: 1rem"/></b-button>
                  </template>
                </b-input-group>
              </b-popover>
              <Subtareas
                  :list-item="listItem"
                  :visible="visible"
                  v-if="routine || task"
                  v-on:addSubTask="$emit('addSubTask', $event)"
                  v-on:editSubTask="$emit('editSubTask', $event)"
              />
            </b-card>
            <h6 class="col-1" v-if="task && owners.length>0">Colaboradores:</h6>
            <b-list-group>
              <div class="row align-items-center">
                <b-list-group-item class="col-2 border-0" style="margin-left: 2.4%" v-for="o in owners" v-bind:key="o.username" >
                  <div class="row align-items-center" >
                      {{o.username}}
                      <template v-if="o.admin " >
                        <img alt="Owner" class="mx-1" src="../assets/propietario.svg" style="height: 1rem">
                        <b-button class="col-0" variant="white" size="sm" @click="removeAdminTask(o.username)">
                          <img alt="Delete" class="mx-1" src="../assets/menos.svg" style="height: 1rem">
                        </b-button>
                      </template>
                      <template v-if="!o.admin">
                        <b-button class="col-0" variant="white" size="sm" style="margin: 1%" @click="addAdminTask(o.username)">
                          <img alt="Upgrade" class="mx-1" src="../assets/flecha-hacia-arriba.svg" style="height: 1rem">
                        </b-button>
                      </template>
                  </div>
                </b-list-group-item>
              </div>
            </b-list-group>
          </b-collapse>
  </b-list-group-item>
</template>

<script>

import ListItem from "@/models/ListItem";
import Task from '@/models/Task';
import Routine from "@/models/Routine";
import TEvent from "@/models/TEvent";
import Subtareas from "@/components/Subtareas";
export default {
  components: {Subtareas},
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
      url: window.location.origin,
      owners: [],
      render:false
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
      if(this.hecho&&this.routine) {
          this.$store.dispatch("DataModule/uncheckRoutine",this.listItem)
      }
      else this.$store.dispatch("DataModule/check",this.listItem)
    },
    copy(){
      this.$refs.urlComponent.select()
      document.execCommand('copy')
    },
    addAdminTask(user){
      this.$store.dispatch("DataModule/addAdmin",{id: this.listItem.id, username: user}).then(()=>{
        this.$store.dispatch('DataModule/update')
      })
    },
    removeAdminTask(user){
      this.$store.dispatch("DataModule/removeAdmin",{id: this.listItem.id, username:user}).then(()=> {
        this.$store.dispatch('DataModule/update')
      })
    },

  },

    computed:{
    fullUrl(){
      return this.url +'/share/'+(this.task?'task':this.routine?'routine':'event')+'/'+this.listItem.id
    },
    timeLeft(){
      //calculo del tiempo restante a partir de la fecha de finalización
      let diff =(new Date(this.listItem.fechaFin).getTime()- (new Date()).getTime()) / (1000*60*60);
      if(this.event && this.listItem.recurrencia){
        diff=(this.listItem.fecha.getTime()-(new Date()).getTime()) / (1000*60*60)
      }
      let res
      if(diff>0){
        res = "en "
      }else{
        res = "hace "
        diff = Math.abs(diff)
      }
      if(diff>24){
        res=res.concat(Math.floor(diff/24).toString());
        if(Math.round(diff/24) < 2){
          res=res.concat(" Dia ")
        }else{
          res=res.concat(" Dias ")
        }
      }
      if(Math.floor(diff%24)!==0){
        res=res.concat(Math.floor(diff%24).toString())
        if(Math.floor(diff%24)<2){
          res = res.concat(" Hora ");
        }else{
          res = res.concat(" Horas ");
        }
      }
      if(diff<24 && Math.floor((diff*60)%60)!==0){
        res=res.concat(Math.floor((diff*60)%60).toString())
        if((diff*60)%60<2){
          res = res.concat(" Minuto");
        }else{
          res = res.concat(" Minutos");
        }
      }else{
        if(diff<24 && Math.floor((diff*60)%60)===0){
          res = res.concat(" Ahora");
        }
      }
      return res;
    },
    etiquetasList(){//metodo para separar las etiquetas por espacios
      if(this.listItem.etiqueta=== "" ||this.listItem.etiqueta=== null){
        return []
      }
      return this.listItem.etiqueta.trim().split(' ')
    }
  },mounted() {
        if(this.task)this.hecho=this.listItem.hecha
        if(this.listItem.subtareas){
            this.hechoSubTareas = this.listItem.subtareas.map(
                item => {
                    if(item.subtareas)this.hechoSubTareas2 = item.subtareas.map(
                        item2 =>item2.hecha
                    )
                    return item.hecha
                }
            )
        }
        if(this.listItem instanceof Task){
          this.$store.dispatch("DataModule/getOwners", this.listItem.id).then(
              response =>{
                this.owners = response.data.filter(item => this.$store.state.auth.user.username !== item.username)
              }
          )
        }
        setTimeout(()=>{this.render=true},500)

  }
}
</script>
