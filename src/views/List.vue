<template>
  <b-container class="text-right my-5">
    <CreacionTareas ref="create" />
<!--    Boton para reordenar las tareas mostradas-->
    <div class="d-flex justify-content-between">
      <div class="d-flex flex-column justify-content-end">
        <!--    Boton para quitar el filtro por etiqueta-->
        <b-button variant="outline-secondary"
                  @click="etiquetaFilter=''"
                  v-if="etiquetaFilter!==''"
                  class="etqButton"
                  size="sm"
        >{{etiquetaFilter}} <strong class="close closeEtq">x</strong> </b-button>
      </div>
      <div>
        <!--    Boton para reordenar las tareas mostradas-->
        <b-dropdown id="reorder-dropdown" text="Ordenar por" class="m-md-2">
          <b-dropdown-item v-for="order in orders"
                           :key="order"
                           @click="reorder(order)"
          >{{order}}</b-dropdown-item>
        </b-dropdown>
        <!--    Boton para filtrar por prioridad-->
        <b-dropdown id="filter-dropdown" right text="Filtrar por prioridad" class="m-md-2">
          <b-dropdown-item v-for="filter in filters"
                           :key="filter"
                           @click="filterTasks(filter)"
                           class="text-center"

          >{{filter}}</b-dropdown-item>-
        </b-dropdown>
      </div>
    </div>

<!--    Lista de tareas a partir de la variable de tareas del store de vuex-->
    <b-list-group class="listView">
      <Tarea
          v-for="task in tareas"
          v-bind:key="task.id+task.constructor.name"
          v-bind:listItem="task"
          v-on:etiqueta-filter="filterEtiqueta($event)"
          v-on:edit="edit($event)"
      />
    </b-list-group>
<!--    Boton temporal para cerrar sesión-->
    <b-button @click="logout">
      Cerrar sesión
    </b-button>
<!--    componente para api de facebook-->
    <v-facebook-login-scope app-id="1472299989621414" @sdk-init="handleSdkInit"/>
    <!--    pop up con formulario para crear tarea-->
  </b-container>
</template>

<script>
import Tarea from "@/components/Tarea";

import CreacionTareas from '../components/CreacionTareas.vue'

import { VFBLoginScope as VFacebookLoginScope } from 'vue-facebook-login-component'
import Routine from "@/models/Routine";
export default {
  name: "Lista",
  components:{
    Tarea,
    VFacebookLoginScope,
    CreacionTareas
  },
  data(){
    return {
      //opciones de ordenes para las tareas
      orders:[
          "Prioridad",
          "Más pronta",
          "Menos pronta"
      ],
      //opciones de filtro
      filters:["no filtrar",1,2,3,4,5],
      //prioridad por la que se esta filtrando
      priorityFilter:0,
      //variable para filtrar etiquetas
      etiquetaFilter:"",
      //objeto de API facebook
      FB:{}
    }
  },
  methods:{
    reorder(order){
      switch (order){
        //funciones para ordenar segun lo que se escoja
        case "Prioridad":
          this.$store.state.DataModule.tareas.sort((a, b) => b.prioridad-a.prioridad);
          break
        case "Más pronta":
          this.$store.state.DataModule.tareas.sort((a, b) =>{
            if(a instanceof Routine){
              if(b instanceof Routine){
                return a.next-b.next
              }else{
                return a.next-new Date(b.fechaInicio)
              }
            }else{
              if(b instanceof Routine){
                return new Date(a.fechaInicio)-b.next
              }
            }
            return new Date(a.fechaInicio)-new Date(b.fechaInicio)
          });
          break
        case "Menos pronta":
          this.$store.state.DataModule.tareas.sort((a, b) =>{
            if(a instanceof Routine){
              if(b instanceof Routine){
                return b.next-a.next
              }else{
                return new Date(b.fechaInicio)-a.next
              }
            }else{
              if(b instanceof Routine){
                return b.next-new Date(a.fechaInicio)
              }
            }
            return new Date(b.fechaInicio)-new Date(a.fechaInicio)
          });
      }
    },
    filterTasks(filter){ //modifica el filtro por prioridad
      this.$store.dispatch("DataModule/update")
      if(filter!=="no filtrar"){
        this.priorityFilter=filter
      }else{
        this.priorityFilter=0
      }
    },
    filterEtiqueta(etiqueta){//filtra segun la etiqueta seleccionada
      this.etiquetaFilter=etiqueta;
    },
    handleSdkInit({ FB}) {
      this.FB = FB//trae el objeto de facebook desde el sdkInit
    },
    logout(){
      //verifica si esta logeado con facebook y cierra sesión si así es
      this.FB.getLoginStatus(function (response){
        if(response.status==='connected'){
          this.FB.logout()
        }
      })
      //llama al logout del store
      this.$store.dispatch('auth/logout').then(()=>this.$router.push('/Login'))
    },
    edit(item){
      console.log(item)
      this.$refs.create.edit(item)
      this.$bvModal.show('create-activity')
    }
  },
  computed:{
    //lista de tareas que se muestra
    tareas(){
      //filtrar las tareas y rutinas que ya hallan finalizado
      let lista=this.$store.state.DataModule.tareas//.filter(task=>new Date(task.fechaFin)>new Date())
      //aplicación de filtros
      if(this.priorityFilter!==0){
        lista= lista.filter(task=>task.prioridad===this.priorityFilter)
      }
      if(this.etiquetaFilter!==""){
        lista= lista.filter(task=>task.etiqueta.includes(this.etiquetaFilter))
      }
      return lista

    }
  },
  created(){
    //actualizar la lista de tareas cuando se carga la pagina
    this.$store.dispatch('DataModule/update')
    this.reorder("Más pronta")
  }
}
</script>

<style scoped lang="scss">
  .btn{
    //css para ubicar el boton flotante de +
    bottom: 30px;
    right: 10%;
    z-index: 10;
  }
  .etqButton{
    white-space: pre;
    margin-bottom: 5px;
  }
  .closeEtq{
    font-size: 1.2rem;
  }
  .listView{
    margin-bottom: 5%;
  }
</style>