<template>
  <b-list-group-item class="custom-list-item">
        <b-list-group-item v-bind:active=selected @click=toggle class="border-bottom-0 pointer  flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between" >
            <div class="d-inline-block align-top align-text-top">
              <b-form-checkbox v-model=hecho class="d-inline-block"></b-form-checkbox>
              {{ title }}
              <small>Tarea</small>
            </div>
            <small>{{ timeLeft}}</small>
          </div>
        </b-list-group-item>
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

              <b-button v-b-toggle.collapse-1-inner size="sm">Editar Tarea</b-button>
              <b-collapse id="collapse-1-inner" class="mt-2">
                <b-card>Hello!</b-card>
              </b-collapse>
            </b-card>
          </b-collapse>
  </b-list-group-item>
</template>

<script>
export default {
  props:{
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
    }
  },
  data(){
    return{
      name: "Tarea",
      show: true,
      hecho: false,
      selected: false
    }
  },
  methods: {
    toggle() {
      this.selected = !this.selected
    },
    longDate(date){
      let options={ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', hour12:true }
      return (new Intl.DateTimeFormat('es',options)).format(date)
    }
  },
  computed:{
    timeLeft(){
        let diff =(this.endDate.getTime() - (new Date()).getTime()) / (1000*60*60);
        let res="en ";
        if(diff>24){
          diff /=24;
          res=res.concat(Math.abs(Math.round(diff)).toString()).concat(" Dias");
        }else{
          res=res.concat((Math.round(diff).toString()).concat(" Horas"));
        }
        return res;
    }
  }
}
</script>

<style scoped lang="scss">
 .pointer{
   cursor: pointer;
 }
 .custom-list-item{
   padding: 0;
   border: none;
 }
 .custom-list-item:last-child{
   border-bottom: 1px solid rgba(0, 0, 0, 0.125);;
 }
</style>