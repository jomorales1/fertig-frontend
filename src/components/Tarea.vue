<template>
<!--  item de lista de tareas-->
  <b-list-group-item class="custom-list-item">
<!--        parte de cabecera de la tarea -->
        <b-list-group-item v-bind:active=selected @click=toggle class="border-bottom-0 pointer  flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between" >
            <div class="d-inline-block align-top align-text-top">
<!--              checkbox de hecho-->
              <b-form-checkbox @change="toggleCheck" v-model=hecho class="d-inline-block"></b-form-checkbox>
<!--              titulo de tarea-->
              {{ title }}
              <small>Tarea</small>
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
              <div class="text-left" style="margin-bottom: 1rem">
                Desde:
                {{ longDate(startDate) }}
                <div class="float-right"> Prioridad: {{priority}} </div>
              </div>

              <p class="text-left ">
                Hasta:
                {{ longDate(endDate)}}
              </p>
              <p class="text-left">{{ description }}</p>
<!--Boton para editat tarea por implementar-->
              <b-button v-b-toggle.collapse-1-inner size="sm">Editar Tarea</b-button>
              <b-collapse id="collapse-1-inner" class="mt-2">
                <b-card>Aqui estará la vista de editar!</b-card>
              </b-collapse>
            </b-card>
          </b-collapse>
  </b-list-group-item>
</template>

<script>

export default {
  props:{
    //variables requerias para crear una vista de tarea
    id:{
      Type:Number,
      required:true
    },
    title:{
      Type:String,
      required: true
    },
    description:{
      Type:String,
      required: true
    },
    priority:{
      Type:Number,
      required: true
    },
    startDate:{
      Type:Date,
      required: true
    },
    endDate:{
      Type:Date,
      required: true
    },
    etiquetas:{
      Type:String,
      required: true
    },
    hecha:{
      Type:Boolean,
      required:true
    }
  },
  data(){
    return{
      name: "Tarea",
      //flags para cambios en la vista
      show: true,
      selected: false,
      hecho:this.hecha
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
        this.$store.dispatch("DataModule/check",this.id)
    }
  },
  computed:{
    timeLeft(){
        //calculo del tiempo restante a partir de la fecha de finalización
        let diff =(this.endDate.getTime() - (new Date()).getTime()) / (1000*60*60);
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
      if(this.etiquetas===""){
        return []
      }
      return this.etiquetas.split(' ')
    }
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
   border-bottom: 1px solid rgba(0, 0, 0, 0.125);;
 }
 .badges{
   margin: 2px;
 }
</style>