<template>
  <!--    Modal de Amigos-->
  <b-modal id="friends" title="Amigos"  hide-footer @show="initialize">
    <b-tabs content-class="mt-3">
<!--      pestaña de mis amigos-->
      <b-tab title="Mis amigos" active>
<!--        campo de busqueda en mis amigos-->
        <div class="d-flex my-2">
          <b-input placeholder="Buscar" v-model="FriendUsername"></b-input>
        </div>
<!--        alertas de errores en mis amigos-->
        <b-alert variant="danger" v-model="FriendsError">Error al cargar Amigos</b-alert>
        <b-alert variant="danger" v-model="deleteFriendError">Error al eliminar amigo</b-alert>
<!--        lista de amigos del usuario-->
        <b-list-group>
          <b-list-group-item
              v-for="amigo in myComputedFriends"
              v-bind:key="amigo.usuario"
              class="d-flex align-items-center"
          >
<!--            icono de usuario-->
            <b-avatar class="mx-2"></b-avatar>
            <div class="d-inline-flex flex-column h-100 flex-grow-1">
            <span>
              {{amigo.nombre}}
            </span>
              <small>
                @{{amigo.usuario}}
              </small>
            </div>
<!--            boton para eliminar amigo-->
            <b-button variant="danger" @click="deleteFriend(amigo.usuario)" size="sm" class="rounded-circle align-text-bottom my-1" style="white-space: pre"> - </b-button>
          </b-list-group-item>
        </b-list-group>
      </b-tab>
<!--      pestaña para buscar nuevos amigos-->
      <b-tab title="Buscar amigos" >
<!--        campo para busqueda de usuarios-->
        <div class="d-flex my-2">
          <b-input placeholder="Buscar" class="" v-model="username"></b-input>
        </div>
<!--        alertas de errores de busqueda y de adición-->
        <b-alert variant="danger" v-model="SearchError">Error al cargar Busqueda</b-alert>
        <b-alert variant="danger" v-model="AddFriendError">Error al añadir amigo</b-alert>
<!--        lista de usuarios que coiniden con la busqueda-->
        <b-list-group>
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
<!--            boton para añadir amigo-->
            <b-button variant="success" @click="addFriend(usuario.usuario)" size="sm" class="rounded-circle float-right align-text-bottom my-1" style="white-space: pre"> + </b-button>
          </b-list-group-item>
        </b-list-group>
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
      //lista de amigos del usuario
      myFriends:[],
      //lista de resultados de busqueda
      searchedFriends:[],
      //string de busqeda en amigos del usuario
      FriendUsername:"",
      //string de busqueda en los usarios de la plataforma
      username:"",
      //flags de errores
      FriendsError :false,
      SearchError:false,
      AddFriendError:false,
      deleteFriendError:false
    }
  },
  watch:{
    //vigilar cambio en la variable username y cada vez llamar a debouncedFunction
    username:function (){
      this.debouncedFunction()
    }

  },
  computed:{
    //variable computada para filtrar a los amigos por busqueda
      myComputedFriends(){
        return this.myFriends.filter((friend)=>friend.usuario.includes(this.FriendUsername))
      }
  },
  methods:{
    //metodo para actualizar la lista e amigos del usuario
    initialize(){
      this.$store.dispatch('DataModule/getFriends').then(
          result=>{
            this.myFriends=result.data
          },
          ()=>this.FriendsError=true
      )
    },
    //metodo para añadir el amigo seleccionado y actualizar las listas
    addFriend(usuario){
      this.$store.dispatch('DataModule/addFriend',usuario).then(
          ()=>{
            this.initialize()
            this.debouncedFunction()
          },
          ()=>this.AddFriendError=true
      )
    },
    //metodo para eliminar el amigo seleccionado y actualizar las listas
    deleteFriend(usuario){
      this.$store.dispatch('DataModule/deleteFriend',usuario).then(
          ()=>{
            this.initialize()
            this.debouncedFunction()
          },
          ()=>this.deleteFriendError=true
      )
    }
  },created() {
    //deficnicion de funcion debounced (solo se ejecuta cuando pasen mas de 500ms sin ser llamada)
    let vm=this
    this.debouncedFunction=debounce(()=>{
      if(vm.username!=="")vm.$store.dispatch('DataModule/searchUser',vm.username).then((response)=>{
        //generacion de lista de usuarios de amigos
        let friends=vm.myFriends.map(item=>item.usuario)
        //filtrado del response excluyendo amigos y el usuario actual
        vm.searchedFriends=response.data.filter(item=>!friends.includes(item.usuario)&&this.$store.state.auth.user.username!==item.usuario)
      },()=>{
        vm.SearchError=true
      })
    },500)
  }
}
</script>
