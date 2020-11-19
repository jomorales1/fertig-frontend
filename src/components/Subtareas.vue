<template>
  <b-card  bg-variant="light" class="text-left my-2" text-variant="dark" title="Subtareas">
    <!-- si es tarea o rutina hacer v-for, lorem = desripcion prioridad a la derecha, crear boton debajo de decripción, quitar campo etiquetas-->
    <b-list-group>
      <b-list-group-item v-for="sb in listItem.subtareas" v-bind:key="sb.id" >
        <b-card-text>
          <b-form-checkbox @change="toggleCheckSubTask(sb)" v-model="hechoSubTareas[listItem.subtareas.indexOf(sb)]" class="d-inline-block"></b-form-checkbox>
          <span>
                            <span v-b-toggle.collapse-2>
                              {{ sb.nombre }}
                            </span>
                            <b-button variant="white" @click="$emit('editSubTask',   {tarea: sb, padre: listItem})" :disabled="visible" class="p-1">
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
                <b-button size="sm" class="p-1" variant="white" :disabled="visible" @click="$emit('addSubTask',{id: sb.id, padre: listItem})" >
                  <img alt="add" src="../assets/anadir.svg" style="height: 0.8rem" class="mx-1" > Subtarea
                </b-button>
                <b-list-group>
                  <b-list-group-item v-for="sb1 in sb.subtareas" v-bind:key="sb1.id" >
                    <b-card-text>
                      <b-form-checkbox @change="toggleCheckSubTask(sb1)" v-model="hechoSubTareas2[sb.subtareas.indexOf(sb1)]" class="d-inline-block"></b-form-checkbox>
                      <span>
                              <span v-b-toggle.collapse-3>
                                {{ sb1.nombre }}
                              </span>
                                <b-button :disabled="visible" variant="white" @click="$emit('editSubTask', {tarea: sb1, padre: listItem})">
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
</template>

<script>
import ListItem from "@/models/ListItem";

export default {
  name: "Subtareas",
  props:{
    listItem:{
      Type:ListItem,
      required:true
    },
    visible:{
      Type:Boolean,
      default:false
    }
  },
  data(){
    return{
      hechoSubTareas: [],
      hechoSubTareas2: []
    }
  },
  methods:{
    toggleCheckSubTask(subTask){
      if(!this.hechoSubTarea1 || !this.hechoSubTarea2) this.$store.dispatch("DataModule/checkSubTask",{padre: this.listItem, tarea: subTask})
      //else this.$store.dispatch("DataModule/check",this.listItem)
    },
    subTaskDate(taskDate){
      let options={ year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12:true }
      return (new Intl.DateTimeFormat('en-GB',options)).format(new Date(taskDate))
    }
  },
  mounted() {
      this.hechoSubTareas = this.listItem.subtareas.map(
          item => {
            if(item.subtareas)this.hechoSubTareas2 = item.subtareas.map(
                item2 =>item2.hecha
            )
            return item.hecha
          }
      )
  }
}
</script>

<style scoped>

</style>