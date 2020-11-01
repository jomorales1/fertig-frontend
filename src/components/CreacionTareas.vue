<template>
  <!--  template por de fecto de vue para paginas que no se han implementado-->
  <div >
    <!--    Alerta cuando hay error al crear tareas-->
    <b-alert :show="error" @dismissed="error=!error" class="text-left" variant="danger" dismissible>Error al crear Tarea</b-alert>
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
        <!--        Checkbox de rutina-->
        <b-form-group id="fieldset-checkbox"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      label="Repeticiones"
                      label-for="recurrency"
                      description="La actividad puede repetirse">

          <b-form-checkbox
              id="checkbox-Repetition"
              v-model="rutinaCheck"
              name="checkbox-Repetition"
              value="accepted"
              unchecked-value= "not_accepted"
          >
          </b-form-checkbox>
        </b-form-group>
        <!--      campos para fecha de inicio-->
        <b-form-group
            v-if="rutinaCheck==='not_accepted'"
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
          <b-datepicker required id="start-date" value-as-date v-model="tarea.fechaInicio" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
          <b-form-timepicker required id="start-time" v-model="startHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
        </b-form-group>
        <!--      campos para fecha de finalización-->
        <b-form-group
            v-if="rutinaCheck==='not_accepted'"
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

          <b-datepicker required id="end-date" value-as-date v-model="tarea.fechaFin" :locale="'es'" placeholder="Ninguna Fecha seleccionada"></b-datepicker>
          <b-form-timepicker required id="end-time" v-model="endHour" placeholder="Ninguna hora seleccionada"></b-form-timepicker>
        </b-form-group>
        <!--      campos para rangos en Repeticiónes-->
        <b-form-group
            v-if='rutinaCheck==="accepted"'
            id="fieldset-repetition-recurrency"
            label-cols-sm="4"
            label-cols-lg="3"
            description="tiempo entre cada repetición"
            label-for="cada, numero-repeticion, rango-repeticion">
          <label id="cada">Cada:</label>
          <b-form-input required id="numero-repeticion" type="number" v-model="numbRep"></b-form-input>
          <!--      campos para la seleccion de la recurrencia de la actividad-->
          <b-form-select required id="rango-repeticion" v-model="Range" :options="optionsRange" ></b-form-select>
        </b-form-group>
        <!--      Si es semanas, entonces poner los dias de la semana, si es meses poner los dias del mes-->
        <b-form-group
            v-if='rutinaCheck==="accepted"'
            id="fieldset-repetition-recurrency-p2"
            label-cols-sm="4"
            label-cols-lg="3"
            description="tiempo entre cada repetición"
            label-for="dias-semana, dias-mes">

          <b-form-checkbox-group
              v-if='Range==="s"'
              id="dias-semana"
              v-model="diasSemana"
              :options="optionsDiasSemana"
              name="flavour-1"
          ></b-form-checkbox-group>
          <b-form-input
              v-if='Range==="m"'
              id="dias-mes"
              type="number"
              v-model="diasMes"></b-form-input>

        </b-form-group>
        <b-form-group
            v-if='rutinaCheck==="accepted"'
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
            v-if='rutinaCheck==="accepted"'
            id="franja-repeticion"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Solo se hara la repeticion en esta franja"
            label-for="desdeFranja, hastaFranja"
        >
          <b-form-input required id="desdeFranja" type="time" v-model="rutina.franjainicio"></b-form-input>
          <b-form-input required id="hastaFranja" type="time" v-model="rutina.franjafinal"></b-form-input>
        </b-form-group>
        <b-form-group
            v-if='rutinaCheck==="accepted"'
            id="fieldset-from-repeticion"
            label-cols-sm="4"
            label-cols-lg="3"
            description="Hora en que la tarea inicia en cada repeticion"
            label-for="desde"
        >
          <div >Inicia a las:</div>
          <b-form-input required id="desde" type="time" v-model="fromHour"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldset-checkboxevent"
                      label-cols-sm="4"
                      label-cols-lg="3"
                      label="Autocheck al terminar "
                      description="la actividad no tendrá check de hecha">

          <b-form-checkbox
              id="checkbox-autocheck"
              v-model="eventoCheck"
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
  </div>
</template>

<script>
import Task from "@/models/Task";
import Routine from "@/models/Routine";
import TEvent from "@/models/TEvent";
import UserService from "@/services/user.service";

export default {
  name: 'CreacionTareas',
  props: {
  },
  data(){
    return{

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
      numbRep:null,
      //campo para guardar la hora de inico de las repeticiones
      fromHour:null,
      //campo para guardar la hora de finalizacion de las repeticiones
      toHour:null,
      // seleccionador del cambio de tarea a rutina
      rutinaCheck: 'not_accepted',
      // seleccionador del cambio de tarea, o rutina, a evento
      eventoCheck: 'not_accepted',
      // seleccionador del tipo de repeticiones
      Range: null,
      optionsRange: [
        { value: 'h'  ,   text: 'horas'     },
        { value: 'd'  ,   text: 'dias'      },
        { value: 's'  ,   text: 'semanas'   },
        { value: 'm'  ,   text: 'meses'     },
        { value: 'a'  ,   text: 'años'      }
      ],
      // seleccionador de los dias a la semana a repetir
      diasSemana: null,
      optionsDiasSemana:[
        { value: 'l'  ,   text: 'Lunes'     },
        { value: 'm'  ,   text: 'Martes'    },
        { value: 'x'  ,   text: 'Miercoles' },
        { value: 'j'  ,   text: 'Jueves'    },
        { value: 'v'  ,   text: 'Viernes'   },
        { value: 's'  ,   text: 'Sabado'    },
        { value: 'd'  ,   text: 'Domingo'   }
      ],
      diasMes: null

    }},
  methods:{
    ok(bvModalEvt){
      //evitar que se oculte cuando no estan completos los campos
      if(!this.$refs.form.checkValidity()){
        bvModalEvt.preventDefault()
        this.incomplete=true
      }
      else{
        this.incomplete=false
        //se rellenan los campos que no se muestran en la interfaz
        this.tarea.level=0
        this.tarea.estimacion=0
        this.tarea.hecha=0
        this.tarea.recordatorio=0
        if (this.rutinaCheck==="accepted"){
          // metodo de crear rutina
          //se rellenan los campos que no se muestran en la interfaz
          this.rutina=Object.assign(new Routine(),this.tarea)
          //se hace la String de Repeticion
          let n=this.numbRep
          let r=this.Range
          let fh=this.fromHour
          let th=this.toHour
          let ds=this.diasSemana
          let dm=this.diasMes
          this.rutina.recurrencia=[n, r, ds, dm, fh, th].join(' ')
          //se añade las horas a las fechas
          let h=this.endHour.split(":")
          this.rutina.fechaFin.setHours(h[0],h[1])
          h=this.startHour.split(":")
          this.rutina.fechaInicio.setHours(h[0],h[1])

          if(this.eventoCheck==="accepted"){
            //se llama al user service para crear la tarea
            UserService.createTEvent(this.rutina).then(
                ()=>{
                  this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener los eventos
                  this.error=false
                  this.tarea=new Task()
                  this.rutina=new Routine()
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
                  this.tarea=new Task()
                  this.rutina=new Routine()
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
          if(this.eventoCheck==="accepted"){
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.btn{
//css para ubicar el boton flotante de +
bottom: 30px;
  right: 10%;
  z-index: 10;
}

</style>
