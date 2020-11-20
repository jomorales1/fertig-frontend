<template>
    <!--    Modal de Colaboradores-->
    <b-modal id="owners" title="Colaboradores"  hide-footer @show="initialize">
      <b-tabs content-class="mt-3">
        <b-tab title="Colaboradores" active>
          <!--        tab de la lista de colaboradores -->
          <div class="d-flex my-2">
            <b-input placeholder="Buscar" v-model="FriendUsername"></b-input>
          </div>
          <!--        alertas de errores en mis amigos-->
          <b-alert variant="danger" v-model="FriendsError">Error al cargar Amigos</b-alert>
          <b-alert variant="danger" v-model="deleteFriendError">Error al eliminar amigo</b-alert>
          <!--        lista de amigos del usuario-->
          <b-list-group>
            <b-list-group-item
                v-for="amigo in myComputedOwners"
                v-bind:key="amigo.username"
                class="d-flex align-items-center"
            >
              <!--            icono de usuario-->
              <b-avatar class="mx-2"></b-avatar>
              <div class="d-inline-flex flex-column h-100 flex-grow-1">
            <span>
              {{amigo.name}}
            </span>
                <small>
                  @{{amigo.username}}
                </small>
              </div>
              <!--            boton para eliminar colaborador-->
              <b-button variant="danger" size="sm" @click="deleteOwner(amigo.username)" class="rounded-circle align-text-bottom my-1" style="white-space: pre"> - </b-button>
            </b-list-group-item>
          </b-list-group>
        </b-tab>
        <b-tab title="Agregar colaborador" active>
                <!--        tab de agregar colaborador -->
                <div class="d-flex my-2">
                    <b-input placeholder="Buscar" v-model="username"></b-input>
                </div>
                <!--        alertas de errores en mis amigos-->
                <b-alert variant="danger" v-model="FriendsError">Error al cargar Amigos</b-alert>
                <b-alert variant="danger" v-model="deleteFriendError">Error al eliminar amigo</b-alert>
                <!--        lista de amigos del usuario-->
                <b-list-group>
                    <b-list-group-item
                            v-for="amigo in searchedFriends"
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
                        <b-button variant="success" @click="addOwner(amigo.usuario)"  size="sm" class="rounded-circle float-right align-text-bottom my-1" style="white-space: pre"> + </b-button>
                    </b-list-group-item>
                </b-list-group>
        </b-tab>
      </b-tabs>
    </b-modal>
</template>

<script>
    import debounce from "lodash/debounce";

    export default {
        name: "Colaboradores",
        data(){
            return{
                idTask:'',
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
                deleteFriendError:false,
                owners:[]
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
            myComputedOwners(){
                return this.owners.filter((friend)=>friend.username.includes(this.FriendUsername) && this.$store.state.auth.user.username!==friend.username)
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
              this.getOwnersList()


            },
            addOwner(user){
                this.$store.dispatch('DataModule/addOwner',{id: this.idTask, username: user}).then(
                    ()=>{
                        this.debouncedFunction()
                        this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener los eventos
                        this.$bvModal.hide('owners')
                    },
                    ()=>this.AddFriendError=true
                )
            },
            setIdTask(id){
                this.idTask = id
            },
            getOwnersList(){
              this.$store.dispatch("DataModule/getOwners", this.idTask).then(
                  response =>{
                    this.owners = response.data
                  }
              )
            },
            deleteOwner(user){
              this.$store.dispatch("DataModule/deleteOwner", {id: this.idTask, username: user}).then(
                  ()=>{
                    this.$store.dispatch("DataModule/update") // Luego de la petición, llamar a la función para obtener los eventos
                    this.$bvModal.hide('owners')
                  }
              )
            }
        },created() {
            //deficnicion de funcion debounced (solo se ejecuta cuando pasen mas de 500ms sin ser llamada)
            let vm=this
            this.debouncedFunction=debounce(()=>{
                if(vm.username!=="")vm.$store.dispatch('DataModule/searchUser',vm.username).then((response)=>{
                    //generacion de lista de usuarios de amigos
                    let friends=vm.myFriends.map(item=>item.usuario)
                    //let ownersTask = vm.owners.map(o => o.username)
                    //filtrado del response excluyendo amigos y el usuario actual
                    vm.searchedFriends=response.data.filter(item=>friends.includes(item.usuario)&&this.$store.state.auth.user.username!==item.usuario)
                },()=>{
                    vm.SearchError=true
                })
            },500)


        }
    }
</script>
