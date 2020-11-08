<template>
<div class="container my-5">
  <b-button @click="addCopy" v-if="task.length>0" size="lg" class="mb-5 "> Añadir {{dic[$route.params.type]}} a mi lista de actividades</b-button>
  <b-list-group v-if="task.length>0" class="text-right">
    <Tarea ref="tarea" v-on:edit="makeToast()" v-for="result in task" :list-item="result" :visible="true" :key="result.id"/>
  </b-list-group>
  <b-alert variant="danger" :show="error">Error {{dic[$route.params.type]}} no encontrada</b-alert>
</div>
</template>

<script>
import Tarea from "@/components/Tarea";
import Task from "@/models/Task";
import TEvent from "@/models/TEvent";
import Routine from "@/models/Routine";
export default {
  name: "Share",
  components: {Tarea},
  data(){
    return {
      task:[],
      dic:{
        Task:"tarea",
        Event:"evento",
        Routine:"rutina"
      },
      error:false
    }
  },
  methods:{
    addCopy(){
      this.$store.dispatch('DataModule/addCopy',this.task[0].id).then(
          ()=>{
            this.$router.push('/List')
          },error=>{
            this.$bvToast.toast(error.response.data.message, {
              title: `Error al añadir tarea`,
              variant: 'danger',
              solid: true,
              toaster:'b-toaster-top-center'
            })
          }
      )
    },
    makeToast() {
      this.$bvToast.toast('Para poder editar la tarea debes agregarla a tu lista', {
        title: `Alerta`,
        variant: 'danger',
        solid: true,
        toaster:'b-toaster-top-center'
      })
    },
    getContent(id,type){
      this.$store.dispatch('DataModule/getCopy',{id,type}).then(
          response=>{
            switch (type){
              case 'Task':
                this.task=[Object.assign(new Task(),response.data)]
                break
              case 'Event':
                this.task=[Object.assign(new TEvent(),response.data)]
                break
              case 'Routine':
                this.task=[Object.assign(new Routine(),response.data)]
                this.task[0].fecha=new Date(this.task[0].fechaInicio)
                break
            }
      },()=>this.error=true)
    }
  },
  created() {
    this.getContent(this.$route.params.id,this.$route.params.type);
  }
}
</script>