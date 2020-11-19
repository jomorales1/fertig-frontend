<template>
  <b-container class="text-right my-5">
    <!--    pop up con formulario para crear tarea-->
    <CreacionTareas ref="create" />
    <CreacionSubtareas ref="add" :id="idParent"/>
<!--    Boton para reordenar las tareas mostradas-->
    <div class="d-flex justify-content-between">
      <div class="d-flex flex-column justify-content-end">
        <!--    Boton para quitar el filtro por etiqueta-->
        <b-button variant="outline-secondary"
                  @click="etiquetaFilter=''"
                  v-if="etiquetaFilter!==''"
                  class="etqButton mb-2"
                  size="sm"
        >{{etiquetaFilter}} <strong class="close closeEtq">x</strong> </b-button>
      </div>
      <div>
        <!--    Boton para reordenar las tareas mostradas-->
        <b-dropdown id="reorder-dropdown" text="Ordenar por" class="m-2">
          <b-dropdown-item v-for="order in orders"
                           :key="order"
                           @click="reorder(order)"
          >{{order}}</b-dropdown-item>
        </b-dropdown>
        <!--    Boton para filtrar por prioridad-->
        <b-dropdown id="filter-dropdown" right text="Filtrar por prioridad" class="m-2">
          <b-dropdown-item v-for="filter in filters"
                           :key="filter"
                           @click="filterTasks(filter)"
                           class="text-center"

          >{{filter}}</b-dropdown-item>-
        </b-dropdown>
      </div>
    </div>

<!--    Lista de tareas a partir de la variable de tareas del store de vuex-->
    <b-list-group class="mb-5">
      <Tarea
          v-for="task in tareas"
          v-bind:key="task.id+task.constructor.name"
          v-bind:listItem="task"
          v-on:etiqueta-filter="filterEtiqueta($event)"
          v-on:edit="edit($event)"
          v-on:addSubTask="addSubTask($event)"
          v-on:editSubTask="editsubTask($event)"
          v-on:newTask="addTask($event)"
      />
    </b-list-group>
  </b-container>
</template>

<script>
import Tarea from "@/components/Tarea";
import CreacionSubtareas from "@/components/CreacionSubtareas";
import CreacionTareas from '../components/CreacionTareas.vue'
import TEvent from "@/models/TEvent";
export default {
  name: "Lista",
  components:{
    Tarea,
    CreacionTareas,
    CreacionSubtareas
  },
  data(){
    return {
      idParent: 0,
      //opciones de ordenes para las tareas
      orders:[
          "Prioridad",
          "Más pronta",
          "Menos pronta"
      ],
      selectedOrder:"Más pronta",
      //opciones de filtro
      filters:["no filtrar",1,2,3,4,5],
      //prioridad por la que se esta filtrando
      priorityFilter:0,
      //variable para filtrar etiquetas
      etiquetaFilter:""
    }
  },
  methods:{
    reorder(order){
      this.selectedOrder=order
      switch (order){
        //funciones para ordenar segun lo que se escoja
        case "Prioridad":
          this.$store.state.DataModule.tareas.sort((a, b) => b.prioridad-a.prioridad);
          break
        case "Más pronta":
          this.$store.state.DataModule.tareas.sort((a, b) =>{
            let suborder=function (c,d){
              if(c.subtareas && c.subtareas.lenght>0){
                let subtaskssubtask=c.subtareas.filter((t)=>t.hecha===false)
                subtaskssubtask.sort((e,f)=>new Date(e.fechaFin)-new Date(f.fechaFin))
                c.fecha=new Date(subtaskssubtask[0].fechaFin)
              }else{
                c.fecha=new Date(c.fechaFin)
              }
              if(d.subtareas && d.subtareas.lenght>0){
                let subtaskssubtask=d.subtareas.filter((t)=>t.hecha===false)
                subtaskssubtask.sort((e,f)=>new Date(e.fechaFin)-new Date(f.fechaFin))
                d.fecha=new Date(subtaskssubtask[0].fechaFin)
              }else{
                d.fecha=new Date(d.fechaFin)
              }
              return c.fecha-d.fecha
            }
            if(!a.recurrencia){
              if(a.subtareas && a.subtareas.lenght>0){
                let subtasks=a.subtareas.filter((t)=>t.hecha===false)
                subtasks.sort(suborder)
                a.fecha=new Date(subtasks[0].fecha)
              }else{
                a.fecha=new Date(a.fechaFin)
              }
            }
            if(!b.recurrencia){
              if(b.subtareas && b.subtareas.lenght>0){
                let subtasks=b.subtareas.filter((t)=>t.hecha===false)
                subtasks.sort(suborder)
                b.fecha=new Date(subtasks[0].fecha)
              }else{
                b.fecha=new Date(b.fechaFin)
              }
            }
            return a.fecha-b.fecha
          });
          break
        case "Menos pronta":
          this.$store.state.DataModule.tareas.sort((a, b) =>{
            if(a instanceof TEvent && a.recurrencia){
              if(b instanceof TEvent && b.recurrencia){
                return b.fecha-a.fecha
              }else{
                return new Date(b.fechaFin)-a.fecha
              }
            }else{
              if(b instanceof TEvent && b.recurrencia){
                return b.fecha-new Date(a.fechaFin)
              }
            }
            return new Date(b.fechaFin)-new Date(a.fechaFin)
          });
          break
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
    edit(item){//metodo para mostrar el dialogo de creacion de tarea para edicion
      this.$refs.create.edit(item)
      this.$bvModal.show('create-activity')
    },
    addSubTask(data){
      this.idParent = data.id
      this.$refs.add.newTask(data.padre); // padre mayor
    },
    addTask(){
      this.$refs.create.newTask()
      this.$bvModal.show('create-activity')
    },
    editsubTask(data){
      this.$bvModal.show('create-subTask')
      this.$refs.add.edit(data.tarea, data.padre)
    }
  },
  computed:{
    //lista de tareas que se muestra
    tareas(){
      this.reorder(this.selectedOrder)
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
  }
  .closeEtq{
    font-size: 1.2rem;
  }
</style>