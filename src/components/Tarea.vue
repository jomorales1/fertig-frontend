<template>
      <div>
        <b-list-group-item v-bind:active=selected @click=toggle class="flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <b-form-checkbox v-model=hecho>
              {{ title }}
              <small>Tarea</small>
            </b-form-checkbox>
            <small>{{ date }} </small>
          </div>
        </b-list-group-item>
        <b-list-group-item v-if=selected>
          <b-form-group>
            <b-form-input/>
          </b-form-group>
        </b-list-group-item>
      </div>
</template>

<script>
export default {
  props:{
    title:{
      Type:String,
      required: true
    },
    priority:{
      Type:Number,
      required: true
    },
    date:{
      Type:String,
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
    }
  }
}
</script>

<style scoped lang="scss">

</style>