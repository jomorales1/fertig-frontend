<template>
  <!--  template por de fecto de vue para paginas que no se han implementado-->
  <div >
    <!--    Alerta cuando hay error al crear tareas-->
    <b-alert :show="error" @dismissed="error=!error" class="text-left" variant="danger" dismissible>{{message}}</b-alert>
    <!--    pop up con formulario para crear tarea-->
    <b-modal id="create-activity"
             title="Crear Actividad"
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
        <b-button variant="primary" @click="isEdit?save():ok()">
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
          <!--        Checkbox de rutina-->
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
                :disabled="isEdit"
            >
            </b-form-checkbox>
          </b-form-group>
          <!--        Checkbox evento-->
          <b-form-group id="fieldset-checkboxevent"
                        label-cols-sm="4"
                        label-cols-lg="3"
                        label="Autocheck al terminar "
                        description="la actividad no tendrá check de hecha">

            <b-form-checkbox
                id="checkbox-autocheck"
                v-model="statusEvent"
                name="checkbox-autocheck"
                :disabled="isEdit"
            >
            </b-form-checkbox>
          </b-form-group>
          <!--      campos para fecha de inicio de Repetición-->
          <b-form-group
              v-if="status||statusEvent"
              id="fieldset-start-repetition-date"
              label-cols-sm="4"
              label-cols-lg="3"
              description="Fecha en que las repeticiones inician"
              label="Fecha de inicio de la repetición"
              label-for="start-date, start-time"
          >
            <b-datepicker required id="start-date" value-as-date v-model="rutina.fechaInicio" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
            <b-form-timepicker required id="start-time" v-model="startHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
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
              :description="!status?'Tiempo estimado de duración en horas de la tarea':'Tiempo de duración en horas de la tarea'"
              :label="status?'Duración':'Estimación'"
              label-for="estimation"
          >
            <b-form-input v-if="!status&&!statusEvent" id="estimation" required type="number" v-model="tarea.estimacion"></b-form-input>
            <b-form-input v-else id="estimation" required type="number" v-model="rutina.duracion"></b-form-input>
          </b-form-group>
          <!--      campo de recurrencia-->
          <b-form-group
              v-if='status'
              id="fieldset-repetition-recurrency"
              label-cols-sm="4"
              label-cols-lg="3"
              description="tiempo entre cada repetición"
              label="Cada:"
              label-for="numero-repeticion, rango-repeticion">
            <b-input-group >
              <b-form-input :state="numbRep>0?null:false" required id="numero-repeticion" type="number" v-model="numbRep" ></b-form-input>
              <!--      campos para la seleccion de la recurrencia de la actividad-->
              <b-form-select required id="rango-repeticion" v-model="Range" :options="options" ></b-form-select>
            </b-input-group>
          </b-form-group>
          <!--      campo dias de la semana-->
          <b-form-group
              id="fieldset-week-days"
              v-if="Range==='S' && status"
              label-cols-sm="4"
              label-cols-lg="3"
              description="Dias de la semana en que se repite la tarea"
              label-for="week-days"
              label="Dias de la semana"
          >
            <b-checkbox-group id="week-days" class="w-100" buttons :options="weekOptions" v-model="week"/>
          </b-form-group>
          <!--      campo franja inicio-->
          <b-form-group
              v-if='status&&Range==="H"'
              id="fieldset-from-repeticion"
              label-cols-sm="4"
              label-cols-lg="3"
              description="Hora en que la tarea inicia en cada repeticion"
              label-for="desde"
          >
            <div >Inicia a las:</div>
            <b-form-input required id="desde" type="time" v-model="rutina.franjaInicio"></b-form-input>
          </b-form-group>
          <!--      campo frnaja fin-->
          <b-form-group
              v-if='status&&Range==="H"'
              id="fieldset-to-repeticion"
              label-cols-sm="4"
              label-cols-lg="3"
              description="Hora en que la tarea finaliza en cada repeticion"
              label-for="hasta"
          >
            <div >Y termina a las:</div>
            <b-form-input required id="hasta" type="time" v-model="rutina.franjaFin"></b-form-input>
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
  name: 'CreacionTareas',
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
        { value: 'd'  ,   text: 'D' }
      ],
      isEdit:false,
      message:"Error al crear Tarea"
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
          let weekDays =parseInt( [
            this.week.includes('l')?1:0,
            this.week.includes('m')?1:0,
            this.week.includes('x')?1:0,
            this.week.includes('j')?1:0,
            this.week.includes('v')?1:0,
            this.week.includes('s')?1:0,
            this.week.includes('d')?1:0,
          ].reverse().join(''),2)
          if(this.week.length>0){
            let r='E'
            this.rutina.recurrencia=[r, weekDays, '.S', this.numbRep].join('')
          }else{
            this.rutina.recurrencia=[this.Range, this.numbRep].join('')
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
      this.week=[]
      this.tarea=item
      if(item instanceof Task){
        this.status=false
        let options = {
          hour: 'numeric', minute: 'numeric', milliseconds:'numeric'
        };
        this.listItem.fechaFin=new Date(this.listItem.fechaFin)
        this.endHour=new Intl.DateTimeFormat( 'es',options).format(new Date(item.fechaFin))
      }else{
        //this.tarea=Object.assign(new Task(),item)
        //this.rutina=Object.assign(new Routine(),item)
        this.rutina=item
        let options = {
          hour: 'numeric', minute: 'numeric'
        };
        this.listItem.fechaFin=new Date(this.listItem.fechaFin)
        this.listItem.fechaInicio=new Date(this.listItem.fechaInicio)
        this.startHour=new Intl.DateTimeFormat( 'es',options).format(new Date(item.fechaInicio))
        if( item.recurrencia){
          this.status=true
          if(item.recurrencia[0]==='E'){
            this.Range='S'
            let weekDays=parseInt(item.recurrencia.substring(1,item.recurrencia.indexOf('.')),10).toString(2).split('').reverse()
            for(let i=0;i<weekDays.length;i++){
              if(weekDays[i]==="1"){
                this.week.push(this.weekOptions[i].value)
              }
            }
            this.numbRep=item.recurrencia[item.recurrencia.indexOf('.')+2]
          }else{
            this.Range=item.recurrencia[0]
            this.numbRep=item.recurrencia[1]

          }
          this.status=true
        }
        if(!(item instanceof Routine)){
          this.statusEvent=true
          this.endHour=new Intl.DateTimeFormat( 'es',options).format(new Date(item.fechaFin))
        }
      }
    },
    save(){
      if (this.listItem instanceof TEvent && this.listItem.recurrencia) {
        let h=this.startHour.split(":")
        this.listItem.fechaInicio.setHours(h[0],h[1])
        //se hace la String de Repeticion
        let weekDays =parseInt( [
          this.week.includes('l')?1:0,
          this.week.includes('m')?1:0,
          this.week.includes('x')?1:0,
          this.week.includes('j')?1:0,
          this.week.includes('v')?1:0,
          this.week.includes('s')?1:0,
          this.week.includes('d')?1:0,
        ].reverse().join(''),2)
        if(this.week.length>0){
          let r='E'
          this.listItem.recurrencia=[r, weekDays, '.S', this.numbRep].join('')
        }else{
          this.listItem.recurrencia=[this.Range, this.numbRep].join('')
        }
      }
      this.$store.dispatch('DataModule/edit',this.listItem).then(
          ()=>{
            this.$bvModal.hide('create-activity')
            this.$store.dispatch('DataModule/update')
          },
          ()=>{
            this.error=true
            this.message="Error al editar Tarea"
            this.$bvModal.hide('create-activity')
          }
      )
    }
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
