<template>
  <!--    Modal de Amigos-->
  <b-modal id="friends" title="Amigos"  hide-footer @show="initialize">
    <b-tabs content-class="mt-3">
      <b-tab title="Mis amigos" active>
        <div class="d-flex my-2">
          <b-input placeholder="Buscar" v-model="FriendUsername"></b-input>
          <!--        <b-button size="sm" class="my-2 my-sm-0" type="submit" >-->
          <!--          <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24px" height="24px"><path d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z"/></svg>-->
          <!--        </b-button>-->
        </div>
        <b-alert variant="danger" v-model="FriendsError">Error al cargar Amigos</b-alert>
        <b-list-group>
          <b-list-group-item
              v-for="amigo in myComputedFriends"
              v-bind:key="amigo.usuario"
              class="d-flex align-items-center"
          >
            <b-avatar class="mx-2"></b-avatar>
            <div class="d-inline-flex flex-column h-100 flex-grow-1">
            <span>
              {{amigo.nombre}}
            </span>
              <small>
                @{{amigo.usuario}}
              </small>
            </div>
            <b-button variant="danger" size="sm" class="rounded-circle align-text-bottom my-1" style="white-space: pre"> - </b-button>
          </b-list-group-item>
        </b-list-group>
      </b-tab>
      <b-tab title="Buscar amigos" >
        <div class="d-flex my-2">
          <b-input placeholder="Buscar" class="" v-model="username"></b-input>
          <!--        <b-button size="sm" class="my-2 my-sm-0" type="submit" >-->
          <!--          <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="24px" height="24px"><path d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z"/></svg>-->
          <!--        </b-button>-->
        </div>
        <b-alert variant="danger" v-model="SearchError">Error al cargar Busqueda</b-alert>
        <b-list-group-item
            v-for="usuario in searchedFriends"
            v-bind:key="usuario.usuario"
            class="d-flex align-items-center"
        >
          <b-avatar class="mx-2"></b-avatar>
          <div class="d-inline-flex flex-column h-100 flex-grow-1">
            <span>
              {{usuario.nombre}}
            </span>
            <small>
              @{{usuario.usuario}}
            </small>
          </div>
          <b-button variant="success" size="sm" class="rounded-circle float-right align-text-bottom my-1" style="white-space: pre"> + </b-button>
        </b-list-group-item>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  name: "Amigos",
  data(){
    return{
      myFriends:[],
      searchedFriends:[],
      FriendUsername:"",
      username:"",
      FriendsError :false,
      SearchError:false
    }
  },
  watch:{
    username:function (){
      this.debouncedFunction()
    }

  },
  computed:{
      myComputedFriends(){
        return this.myFriends.filter((friend)=>friend.usuario.includes(this.username))
      }
  },
  methods:{
    initialize(){
      this.$store.dispatch('DataModule/getFriends').then(
          result=>{
            this.myFriends=result.data
          },
          ()=>this.FriendsError=true
      )
    }
  },created() {
    let vm=this
    this.debouncedFunction=debounce(()=>{
      if(vm.username!=="")vm.$store.dispatch('DataModule/searchUser',vm.username).then((response)=>{
        vm.searchedFriends=response.data
      },()=>{
        vm.SearchError=true
      })
    },500)
  }
}
</script>

<style scoped>

</style>