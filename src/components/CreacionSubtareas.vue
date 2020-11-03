<template>
  <!--  template por de fecto de vue para paginas que no se han implementado-->
  <div >
    <!--    Alerta cuando hay error al crear tareas-->
    <b-alert :show="error" @dismissed="error=!error" class="text-left" variant="danger" dismissible>Error al crear Tarea</b-alert>
    <!--    pop up con formulario para crear tarea-->
    <b-modal id="create-activity"
             title="Crear Subtarea"
             @ok="ok"
    >
      <!--      template del footer del dialogo de crear tarea-->
      <template #modal-footer="{ ok, cancel}">
        <b-button variant="danger" @click="deleteItem()" v-if="isEdit">
          Eliminar
        </b-button>
        <b-button variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button variant="primary" @click="ok()">
          OK
        </b-button>
      </template>
      <template>
        <form ref="form">
          <!--        Alerta de formulario incompleto-->
          <b-alert :show="incomplete" class="text-left" variant="danger" dismissible>Por favor rellene todos los campos</b-alert>
          <!--      campo para titulo de tarea-->
          <b-form-group
              id="fieldset-title"
              label-cols-sm="4"
              label-cols-lg="3"
              description="Titulo de la subtarea que deseas crear"
              label="Titulo"
              label-for="title"
          ><b-form-input id="title" required v-model="tarea.nombre"></b-form-input>
          </b-form-group>
          <!--      campo para descripcion de tarea-->
          <b-form-group
              id="fieldset-description"
              label-cols-sm="4"
              label-cols-lg="3"
              description="Descripción de la subtarea que deseas crear"
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
              description="Prioridad de 1 a 5 de la subtarea"
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
              description="Etiquetas de la subtarea separadas por espacios"
              label="Etiquetas"
              label-for="etiquetas"
          >
            <b-form-input id="etiquetas" v-model="tarea.etiqueta"></b-form-input>
          </b-form-group>
          <!--      campos para fecha de finalización-->
          <b-form-group
              id="fieldset-end-date"
              label-cols-sm="4"
              label-cols-lg="3"
              :description="!status?'Fecha y hora en que la tarea termina':'Fecha en que las repeticiones finalizan'"
              :label="!status?'Fecha de finalización':'Fecha de finalización de la repetición'"
              label-for="end-date, end-time"
          >
            <b-datepicker required id="end-date" value-as-date v-model="tarea.fechaFin" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
            <b-form-timepicker v-if="!status" required id="end-time" v-model="endHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
          </b-form-group>
          <!--      campo para estimacion o duracion de tarea-->
          <b-form-group
              id="fieldset-estimation"
              label-cols-sm="4"
              label-cols-lg="3"
              :description="!status?'Tiempo estimado de duración de la tarea':'Tiempo de duración de la tarea'"
              :label="status?'Duración':'Estimación'"
              label-for="estimation"
          >
            <b-form-input v-if="!status&&!statusEvent" id="estimation" required type="number" v-model="tarea.estimacion"></b-form-input>
            <b-form-input v-else id="estimation" required type="number" v-model="rutina.duracion"></b-form-input>
          </b-form-group>

        </form>
      </template>
    </b-modal>
    <!--    Boton de + flotante que muestra el pop up de crear tarea-->
    <b-button v-b-modal.create-activity size="lg" @click="newTask" class="rounded-circle position-fixed cornerBtn">+</b-button>
  </div>
</template>

<script>
import Task from "@/models/Task";
import Routine from "@/models/Routine";
import TEvent from "@/models/TEvent";
import UserService from "@/services/user.service";
import ListItem from "@/models/ListItem";

export default {
  name: 'Creacionsubtareas',
  data(){
    return{
      //item a editar
      listItem:new ListItem(),
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
      //campo para guardar el tiempo de espera entre las repeticiones
      numbRep:1,
      // seleccionador del cambio de tarea a rutina
      status: false,
      // seleccionador del cambio de tarea, o rutina, a evento
      statusEvent: false,
      // seleccionador del tipo de repeticiones
      Range: 'D',
      options: [
        { value: 'H'  ,   text: 'horas'     },
        { value: 'D'  ,   text: 'dias'      },
        { value: 'S'  ,   text: 'semanas'   },
        { value: 'M'  ,   text: 'meses'     },
        { value: 'A'  ,   text: 'años'      }
      ],
      //seleccionador de dias de la semana
      week:[],
      weekOptions:[
        { value: 'l'  ,   text: 'L' },
        { value: 'm'  ,   text: 'M' },
        { value: 'x'  ,   text: 'X' },
        { value: 'j'  ,   text: 'J' },
        { value: 'v'  ,   text: 'V' },
        { value: 's'  ,   text: 'S' },
        { value: 'j'  ,   text: 'D' }
      ],
      isEdit:false
    }},
  methods:{
    newTask(){
      if(!this.error){
        Object.assign(this.$data, this.$options.data())
        this.tarea.prioridad=3
      }
    },
    deleteItem(){
      this.$store.dispatch("DataModule/delete",this.listItem).then(()=>this.$store.dispatch("DataModule/update"))
      this.$bvModal.hide("create-activity")
    },
    ok(bvModalEvt){
      //evitar que se oculte cuando no estan completos los campos
      if(!this.$refs.form.checkValidity()){
        bvModalEvt.preventDefault()
        this.incomplete=true
      }
      else{
        this.incomplete=false
        //se rellenan los campos que no se muestran en la interfaz
        this.tarea.recordatorio=0
        if (this.status){
          // metodo de crear rutina o evento con repeticiones
          //se rellenan los campos que no se muestran en la interfaz
          this.rutina=Object.assign(this.rutina,this.tarea)
          //adicion de la hora en la fecha de inicio
          let h=this.startHour.split(":")
          this.rutina.fechaInicio.setHours(h[0],h[1])
          //se hace la String de Repeticion
          if(this.week.length>0){
            let r='E'
            this.rutina.recurrencia=[
              r,
              this.week.includes('l')?1:0,
              this.week.includes('m')?1:0,
              this.week.includes('x')?1:0,
              this.week.includes('j')?1:0,
              this.week.includes('v')?1:0,
              this.week.includes('s')?1:0,
              this.week.includes('d')?1:0,
              '.S',
              this.numbRep
            ].join('')
          }else{
            this.rutina.recurrencia=[
              this.Range,
              this.numbRep
            ].join('')
          }
          if(this.statusEvent){
            //se llama al user service para crear la rutina
            UserService.createTEvent(this.rutina).then(
                ()=>{
                  this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener los eventos
                  this.error=false
                },()=>{
                  this.error=true
                }
            )}
          else{
            //se llama al user service para crear el evento con repeticion
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
          //se añade las horas a la fecha de finalización
          let h=this.endHour.split(":")
          this.tarea.fechaFin.setHours(h[0],h[1])
          if(this.statusEvent){
            this.evento=Object.assign(new TEvent(),this.tarea)
            this.evento.duracion=this.rutina.duracion
            let h=this.startHour.split(":")
            this.evento.fechaInicio=this.rutina.fechaInicio
            this.evento.fechaInicio.setHours(h[0],h[1])
            //se llama al user service para crear el evnto simple
            UserService.createTEvent(this.evento).then(
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
    edit(item){
      this.isEdit=true
      this.listItem=item
      if(item instanceof Task){
        this.tarea=item
        this.status=false
        let options = {
          hour: 'numeric', minute: 'numeric', milliseconds:'numeric'
        };

        this.endHour=new Intl.DateTimeFormat( 'es',options).format(new Date(item.fechaFin))
      }else{
        this.tarea=Object.assign(new Task(),item)
        this.rutina=Object.assign(new Routine(),item)
        if( item.recurrencia){
          this.status=true
          let recurrencia=item.recurrencia.split(' ')
          this.numbRep=recurrencia[0]
          this.Range=recurrencia[1]
          this.status='not_accepted'
        }
        if(!(item instanceof Routine)){
          this.statusEvent=true
          let options = {
            hour: 'numeric', minute: 'numeric'
          };
          this.startHour=new Intl.DateTimeFormat( 'es',options).format(new Date(item.fechaInicio))
          this.endHour=new Intl.DateTimeFormat( 'es',options).format(new Date(item.fechaFin))
        }
      }
    }
  },
  created(){
    //actualizar la lista de tareas cuando se carga la pagina
    this.$store.dispatch('DataModule/update')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.cornerBtn{
  //css para ubicar el boton flotante de +
  bottom: 30px;
  right: 10%;
  z-index: 10;
}

</style>
